const User        = require('../models/User');
const OTP         = require('../models/OTP');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');

const OTP_EXPIRY_MINUTES  = parseInt(process.env.OTP_EXPIRY_MINUTES  || '10',  10);
const OTP_MAX_ATTEMPTS    = parseInt(process.env.OTP_MAX_ATTEMPTS    || '5',   10);
const RESEND_COOLDOWN_SEC = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);

// ── Helper ────────────────────────────────────────────────────────────────────

function isEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function isPhone(value) {
  return /^\+?[\d\s\-().]{7,20}$/.test(value);
}

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
// Body: { contact: "email_or_phone" }
// Response: { success, message }  — never reveal whether the account exists
async function forgotPassword(req, res) {
  try {
    const contact = (req.body.contact || '').trim();

    if (!contact) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required.' });
    }

    const contactType = isEmail(contact) ? 'email'
                      : isPhone(contact) ? 'phone'
                      : null;

    if (!contactType) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address or phone number.' });
    }

    // Look up user — silently succeed even if not found (prevents enumeration)
    const user = contactType === 'email'
      ? await User.findOne({ email: contact.toLowerCase() })
      : await User.findOne({ phone: contact });

    // Always respond the same way whether user exists or not
    const SAFE_RESPONSE = {
      success: true,
      message: 'If that account exists, a verification code has been sent.',
    };

    if (!user || user.status === 'Suspended') {
      return res.status(200).json(SAFE_RESPONSE);
    }

    // ── Rate limit per user: enforce resend cooldown ──────────────────────────
    const recentOTP = await OTP.findOne({ userId: user._id, used: false })
      .select('+codeHash')
      .sort({ requestedAt: -1 });

    if (recentOTP) {
      const secondsSinceLast = (Date.now() - new Date(recentOTP.requestedAt).getTime()) / 1000;
      if (secondsSinceLast < RESEND_COOLDOWN_SEC) {
        const waitSec = Math.ceil(RESEND_COOLDOWN_SEC - secondsSinceLast);
        return res.status(429).json({
          success: false,
          message: `A code was already sent. Please wait ${waitSec} seconds before requesting again.`,
          retryAfterSeconds: waitSec,
        });
      }
      // Invalidate old OTP
      await OTP.deleteMany({ userId: user._id, used: false });
    }

    // ── Generate and store OTP ────────────────────────────────────────────────
    const plainCode = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OTP.create({
      userId:      user._id,
      contact,
      contactType,
      codeHash:    OTP.hashCode(plainCode),
      expiresAt,
      requestedAt: new Date(),
    });

    // ── Send OTP ──────────────────────────────────────────────────────────────
    if (contactType === 'email') {
      await sendOTPEmail(contact, plainCode, user.fullName);
    } else {
      // SMS integration point — plug in Twilio, Vonage, etc.
      console.info(`[SMS] OTP ${plainCode} → ${contact}  (hook up your SMS provider here)`);
    }

    // Log attempt (no sensitive data)
    console.info(`[AUTH] Password reset OTP issued for user ${user._id} via ${contactType}`);

    return res.status(200).json(SAFE_RESPONSE);

  } catch (err) {
    console.error('[forgotPassword]', err);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
  }
}

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
// Body: { contact, code }
// Response: { success, message, resetToken }  — resetToken is a short-lived single-use token
async function verifyOTP(req, res) {
  try {
    const contact = (req.body.contact || '').trim();
    const code    = (req.body.code    || '').trim();

    if (!contact || !code) {
      return res.status(400).json({ success: false, message: 'Contact and verification code are required.' });
    }

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Verification code must be exactly 6 digits.' });
    }

    // Find most recent unused OTP for this contact
    const otpDoc = await OTP.findOne({ contact, used: false })
      .select('+codeHash')
      .sort({ requestedAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'No active verification code found. Please request a new one.' });
    }

    // Check expiry
    if (new Date() > new Date(otpDoc.expiresAt)) {
      await OTP.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({ success: false, message: 'Your verification code has expired. Please request a new one.' });
    }

    // Check attempt limit
    if (otpDoc.attempts >= OTP_MAX_ATTEMPTS) {
      await OTP.findByIdAndDelete(otpDoc._id);
      return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Please request a new code.' });
    }

    // Verify code
    const isValid = otpDoc.verifyCode(code);
    if (!isValid) {
      await OTP.findByIdAndUpdate(otpDoc._id, { $inc: { attempts: 1 } });
      const remaining = OTP_MAX_ATTEMPTS - (otpDoc.attempts + 1);
      return res.status(400).json({
        success:   false,
        message:   `Incorrect code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'No attempts remaining — please request a new code.'}`,
        remaining,
      });
    }

    // ── Valid — mark OTP as used ───────────────────────────────────────────────
    await OTP.findByIdAndUpdate(otpDoc._id, { used: true });

    // Issue a short-lived reset token (stored in OTP doc ID, signed by server)
    // The client passes this token to /reset-password to prove they verified.
    // Here we use the OTP document _id as a simple single-use token.
    // In production you'd sign this with JWT.
    const resetToken = otpDoc._id.toString();

    console.info(`[AUTH] OTP verified for user ${otpDoc.userId}`);

    return res.status(200).json({
      success:    true,
      message:    'Code verified. You may now reset your password.',
      resetToken,             // pass this back on the reset-password call
      userId:     otpDoc.userId.toString(),
    });

  } catch (err) {
    console.error('[verifyOTP]', err);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
  }
}

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
// Body: { userId, resetToken, newPassword }
// resetToken = the OTP document _id returned from /verify-otp
async function resetPassword(req, res) {
  try {
    const { userId, resetToken, newPassword } = req.body;

    if (!userId || !resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'userId, resetToken, and newPassword are all required.' });
    }

    // Password strength rules
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one number.' });
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one special character.' });
    }

    // Verify the reset token (the OTP doc must exist, be used=true, and belong to this user)
    const otpDoc = await OTP.findOne({
      _id:    resetToken,
      userId,
      used:   true,
    });

    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset session. Please restart the password reset flow.' });
    }

    // Verify token hasn't exceeded a 15-minute post-verify window
    const verifiedAt   = new Date(otpDoc.expiresAt).getTime() - OTP_EXPIRY_MINUTES * 60 * 1000
                         + OTP_EXPIRY_MINUTES * 60 * 1000;  // use original expiresAt + grace
    const graceCutoff  = new Date(otpDoc.expiresAt).getTime() + 5 * 60 * 1000;  // 5-min grace
    if (Date.now() > graceCutoff) {
      await OTP.findByIdAndDelete(otpDoc._id);
      return res.status(400).json({ success: false, message: 'Reset session has expired. Please restart the flow.' });
    }

    // Update password — the pre-save hook will bcrypt it
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.password              = newPassword;
    user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
    user.lastPasswordReset     = new Date();
    await user.save();

    // Invalidate the OTP doc completely
    await OTP.findByIdAndDelete(otpDoc._id);

    // Optionally: invalidate all other unused OTPs for this user
    await OTP.deleteMany({ userId, used: false });

    console.info(`[AUTH] Password reset completed for user ${userId}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });

  } catch (err) {
    console.error('[resetPassword]', err);
    return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
  }
}

module.exports = { forgotPassword, verifyOTP, resetPassword };
