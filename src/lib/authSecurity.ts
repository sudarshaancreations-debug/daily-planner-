import crypto from 'crypto';

/**
 * Zero-Trust Authentication & Session Security Module
 * Implements the 20-Point Auth Hardening Checklist:
 * - HMAC-SHA256 signed tokens with timingSafeEqual verification (no hardcoded "secret")
 * - Server-side session revocation & version invalidation on logout / password reset
 * - Brute-force login lockout (5 failed attempts -> 5-minute cooldown)
 * - Cryptographic single-use 5-minute OTP & Password Reset tokens (never leaked in responses)
 * - Single-use OAuth CSRF `state` token generation & verification
 */

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  provider: string;
  jti: string;
  ver: number;
  iat: number;
  exp: number;
}

interface LockoutRecord {
  failures: number;
  lockedUntil: number;
}

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

interface ResetTokenRecord {
  email: string;
  expiresAt: number;
  used: boolean;
}

interface OAuthStateRecord {
  expiresAt: number;
}

// Ephemeral cryptographically strong fallback if AUTH_SECRET env var is unset
const EPHEMERAL_FALLBACK_SECRET = crypto.randomBytes(32).toString('hex');

function getSigningSecret(): string {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || EPHEMERAL_FALLBACK_SECRET;
}

function hashValue(val: string): string {
  return crypto.createHmac('sha256', getSigningSecret()).update(val).digest('hex');
}

// Server-side in-memory stores
const revokedTokenIds = new Set<string>();
const userSessionVersions = new Map<string, number>();
const loginLockouts = new Map<string, LockoutRecord>();
const otpStore = new Map<string, OtpRecord>();
const resetTokenStore = new Map<string, ResetTokenRecord>();
const oauthStateStore = new Map<string, OAuthStateRecord>();

export function getUserSessionVersion(userId: string): number {
  return userSessionVersions.get(userId) ?? 1;
}

export function invalidateAllUserSessions(userId: string): number {
  const nextVer = getUserSessionVersion(userId) + 1;
  userSessionVersions.set(userId, nextVer);
  return nextVer;
}

export function revokeSessionToken(jti: string): void {
  if (jti) {
    revokedTokenIds.add(jti);
  }
}

export function signSessionToken(params: {
  sub: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  provider: string;
  ttlSeconds?: number;
}): { token: string; payload: SessionPayload } {
  const now = Math.floor(Date.now() / 1000);
  const ttl = params.ttlSeconds ?? 7 * 24 * 60 * 60; // 7 days default

  const payload: SessionPayload = {
    sub: params.sub,
    email: params.email,
    name: params.name,
    role: params.role ?? 'user',
    provider: params.provider,
    jti: crypto.randomBytes(16).toString('hex'),
    ver: getUserSessionVersion(params.sub),
    iat: now,
    exp: now + ttl,
  };

  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const data = `${headerB64}.${payloadB64}`;
  const signature = crypto.createHmac('sha256', getSigningSecret()).update(data).digest('base64url');

  return { token: `${data}.${signature}`, payload };
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expectedSig = crypto.createHmac('sha256', getSigningSecret()).update(data).digest('base64url');

  const sigBuf = Buffer.from(sigB64);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.sub || !payload.jti || !payload.exp || payload.exp < now) {
      return null;
    }

    if (revokedTokenIds.has(payload.jti)) {
      return null;
    }

    if (payload.ver !== getUserSessionVersion(payload.sub)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Brute-force lockout check (Max 5 failed attempts -> 5-minute lock)
 */
export function checkLoginLockout(identifier: string): { locked: boolean; retryAfterSeconds: number } {
  const key = identifier.toLowerCase().trim();
  const rec = loginLockouts.get(key);
  if (!rec) return { locked: false, retryAfterSeconds: 0 };

  const now = Date.now();
  if (rec.lockedUntil > now) {
    return { locked: true, retryAfterSeconds: Math.ceil((rec.lockedUntil - now) / 1000) };
  }

  if (rec.lockedUntil !== 0 && rec.lockedUntil <= now) {
    loginLockouts.delete(key);
  }
  return { locked: false, retryAfterSeconds: 0 };
}

export function recordFailedLogin(identifier: string): { locked: boolean; remainingAttempts: number } {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const rec = loginLockouts.get(key) ?? { failures: 0, lockedUntil: 0 };

  rec.failures += 1;
  if (rec.failures >= 5) {
    rec.lockedUntil = now + 5 * 60 * 1000; // 5-minute lockout
    loginLockouts.set(key, rec);
    return { locked: true, remainingAttempts: 0 };
  }

  loginLockouts.set(key, rec);
  return { locked: false, remainingAttempts: 5 - rec.failures };
}

export function clearLoginLockout(identifier: string): void {
  loginLockouts.delete(identifier.toLowerCase().trim());
}

/**
 * 6-Digit Cryptographic OTP (5-min expiry, max 3 attempts, single-use)
 * Note: Never return the OTP in an API response.
 */
export function issueOtp(identifier: string): { expiresAt: number } {
  const key = identifier.toLowerCase().trim();
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes max

  otpStore.set(key, {
    codeHash: hashValue(code),
    expiresAt,
    attempts: 0,
  });

  // In production, dispatch via email/SMS provider (never log or return in HTTP response)
  return { expiresAt };
}

export function verifyOtp(identifier: string, code: string): { valid: boolean; reason?: string } {
  const key = identifier.toLowerCase().trim();
  const rec = otpStore.get(key);
  if (!rec) return { valid: false, reason: 'Invalid or expired verification code.' };

  if (Date.now() > rec.expiresAt) {
    otpStore.delete(key);
    return { valid: false, reason: 'Verification code expired. Please request a new one.' };
  }

  rec.attempts += 1;
  if (rec.attempts > 3) {
    otpStore.delete(key);
    return { valid: false, reason: 'Too many invalid attempts. Please request a new code.' };
  }

  const submittedHash = hashValue(code.trim());
  const valid = crypto.timingSafeEqual(Buffer.from(submittedHash), Buffer.from(rec.codeHash));

  if (valid) {
    otpStore.delete(key); // Single-use
    return { valid: true };
  }

  return { valid: false, reason: 'Invalid verification code.' };
}

/**
 * Single-use, 5-minute cryptographic password reset token
 */
export function issuePasswordResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  resetTokenStore.set(hashValue(token), {
    email: email.toLowerCase().trim(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    used: false,
  });
  return token;
}

export function consumePasswordResetToken(token: string): { valid: boolean; email?: string } {
  const hashed = hashValue(token.trim());
  const rec = resetTokenStore.get(hashed);
  if (!rec || rec.used || Date.now() > rec.expiresAt) {
    resetTokenStore.delete(hashed);
    return { valid: false };
  }
  rec.used = true;
  resetTokenStore.delete(hashed); // Single-use only
  return { valid: true, email: rec.email };
}

/**
 * Single-use OAuth CSRF state parameter (10-min TTL)
 */
export function issueOAuthState(): string {
  const state = crypto.randomBytes(24).toString('hex');
  oauthStateStore.set(state, { expiresAt: Date.now() + 10 * 60 * 1000 });
  return state;
}

export function verifyOAuthState(state: string | undefined | null): boolean {
  if (!state || typeof state !== 'string') return false;
  const rec = oauthStateStore.get(state);
  if (!rec) return false;
  oauthStateStore.delete(state); // Single-use
  return Date.now() <= rec.expiresAt;
}
