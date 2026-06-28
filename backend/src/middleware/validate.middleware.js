const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware that checks for express-validator validation errors.
 * If errors exist, it formats them and throws a 400 error.
 * Use after validation chain arrays in routes.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));

    const errorMessages = formattedErrors.map((e) => e.message).join('. ');

    const error = new AppError(errorMessages, 400);
    error.errors = formattedErrors;
    return next(error);
  }

  next();
};

module.exports = { validate };
