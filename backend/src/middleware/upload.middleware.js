const multer = require('multer');
const AppError = require('../utils/AppError');
const { UPLOAD_LIMITS } = require('../utils/constants');

/**
 * Multer configuration for avatar uploads.
 * Uses memory storage (buffer) so we can stream directly to Cloudinary
 * without writing to disk — better for containerized deployments.
 */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (UPLOAD_LIMITS.AVATAR_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Allowed types: ${UPLOAD_LIMITS.AVATAR_ALLOWED_TYPES.join(', ')}`,
        400
      ),
      false
    );
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_LIMITS.AVATAR_MAX_SIZE,
  },
}).single('avatar');

/**
 * Wraps multer upload in a middleware that catches multer-specific errors
 * and forwards them to the global error handler.
 */
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError(
            `File too large. Maximum size is ${UPLOAD_LIMITS.AVATAR_MAX_SIZE / (1024 * 1024)}MB.`,
            400
          )
        );
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = { handleAvatarUpload };
