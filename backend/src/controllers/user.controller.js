const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { apiResponse } = require('../utils/helpers');

/**
 * User controller — HTTP layer for user profile endpoints.
 */

// ─── Get Profile ─────────────────────────────────────────────────

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user._id);

  res.status(200).json(
    apiResponse('success', 'Profile retrieved successfully.', { user })
  );
});

// ─── Update Profile ──────────────────────────────────────────────

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);

  res.status(200).json(
    apiResponse('success', 'Profile updated successfully.', { user })
  );
});

// ─── Change Password ─────────────────────────────────────────────

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await userService.changePassword(req.user._id, currentPassword, newPassword);

  res.status(200).json(
    apiResponse('success', 'Password changed successfully.')
  );
});

// ─── Upload Avatar ───────────────────────────────────────────────

const uploadAvatar = catchAsync(async (req, res) => {
  const user = await userService.uploadAvatar(req.user._id, req.file);

  res.status(200).json(
    apiResponse('success', 'Avatar uploaded successfully.', { user })
  );
});

// ─── Delete Avatar ───────────────────────────────────────────────

const deleteAvatar = catchAsync(async (req, res) => {
  const user = await userService.deleteAvatar(req.user._id);

  res.status(200).json(
    apiResponse('success', 'Avatar deleted successfully.', { user })
  );
});

// ─── Get User Stats ──────────────────────────────────────────────

const getUserStats = catchAsync(async (req, res) => {
  const stats = await userService.getUserStats(req.user._id);

  res.status(200).json(
    apiResponse('success', 'Stats retrieved successfully.', { stats })
  );
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  getUserStats,
};
