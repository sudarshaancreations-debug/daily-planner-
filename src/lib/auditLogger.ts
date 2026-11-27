import crypto from 'crypto';

export type SecurityEventType =
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.login.locked'
  | 'auth.signup.success'
  | 'auth.social.success'
  | 'auth.social.csrf_blocked'
  | 'auth.logout'
  | 'auth.password_reset.requested'
  | 'auth.password_reset.completed';

function maskEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  return `${user.slice(0, 2)}***@${domain}`;
}

/**
 * Structured JSON Audit Logger (PII-safe, zero secrets logged)
 */
export function logSecurityEvent(params: {
  event: SecurityEventType;
  email?: string;
  userId?: string;
  ip?: string;
  meta?: Record<string, string | number | boolean>;
}): void {
  const entry = {
    ts: new Date().toISOString(),
    traceId: crypto.randomBytes(6).toString('hex'),
    service: 'nimora-auth',
    event: params.event,
    userId: params.userId,
    emailMasked: maskEmail(params.email),
    ip: params.ip || 'unknown',
    ...(params.meta ? { meta: params.meta } : {}),
  };

  // Structured JSON output for log aggregators (Vercel Logs / Datadog / Loki)
  console.info(JSON.stringify(entry));
}
