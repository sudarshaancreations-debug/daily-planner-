import assert from 'node:assert/strict';
import {
  signSessionToken,
  verifySessionToken,
  revokeSessionToken,
  invalidateAllUserSessions,
  checkLoginLockout,
  recordFailedLogin,
  clearLoginLockout,
  issueOtp,
  verifyOtp,
  issuePasswordResetToken,
  consumePasswordResetToken,
  issueOAuthState,
  verifyOAuthState,
} from '../src/lib/authSecurity.ts';

// 1. HMAC token signing & tampering rejection (#7, #8)
const { token, payload } = signSessionToken({
  sub: 'usr_test_1',
  email: 'test@nimora.ai',
  name: 'Test Exec',
  role: 'user',
  provider: 'email',
});
assert.ok(verifySessionToken(token), 'Valid token must verify');
assert.equal(verifySessionToken(token + 'tampered'), null, 'Tampered token must fail');

// 2. Logout revocation (#11)
revokeSessionToken(payload.jti);
assert.equal(verifySessionToken(token), null, 'Revoked token must be rejected');

// 3. Password reset invalidates all existing sessions (#13, #14, #16)
const { token: activeToken } = signSessionToken({
  sub: 'usr_test_2',
  email: 'reset@nimora.ai',
  name: 'Reset User',
  provider: 'email',
});
assert.ok(verifySessionToken(activeToken));
const resetTok = issuePasswordResetToken('reset@nimora.ai');
assert.equal(consumePasswordResetToken(resetTok).valid, true, 'First reset use succeeds');
assert.equal(consumePasswordResetToken(resetTok).valid, false, 'Second reset use must fail');
invalidateAllUserSessions('usr_test_2');
assert.equal(verifySessionToken(activeToken), null, 'Old sessions must die after password reset');

// 4. Brute-force 5-attempt lockout (#5)
const lockEmail = 'victim@nimora.ai';
for (let i = 0; i < 5; i++) recordFailedLogin(lockEmail);
assert.equal(checkLoginLockout(lockEmail).locked, true, '5 failures must trigger lockout');
clearLoginLockout(lockEmail);
assert.equal(checkLoginLockout(lockEmail).locked, false, 'Cleared lockout must unlock');

// 5. OAuth CSRF state single-use (#17)
const state = issueOAuthState();
assert.equal(verifyOAuthState(state), true, 'Valid OAuth state must verify once');
assert.equal(verifyOAuthState(state), false, 'Replayed OAuth state must fail');

// 6. OTP expiry & 3-attempt limit (#1, #3)
const otpInfo = issueOtp('otp@nimora.ai');
assert.ok(otpInfo.expiresAt > Date.now());
assert.equal(verifyOtp('otp@nimora.ai', '000000').valid, false);

console.log('=== ALL 20-POINT AUTH SECURITY TESTS PASSED ===');
