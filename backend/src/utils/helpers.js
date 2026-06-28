const crypto = require('crypto');
const { COOKIE_NAMES } = require('./constants');

/**
 * Generates a cryptographically secure random token.
 * @param {number} bytes - Number of random bytes (default: 32).
 * @returns {{ raw: string, hashed: string }} Raw hex token and its SHA-256 hash.
 */
const generateCryptoToken = (bytes = 32) => {
  const raw = crypto.randomBytes(bytes).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
};

/**
 * Hashes a token with SHA-256.
 * @param {string} token - Raw token string.
 * @returns {string} Hashed token.
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Builds cookie options for refresh token based on environment.
 * @returns {object} Cookie options.
 */
const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? 'strict' : 'lax'),
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

/**
 * Clears the refresh token cookie.
 * @param {object} res - Express response object.
 */
const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'strict' : 'lax'),
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
  });
};

/**
 * Sanitizes user object for API response — strips sensitive fields.
 * @param {object} user - Mongoose user document.
 * @returns {object} Safe user object.
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };

  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.emailVerificationToken;
  delete userObj.emailVerificationExpires;
  delete userObj.__v;

  return userObj;
};

/**
 * Builds a standard API response object.
 * @param {string} status - 'success' or 'fail'.
 * @param {string} message - Response message.
 * @param {object|null} data - Response data payload.
 * @returns {object} Formatted response.
 */
const apiResponse = (status, message, data = null) => {
  const response = { status, message };
  if (data !== null) {
    response.data = data;
  }
  return response;
};

module.exports = {
  generateCryptoToken,
  hashToken,
  getRefreshCookieOptions,
  clearRefreshCookie,
  sanitizeUser,
  apiResponse,
};
