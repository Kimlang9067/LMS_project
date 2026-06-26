const nodemailer = require('nodemailer');

// Reuse one transporter for the lifetime of the process
let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,          // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send an OTP email.
 *
 * @param {string} to        Recipient email
 * @param {string} otp       Plaintext 6-digit code
 * @param {string} userName  Recipient's display name
 */
async function sendOTPEmail(to, otp, userName = 'Library Member') {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f7fb;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#041627;padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Data_Science Library</h1>
          <p style="margin:6px 0 0;color:#93aec8;font-size:13px;">Password Reset Verification</p>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="margin:0 0 16px;color:#334155;font-size:15px;">Hello, <strong>${userName}</strong></p>
          <p style="margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;">
            We received a request to reset your library account password. Use the verification code below to continue. The code is valid for <strong>${expiryMinutes} minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="background:#f0f7ff;border:2px dashed #1C9AD6;border-radius:10px;padding:24px;text-align:center;margin:0 0 24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#1C9AD6;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
            <p style="margin:0;font-size:42px;font-weight:800;color:#0f172a;letter-spacing:12px;">${otp}</p>
          </div>

          <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;">
            ⚠️ This code expires in <strong>${expiryMinutes} minutes</strong> and can only be used once.
          </p>
          <p style="margin:0;color:#94a3b8;font-size:12px;">
            If you didn't request this, you can safely ignore this email. Your password will not change.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;">
            © ${new Date().getFullYear()} Data_Science Library Systems · This is an automated message, please do not reply.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from:    process.env.EMAIL_FROM || '"Data_Science Library" <noreply@library.com>',
    to,
    subject: `${otp} — Your Library Password Reset Code`,
    html,
  });
}

module.exports = { sendOTPEmail };
