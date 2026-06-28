const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter.middleware');
const { validate } = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');
const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  resendVerificationValidation,
} = require('../validators/auth.validator');

/**
 * Auth routes — /api/auth/*
 */

// ─── Public routes ───────────────────────────────────────────────

// Signup
router.post(
  '/signup',
  authLimiter,
  signupValidation,
  validate,
  authController.signup
);

// Login
router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  authController.login
);

// Refresh token (uses cookie — no body needed)
router.post('/refresh-token', authController.refreshToken);

// Forgot password
router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

// Resend verification email
router.post(
  '/resend-verification',
  authLimiter,
  resendVerificationValidation,
  validate,
  authController.resendVerification
);

// ─── OAuth routes ────────────────────────────────────────────────

// Google OAuth
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

// GitHub OAuth
router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);

// ─── Protected routes ────────────────────────────────────────────

// Get current user
router.get('/me', protect, authController.getMe);

// Logout
router.post('/logout', protect, authController.logout);

module.exports = router;
