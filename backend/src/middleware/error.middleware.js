const AppError = require('../utils/AppError');

/**
 * Global error handling middleware.
 * Catches all errors thrown/next'd throughout the application and
 * sends a standardized JSON response.
 *
 * Handles specific Mongoose, JWT, and Multer error types.
 */

// ─── Specific error transformers ─────────────────────────────────

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(
    `A ${field} "${value}" already exists. Please use a different ${field}.`,
    409
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Validation failed: ${errors.join('. ')}`, 400);
};

const handleJWTError = () => {
  return AppError.unauthorized('Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
  return AppError.unauthorized('Your session has expired. Please log in again.');
};

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size is 5MB.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  return new AppError(`Upload error: ${err.message}`, 400);
};

// ─── Development error response ──────────────────────────────────

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// ─── Production error response ───────────────────────────────────

const sendErrorProd = (err, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming errors: don't leak details
    console.error('💥 ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─── Main error handler ──────────────────────────────────────────

const globalErrorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    // Mongoose bad ObjectId
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Mongoose duplicate key
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Mongoose validation error
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    // JWT invalid
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // JWT expired
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // Multer errors
    if (error.name === 'MulterError') error = handleMulterError(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
