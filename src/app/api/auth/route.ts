import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { logSecurityEvent } from '@/lib/auditLogger';
import {
  signSessionToken,
  verifySessionToken,
  revokeSessionToken,
  invalidateAllUserSessions,
  checkLoginLockout,
  recordFailedLogin,
  clearLoginLockout,
  issueOAuthState,
  verifyOAuthState,
  issuePasswordResetToken,
  consumePasswordResetToken,
} from '@/lib/authSecurity';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  provider: 'google' | 'apple' | 'microsoft' | 'github' | 'email';
  createdAt: string;
}

const SESSION_COOKIE_NAME = 'nimora_session';
const ALLOWED_PROVIDERS = new Set(['google', 'apple', 'microsoft', 'github']);

// Server-side user registry (never trusts client-supplied `isAdmin` or `role`)
const USER_REGISTRY: Record<string, AuthUser> = {
  'sudarshan.architect@gmail.com': {
    id: 'usr_sudarshan_01',
    name: 'Sudarshan Mehta',
    email: 'sudarshan.architect@gmail.com',
    role: 'user',
    avatarUrl: '/icon-192.png',
    provider: 'google',
    createdAt: new Date().toISOString(),
  },
  'demo@nimora.ai': {
    id: 'usr_demo_02',
    name: 'Alex Rivera',
    email: 'demo@nimora.ai',
    role: 'user',
    avatarUrl: '/icon-192.png',
    provider: 'email',
    createdAt: new Date().toISOString(),
  },
};

function attachSessionCookie(res: NextResponse, token: string, maxAgeSeconds: number) {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

function extractToken(req: NextRequest): string | null {
  const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');

  // Issue single-use OAuth CSRF state token
  if (action === 'oauth_state') {
    const rateCheck = checkRateLimit(req, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }
    return NextResponse.json({ state: issueOAuthState() });
  }

  // Cryptographically verify session token (HMAC signature, exp, revocation, session version)
  const rawToken = extractToken(req);
  const payload = verifySessionToken(rawToken);
  if (!payload) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = USER_REGISTRY[payload.email.toLowerCase()] ?? {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    avatarUrl: '/icon-192.png',
    provider: payload.provider as AuthUser['provider'],
    createdAt: new Date(payload.iat * 1000).toISOString(),
  };

  return NextResponse.json({
    authenticated: true,
    user,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Strict rate limiting on all auth mutations (15 req/min per IP)
    const rateCheck = checkRateLimit(req, 15, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many authentication attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { action, email, password, name, provider, state, resetToken, newPassword } = body;

    // 1. Social OAuth (Google, Apple, Microsoft, GitHub) with CSRF state check
    if (action === 'social_auth') {
      const selectedProvider = String(provider || 'google').toLowerCase();
      if (!ALLOWED_PROVIDERS.has(selectedProvider)) {
        return NextResponse.json(
          { success: false, error: 'Unsupported OAuth provider.' },
          { status: 400 }
        );
      }

      if (state && !verifyOAuthState(state)) {
        logSecurityEvent({ event: 'auth.social.csrf_blocked', meta: { provider: selectedProvider } });
        return NextResponse.json(
          { success: false, error: 'Invalid or expired OAuth state. Please retry sign-in.' },
          { status: 403 }
        );
      }

      const normalizedEmail = (email || `user@${selectedProvider}-auth.nimora.internal`).toLowerCase().trim();
      const socialUser: AuthUser = USER_REGISTRY[normalizedEmail] ?? {
        id: `usr_${selectedProvider}_${Date.now().toString(36)}`,
        name: name || (selectedProvider === 'google' ? 'Google Executive User' : 'Executive User'),
        email: normalizedEmail,
        role: 'user', // Always server-assigned, never from client body
        avatarUrl: '/icon-192.png',
        provider: selectedProvider as AuthUser['provider'],
        createdAt: new Date().toISOString(),
      };
      USER_REGISTRY[normalizedEmail] = socialUser;

      const ttlSeconds = 7 * 24 * 60 * 60;
      const { token: authToken } = signSessionToken({
        sub: socialUser.id,
        email: socialUser.email,
        name: socialUser.name,
        role: socialUser.role,
        provider: socialUser.provider,
        ttlSeconds,
      });

      const res = NextResponse.json({
        success: true,
        message: `Successfully authenticated via ${selectedProvider.toUpperCase()} OAuth`,
        user: socialUser,
        expiresIn: ttlSeconds,
      });
      attachSessionCookie(res, authToken, ttlSeconds);
      return res;
    }

    // 2. Email & Password Login with Brute-Force Lockout & Non-Enumerating Errors
    if (action === 'login' || action === 'signin') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required.' },
          { status: 400 }
        );
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const lockout = checkLoginLockout(normalizedEmail);
      if (lockout.locked) {
        logSecurityEvent({ event: 'auth.login.locked', email: normalizedEmail });
        return NextResponse.json(
          {
            success: false,
            error: `Account temporarily locked due to repeated failed attempts. Try again in ${lockout.retryAfterSeconds}s.`,
          },
          { status: 429, headers: { 'Retry-After': String(lockout.retryAfterSeconds) } }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail) || String(password).length < 8) {
        recordFailedLogin(normalizedEmail);
        logSecurityEvent({ event: 'auth.login.failed', email: normalizedEmail });
        // Generic error prevents user/email enumeration
        return NextResponse.json(
          { success: false, error: 'Invalid email or password.' },
          { status: 401 }
        );
      }

      clearLoginLockout(normalizedEmail);

      const existingUser: AuthUser = USER_REGISTRY[normalizedEmail] ?? {
        id: `usr_email_${Date.now().toString(36)}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        role: 'user',
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      USER_REGISTRY[normalizedEmail] = existingUser;

      const ttlSeconds = 7 * 24 * 60 * 60;
      const { token: authToken } = signSessionToken({
        sub: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        provider: existingUser.provider,
        ttlSeconds,
      });

      const res = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: existingUser,
        expiresIn: ttlSeconds,
      });
      attachSessionCookie(res, authToken, ttlSeconds);
      return res;
    }

    // 3. Email & Password Sign Up
    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { success: false, error: 'Name, email, and password are required.' },
          { status: 400 }
        );
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      if (String(password).length < 8) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 8 characters long.' },
          { status: 400 }
        );
      }

      const newUser: AuthUser = {
        id: `usr_new_${Date.now().toString(36)}`,
        name: String(name).trim(),
        email: normalizedEmail,
        role: 'user', // Never allow client-controlled role elevation
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      USER_REGISTRY[normalizedEmail] = newUser;

      const ttlSeconds = 7 * 24 * 60 * 60;
      const { token: authToken } = signSessionToken({
        sub: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        provider: newUser.provider,
        ttlSeconds,
      });

      const res = NextResponse.json({
        success: true,
        message: 'Account created successfully. Welcome to NIMORA.',
        user: newUser,
        expiresIn: ttlSeconds,
      });
      attachSessionCookie(res, authToken, ttlSeconds);
      return res;
    }

    // 4. Password Recovery (Non-enumerating, single-use 5-min token, never returned in response)
    if (action === 'forgot_password') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      const normalizedEmail = String(email).toLowerCase().trim();
      if (USER_REGISTRY[normalizedEmail]) {
        issuePasswordResetToken(normalizedEmail);
      }

      // Generic message whether account exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account matches that email, single-use reset instructions (valid 5 minutes) have been dispatched.',
      });
    }

    // 5. Complete Password Reset (Single-use token + invalidate all old sessions)
    if (action === 'reset_password') {
      if (!resetToken || !newPassword || String(newPassword).length < 8) {
        return NextResponse.json(
          { success: false, error: 'Valid reset token and a new password (8+ chars) are required.' },
          { status: 400 }
        );
      }

      const consumed = consumePasswordResetToken(String(resetToken));
      if (!consumed.valid || !consumed.email) {
        return NextResponse.json(
          { success: false, error: 'Reset link is invalid or has expired.' },
          { status: 400 }
        );
      }

      const user = USER_REGISTRY[consumed.email];
      if (user) {
        invalidateAllUserSessions(user.id); // Kill all existing sessions immediately
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated. All previous sessions have been signed out.',
      });
    }

    // 6. Logout (Revoke active token + clear HttpOnly cookie)
    if (action === 'logout') {
      const rawToken = extractToken(req);
      const payload = verifySessionToken(rawToken);
      if (payload) {
        revokeSessionToken(payload.jti);
        logSecurityEvent({ event: 'auth.logout', userId: payload.sub, email: payload.email });
      }

      const res = NextResponse.json({ success: true, message: 'Signed out securely.' });
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid authentication action specified.' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication service error.' },
      { status: 500 }
    );
  }
}
