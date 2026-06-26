const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit OTP.
 * Uses crypto.randomInt (Node 14.10+) instead of Math.random
 * to avoid predictable values.
 *
 * @returns {string} Zero-padded 6-digit string e.g. "047823"
 */
function generateOTP() {
  // randomInt(min, max) → integer in [min, max)
  const code = crypto.randomInt(0, 1_000_000);
  return String(code).padStart(6, '0');
}

module.exports = generateOTP;
