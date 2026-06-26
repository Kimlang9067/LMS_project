const express = require('express');
const router  = express.Router();

const { forgotPassword, verifyOTP, resetPassword } = require('../controllers/authController');
const { forgotPasswordLimiter, verifyOTPLimiter }  = require('../middleware/rateLimiter');

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTPLimiter, verifyOTP);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;
