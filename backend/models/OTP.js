const mongoose = require('mongoose');
const crypto   = require('crypto');

const OTPSchema = new mongoose.Schema({
  // Who this OTP belongs to
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    index:    true,
  },

  // Contact used to send the code (email or phone)
  contact: {
    type:     String,
    required: true,
  },
  contactType: {
    type: String,
    enum: ['email', 'phone'],
    required: true,
  },

  // The hashed OTP (never store plaintext)
  codeHash: {
    type:     String,
    required: true,
    select:   false,  // excluded from all queries by default
  },

  // Expiry (TTL index removes the document automatically)
  expiresAt: {
    type:     Date,
    required: true,
    index:    { expires: 0 },  // MongoDB TTL — drops doc when expiresAt passes
  },

  // State
  used:     { type: Boolean, default: false },
  attempts: { type: Number,  default: 0 },  // failed verify attempts

  // Rate-limit: track when the last OTP was requested
  requestedAt: { type: Date, default: Date.now },
});

// Static: hash a plaintext code
OTPSchema.statics.hashCode = function (plain) {
  return crypto.createHash('sha256').update(String(plain)).digest('hex');
};

// Instance: compare a plaintext code to the stored hash
OTPSchema.methods.verifyCode = function (plain) {
  const hash = OTPSchema.statics.hashCode(plain);
  return this.codeHash === hash;
};

module.exports = mongoose.model('OTP', OTPSchema);
