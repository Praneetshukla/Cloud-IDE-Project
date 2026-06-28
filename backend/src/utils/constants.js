/**
 * Application-wide constants for Orbit Cloud IDE.
 * Centralized configuration values to avoid magic strings/numbers.
 */

const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
});

const AUTH_PROVIDERS = Object.freeze({
  LOCAL: 'local',
  GOOGLE: 'google',
  GITHUB: 'github',
});

const TOKEN_TYPES = Object.freeze({
  ACCESS: 'access',
  REFRESH: 'refresh',
});

const COOKIE_NAMES = Object.freeze({
  REFRESH_TOKEN: 'orbit_refresh_token',
});

const TOKEN_EXPIRY = Object.freeze({
  ACCESS: '15m',
  REFRESH: '7d',
  EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours in ms
  PASSWORD_RESET: 10 * 60 * 1000, // 10 minutes in ms
});

const UPLOAD_LIMITS = Object.freeze({
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5 MB
  AVATAR_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
});

const RATE_LIMITS = Object.freeze({
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
  },
  GENERAL: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
  },
});

const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

const BCRYPT_SALT_ROUNDS = 12;

module.exports = {
  ROLES,
  AUTH_PROVIDERS,
  TOKEN_TYPES,
  COOKIE_NAMES,
  TOKEN_EXPIRY,
  UPLOAD_LIMITS,
  RATE_LIMITS,
  PAGINATION,
  BCRYPT_SALT_ROUNDS,
};
