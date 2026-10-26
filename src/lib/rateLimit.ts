import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  req: NextRequest,
  limit: number = 30, // max 30 requests
  windowMs: number = 60 * 1000 // per 1 minute window
): { success: boolean; remaining: number; resetTime: number } {
  // Extract client IP address from standard headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // If window expired, reset counter
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(ip, newRecord);

    // Occasional cleanup of stale IPs to prevent memory leaks
    if (rateLimitMap.size > 2000) {
      for (const [key, val] of rateLimitMap.entries()) {
        if (now > val.resetTime) rateLimitMap.delete(key);
      }
    }

    return { success: true, remaining: limit - 1, resetTime: newRecord.resetTime };
  }

  // If already at or over limit
  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment and allow
  record.count += 1;
  return { success: true, remaining: limit - record.count, resetTime: record.resetTime };
}
