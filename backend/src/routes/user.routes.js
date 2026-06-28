const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { handleAvatarUpload } = require('../middleware/upload.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  changePasswordValidation,
  updateProfileValidation,
} = require('../validators/auth.validator');

/**
 * User routes — /api/users/*
 * All routes require authentication.
 */

router.use(protect);

// Get profile
router.get('/profile', userController.getProfile);

// Update profile
router.patch(
  '/profile',
  updateProfileValidation,
  validate,
  userController.updateProfile
);

// Change password
router.patch(
  '/change-password',
  changePasswordValidation,
  validate,
  userController.changePassword
);

// Upload avatar
router.post('/avatar', handleAvatarUpload, userController.uploadAvatar);

// Delete avatar
router.delete('/avatar', userController.deleteAvatar);

// User activity stats
router.get('/stats', userController.getUserStats);

module.exports = router;
