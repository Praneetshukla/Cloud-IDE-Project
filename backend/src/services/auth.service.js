const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const { hashToken } = require('../utils/helpers');
const { AUTH_PROVIDERS } = require('../utils/constants');
const emailService = require('./email.service');

/**
 * Auth service — core authentication business logic.
 * Handles signup, login, logout, token refresh, password reset,
 * email verification, and OAuth callbacks.
 */

// ─── Token Generation ────────────────────────────────────────────

/**
 * Generates a short-lived JWT access token.
 * @param {string} userId - User's MongoDB _id.
 * @param {string} role - User's role.
 * @returns {string} Signed JWT.
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generates a random refresh token string.
 * @returns {string} Random hex string.
 */
const generateRefreshTokenString = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Creates an access + refresh token pair and stores the refresh token in DB.
 * @param {object} user - User document.
 * @param {string|null} family - Token family for rotation (null = new family).
 * @param {object} meta - { userAgent, ipAddress }
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
const createTokenPair = async (user, family = null, meta = {}) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const rawRefreshToken = generateRefreshTokenString();

  // Calculate refresh token expiry
  const refreshExpiresMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  const expiresAt = new Date(Date.now() + refreshExpiresMs);

  await RefreshToken.createToken({
    rawToken: rawRefreshToken,
    userId: user._id,
    family: family || crypto.randomUUID(),
    userAgent: meta.userAgent || null,
    ipAddress: meta.ipAddress || null,
    expiresAt,
  });

  return { accessToken, refreshToken: rawRefreshToken };
};

// ─── Signup ──────────────────────────────────────────────────────

/**
 * Registers a new user account.
 * @param {object} data - { name, email, password }
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
const signup = async (data, meta = {}) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict('An account with this email already exists.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    authProvider: AUTH_PROVIDERS.LOCAL,
  });

  // Generate email verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email (non-blocking — don't fail signup if email fails)
  emailService.sendVerificationEmail(email, name, verificationToken).catch(emailError => {
    console.error('Failed to send verification email:', emailError.message);
    // Don't throw — user is created, they can resend verification later
  });

  // Generate token pair
  const tokens = await createTokenPair(user, null, meta);

  return { user, ...tokens };
};

// ─── Login ───────────────────────────────────────────────────────

/**
 * Authenticates user with email + password.
 * @param {object} data - { email, password }
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
const login = async (data, meta = {}) => {
  const { email, password } = data;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  // Check if this is an OAuth-only account
  if (!user.password && user.authProvider !== AUTH_PROVIDERS.LOCAL) {
    throw AppError.unauthorized(
      `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider}.`
    );
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw AppError.unauthorized('Invalid email or password.');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Generate token pair
  const tokens = await createTokenPair(user, null, meta);

  return { user, ...tokens };
};

// ─── Logout ──────────────────────────────────────────────────────

/**
 * Logs out user by revoking their refresh token.
 * @param {string} rawRefreshToken - Raw refresh token from cookie.
 */
const logout = async (rawRefreshToken) => {
  if (!rawRefreshToken) return;

  const hashedToken = hashToken(rawRefreshToken);
  const tokenDoc = await RefreshToken.findOne({ token: hashedToken });

  if (tokenDoc) {
    // Revoke the entire token family
    await RefreshToken.revokeFamily(tokenDoc.family);
  }
};

// ─── Refresh Tokens ──────────────────────────────────────────────

/**
 * Rotates refresh tokens — issues new pair, revokes old token.
 * Implements reuse detection: if a used token is presented again,
 * all tokens in the family are revoked (session hijack mitigation).
 *
 * @param {string} rawRefreshToken - Raw refresh token from cookie.
 * @param {object} meta - { userAgent, ipAddress }
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
const refreshTokens = async (rawRefreshToken, meta = {}) => {
  if (!rawRefreshToken) {
    throw AppError.unauthorized('No refresh token provided.');
  }

  const hashedToken = hashToken(rawRefreshToken);

  // Find the token record
  const tokenDoc = await RefreshToken.findOne({ token: hashedToken });

  if (!tokenDoc) {
    throw AppError.unauthorized('Invalid refresh token.');
  }

  // ─── Reuse Detection ───────────────────────────────────────
  if (tokenDoc.isUsed || tokenDoc.isRevoked) {
    // This token was already used! Possible session hijack.
    // Revoke the entire family to protect the user.
    await RefreshToken.revokeFamily(tokenDoc.family);
    throw AppError.unauthorized(
      'Refresh token reuse detected. All sessions have been revoked for security. Please log in again.'
    );
  }

  // Check expiry
  if (tokenDoc.expiresAt < new Date()) {
    await RefreshToken.revokeFamily(tokenDoc.family);
    throw AppError.unauthorized('Refresh token has expired. Please log in again.');
  }

  // Mark current token as used
  tokenDoc.isUsed = true;
  await tokenDoc.save();

  // Verify user still exists and is active
  const user = await User.findById(tokenDoc.userId);
  if (!user || !user.isActive) {
    await RefreshToken.revokeFamily(tokenDoc.family);
    throw AppError.unauthorized('User account not found or deactivated.');
  }

  // Issue new token pair in the same family
  const tokens = await createTokenPair(user, tokenDoc.family, meta);

  return tokens;
};

// ─── Forgot Password ────────────────────────────────────────────

/**
 * Initiates password reset flow — sends reset email.
 * Always returns success to prevent email enumeration.
 * @param {string} email - User's email address.
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // Always respond with success to prevent email enumeration
  if (!user) return;

  // Check if this is an OAuth-only account
  if (user.authProvider !== AUTH_PROVIDERS.LOCAL && !user.password) {
    return; // OAuth users don't have passwords to reset
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send reset email
  try {
    await emailService.sendPasswordResetEmail(email, user.name, resetToken);
  } catch (error) {
    // Clean up token on email failure
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw AppError.internal('Failed to send password reset email. Please try again later.');
  }
};

// ─── Reset Password ─────────────────────────────────────────────

/**
 * Resets password using token from email.
 * @param {string} rawToken - Raw token from URL parameter.
 * @param {string} newPassword - New password.
 * @returns {Promise<object>} Updated user.
 */
const resetPassword = async (rawToken, newPassword) => {
  // Hash the token to compare with stored hash
  const hashedToken = hashToken(rawToken);

  // Find user with valid (non-expired) reset token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw AppError.badRequest('Password reset token is invalid or has expired.');
  }

  // Update password and clear reset token
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Revoke all existing refresh tokens (force re-login on all devices)
  await RefreshToken.revokeAllForUser(user._id);

  return user;
};

// ─── Email Verification ─────────────────────────────────────────

/**
 * Verifies user's email address using token from email link.
 * @param {string} rawToken - Raw verification token from URL.
 * @returns {Promise<object>} Verified user.
 */
const verifyEmail = async (rawToken) => {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw AppError.badRequest('Verification token is invalid or has expired.');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email (non-blocking)
  try {
    await emailService.sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.error('Failed to send welcome email:', error.message);
  }

  return user;
};

/**
 * Resends email verification link.
 * @param {string} email - User's email address.
 */
const resendVerification = async (email) => {
  const user = await User.findOne({ email }).select(
    '+emailVerificationToken +emailVerificationExpires'
  );

  if (!user) {
    throw AppError.notFound('No account found with this email address.');
  }

  if (user.isEmailVerified) {
    throw AppError.badRequest('This email is already verified.');
  }

  // Generate new verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await emailService.sendVerificationEmail(email, user.name, verificationToken);
};

// ─── OAuth Handlers ──────────────────────────────────────────────

/**
 * Handles post-OAuth callback — generates token pair for the OAuth user.
 * Called after Passport authenticates the user.
 * @param {object} user - Authenticated user from Passport.
 * @param {object} meta - { userAgent, ipAddress }
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
const handleOAuthLogin = async (user, meta = {}) => {
  const tokens = await createTokenPair(user, null, meta);
  return tokens;
};

module.exports = {
  signup,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  handleOAuthLogin,
};
