const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const { apiResponse, getRefreshCookieOptions, clearRefreshCookie } = require('../utils/helpers');
const { COOKIE_NAMES } = require('../utils/constants');
const passport = require('passport');

/**
 * Auth controller — HTTP layer for authentication endpoints.
 * Thin layer: validates input (via middleware), calls service, sends response.
 */

// ─── Signup ──────────────────────────────────────────────────────

const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const meta = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };

  const { user, accessToken, refreshToken } = await authService.signup(
    { name, email, password },
    meta
  );

  // Set refresh token in HTTP-only cookie
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshCookieOptions());

  res.status(201).json(
    apiResponse('success', 'Account created successfully. Please verify your email.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
      },
      accessToken,
    })
  );
});

// ─── Login ───────────────────────────────────────────────────────

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const meta = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };

  const { user, accessToken, refreshToken } = await authService.login(
    { email, password },
    meta
  );

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, getRefreshCookieOptions());

  res.status(200).json(
    apiResponse('success', 'Logged in successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
      },
      accessToken,
    })
  );
});

// ─── Logout ──────────────────────────────────────────────────────

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

  await authService.logout(refreshToken);

  clearRefreshCookie(res);

  res.status(200).json(apiResponse('success', 'Logged out successfully.'));
});

// ─── Refresh Token ───────────────────────────────────────────────

const refreshToken = catchAsync(async (req, res) => {
  const rawRefreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
  const meta = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };

  const tokens = await authService.refreshTokens(rawRefreshToken, meta);

  // Set new refresh token cookie
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, getRefreshCookieOptions());

  res.status(200).json(
    apiResponse('success', 'Token refreshed successfully.', {
      accessToken: tokens.accessToken,
    })
  );
});

// ─── Forgot Password ────────────────────────────────────────────

const forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  // Always return success to prevent email enumeration
  res.status(200).json(
    apiResponse(
      'success',
      'If an account with that email exists, a password reset link has been sent.'
    )
  );
});

// ─── Reset Password ─────────────────────────────────────────────

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);

  clearRefreshCookie(res);

  res.status(200).json(
    apiResponse('success', 'Password has been reset successfully. Please log in with your new password.')
  );
});

// ─── Verify Email ────────────────────────────────────────────────

const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);

  res.status(200).json(
    apiResponse('success', 'Email verified successfully.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    })
  );
});

// ─── Resend Verification ─────────────────────────────────────────

const resendVerification = catchAsync(async (req, res) => {
  await authService.resendVerification(req.body.email);

  res.status(200).json(
    apiResponse('success', 'Verification email sent. Please check your inbox.')
  );
});

// ─── Google OAuth ────────────────────────────────────────────────

const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=oauth_failed&provider=google`
      );
    }

    try {
      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      };

      const tokens = await authService.handleOAuthLogin(user, meta);

      // Set refresh token cookie
      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, getRefreshCookieOptions());

      // Redirect to frontend with access token in URL fragment
      res.redirect(
        `${process.env.CLIENT_URL}/oauth/callback?token=${tokens.accessToken}`
      );
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=oauth_failed&provider=google`
      );
    }
  })(req, res, next);
};

// ─── GitHub OAuth ────────────────────────────────────────────────

const githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
  session: false,
});

const githubCallback = (req, res, next) => {
  passport.authenticate('github', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=oauth_failed&provider=github`
      );
    }

    try {
      const meta = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      };

      const tokens = await authService.handleOAuthLogin(user, meta);

      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, getRefreshCookieOptions());

      res.redirect(
        `${process.env.CLIENT_URL}/oauth/callback?token=${tokens.accessToken}`
      );
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=oauth_failed&provider=github`
      );
    }
  })(req, res, next);
};

// ─── Get Current User ────────────────────────────────────────────

const getMe = catchAsync(async (req, res) => {
  res.status(200).json(
    apiResponse('success', 'User retrieved successfully.', {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
        authProvider: req.user.authProvider,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin,
      },
    })
  );
});

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getMe,
};
