/**
 * otpSession.js — Frontend OTP session management (localStorage-based)
 *
 * Simulates a real OTP flow without a backend:
 *   forgotPassword → createOTPSession  (stores code + expiry)
 *   verifyOTP      → verifyCode        (checks code, tracks attempts)
 *   resetPassword  → updatePassword    (writes new password, clears session)
 */

const OTP_KEY         = 'otpSession';
const EXPIRY_MS       = 10 * 60 * 1000;  // 10 minutes
const MAX_ATTEMPTS    = 5;
const COOLDOWN_MS     = 60 * 1000;        // 60 seconds resend cooldown

// ── OTP generation (crypto.getRandomValues — cryptographically secure) ────────

export function generateOTP() {
  const buf = new Uint32Array(1);
  window.crypto.getRandomValues(buf);
  return String(buf[0] % 1_000_000).padStart(6, '0');
}

// ── User lookup (checks both member and staff accounts) ───────────────────────

export function findUser(contact) {
  const trimmed = contact.trim();

  // Member account
  const member = JSON.parse(localStorage.getItem('userAccount') || 'null');
  if (member && (member.email === trimmed || member.phone === trimmed)) {
    return { userId: 'member', userType: 'member', fullName: member.fullName || member.username };
  }

  // Staff accounts
  const staff = JSON.parse(localStorage.getItem('libraryStaffAccounts') || '[]');
  const found = staff.find(a => a.email === trimmed || a.phone === trimmed);
  if (found) {
    return { userId: found.id, userType: 'staff', fullName: found.fullName };
  }

  return null;
}

// ── Session CRUD ──────────────────────────────────────────────────────────────

export function getOTPSession() {
  return JSON.parse(localStorage.getItem(OTP_KEY) || 'null');
}

export function clearOTPSession() {
  localStorage.removeItem(OTP_KEY);
}

/**
 * Generate a new OTP, store the session, and return the plaintext code
 * so the page can display it (demo mode — no real email/SMS).
 */
export function createOTPSession(contact, userId, userType) {
  const code = generateOTP();
  localStorage.setItem(OTP_KEY, JSON.stringify({
    code,
    contact,
    userId,
    userType,
    expiresAt:   Date.now() + EXPIRY_MS,
    requestedAt: Date.now(),
    attempts:    0,
    verified:    false,
  }));
  return code;
}

// ── Resend cooldown check ─────────────────────────────────────────────────────

export function secondsUntilResend() {
  const session = getOTPSession();
  if (!session) return 0;
  const elapsed = Date.now() - session.requestedAt;
  const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
  return remaining > 0 ? remaining : 0;
}

// ── Verify code ───────────────────────────────────────────────────────────────

/**
 * @returns {{ ok: boolean, error?: string, remaining?: number }}
 */
export function verifyCode(code) {
  const session = getOTPSession();

  if (!session)          return { ok: false, error: 'No active session. Please request a new code.' };
  if (session.verified)  return { ok: false, error: 'This code has already been used.' };

  if (Date.now() > session.expiresAt) {
    clearOTPSession();
    return { ok: false, error: 'Code expired. Please request a new one.' };
  }

  if (session.attempts >= MAX_ATTEMPTS) {
    clearOTPSession();
    return { ok: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (session.code !== String(code)) {
    session.attempts += 1;
    localStorage.setItem(OTP_KEY, JSON.stringify(session));
    const remaining = MAX_ATTEMPTS - session.attempts;
    return {
      ok:        false,
      error:     `Incorrect code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'No attempts left — please request a new code.'}`,
      remaining,
    };
  }

  // Correct — mark verified
  session.verified = true;
  localStorage.setItem(OTP_KEY, JSON.stringify(session));
  return { ok: true };
}

// ── Update password in localStorage ──────────────────────────────────────────

/**
 * Writes the new password to the correct account and clears the OTP session.
 * @returns {boolean} true on success
 */
export function updatePassword(newPassword) {
  const session = getOTPSession();
  if (!session || !session.verified) return false;

  if (session.userType === 'member') {
    const member = JSON.parse(localStorage.getItem('userAccount') || 'null');
    if (member) {
      localStorage.setItem('userAccount', JSON.stringify({ ...member, password: newPassword }));
    }
  } else {
    const staff = JSON.parse(localStorage.getItem('libraryStaffAccounts') || '[]');
    localStorage.setItem(
      'libraryStaffAccounts',
      JSON.stringify(staff.map(a => a.id === session.userId ? { ...a, password: newPassword } : a))
    );
  }

  clearOTPSession();
  return true;
}

// ── Password strength validation ──────────────────────────────────────────────

/**
 * @returns {string|null} error message, or null if password is strong enough
 */
export function validatePassword(password) {
  if (password.length < 8)            return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password))        return 'Must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password))        return 'Must contain at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain at least one special character (e.g. @, #, !).';
  return null;
}
