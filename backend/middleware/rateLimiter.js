const rateLimit = require('express-rate-limit');

// ── Forgot-password endpoint: max 5 requests per 15 minutes per IP ───────────
const forgotPasswordLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,  // 15 minutes
  max:              5,
  message:          { success: false, message: 'Too many password reset requests. Please wait 15 minutes before trying again.' },
  standardHeaders:  true,
  legacyHeaders:    false,
});

// ── OTP verify endpoint: max 10 attempts per 15 minutes per IP ───────────────
const verifyOTPLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10,
  message:          { success: false, message: 'Too many verification attempts. Please wait 15 minutes.' },
  standardHeaders:  true,
  legacyHeaders:    false,
});

// ── General auth limiter (login, register): max 20 per 15 min per IP ─────────
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              20,
  message:          { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders:  true,
  legacyHeaders:    false,
});

module.exports = { forgotPasswordLimiter, verifyOTPLimiter, authLimiter };
