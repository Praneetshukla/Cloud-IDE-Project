const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../utils/constants');

/**
 * Rate limiter factory.
 * Creates configurable rate limiters for different route groups.
 */

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.GENERAL.windowMs,
  max: RATE_LIMITS.GENERAL.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Auth route rate limiter — 20 requests per 15 minutes per IP.
 * Tighter limit to prevent brute-force attacks on login/signup.
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH.windowMs,
  max: RATE_LIMITS.AUTH.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many authentication attempts. Please try again later.',
  },
});

/**
 * Password reset rate limiter — 5 requests per hour per IP.
 * Very strict to prevent email bombing.
 */
const passwordResetLimiter = rateLimit({
  windowMs: RATE_LIMITS.PASSWORD_RESET.windowMs,
  max: RATE_LIMITS.PASSWORD_RESET.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many password reset requests. Please try again later.',
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
};
