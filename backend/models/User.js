const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: {
      type:   String,
      unique: true,
      sparse: true,   // allow null/undefined without unique violation
      trim:   true,
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 8,
      select:   false,  // never returned in queries by default
    },
    role: {
      type:    String,
      enum:    ['member', 'librarian', 'administrator', 'super_admin'],
      default: 'member',
    },
    status: {
      type:    String,
      enum:    ['Active', 'Suspended', 'Pending'],
      default: 'Active',
    },
    // Password-reset audit
    passwordChangedAt: Date,
    passwordResetAttempts: {
      type:    Number,
      default: 0,
    },
    lastPasswordReset: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
  next();
});

// Instance method — compare plain password to hash
UserSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', UserSchema);
