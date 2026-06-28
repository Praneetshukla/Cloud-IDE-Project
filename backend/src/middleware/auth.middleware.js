const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Protect middleware — verifies JWT access token from Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(AppError.unauthorized('You are not logged in. Please log in to access this resource.'));
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Your session has expired. Please log in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(AppError.unauthorized('Invalid token. Please log in again.'));
    }
    return next(AppError.unauthorized('Token verification failed.'));
  }

  // Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+password');
  if (!currentUser) {
    return next(AppError.unauthorized('The user belonging to this token no longer exists.'));
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      AppError.unauthorized('Password was recently changed. Please log in again.')
    );
  }

  // Check if user is active
  if (!currentUser.isActive) {
    return next(AppError.unauthorized('This account has been deactivated.'));
  }

  // Grant access
  req.user = currentUser;
  next();
});

/**
 * Authorize middleware — restricts access to specific roles.
 * Must be used after the protect middleware.
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'superadmin').
 * @returns {Function} Express middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden('You do not have permission to perform this action.')
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
