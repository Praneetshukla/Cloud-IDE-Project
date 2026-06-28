/**
 * Wraps async route handlers/controllers to catch errors
 * and forward them to Express's global error handler.
 * Eliminates repetitive try/catch blocks in every controller.
 *
 * @param {Function} fn - Async function (req, res, next) => {}
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
