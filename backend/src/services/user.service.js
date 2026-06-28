const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sanitizeUser } = require('../utils/helpers');

/**
 * User service — profile management business logic.
 */

/**
 * Gets the current user's profile.
 * @param {string} userId - User's MongoDB _id.
 * @returns {Promise<object>} Sanitized user object.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found.');
  }
  return sanitizeUser(user);
};

/**
 * Updates user profile fields (name, email).
 * @param {string} userId - User's MongoDB _id.
 * @param {object} updates - { name?, email? }
 * @returns {Promise<object>} Updated sanitized user.
 */
const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'email'];
  const filteredUpdates = {};

  // Only allow whitelisted fields
  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key) && updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw AppError.badRequest('No valid fields to update.');
  }

  // If email is changing, check for duplicates
  if (filteredUpdates.email) {
    const existingUser = await User.findOne({
      email: filteredUpdates.email,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw AppError.conflict('An account with this email already exists.');
    }

    // Mark email as unverified when changed
    filteredUpdates.isEmailVerified = false;
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw AppError.notFound('User not found.');
  }

  return sanitizeUser(user);
};

/**
 * Changes user's password.
 * @param {string} userId - User's MongoDB _id.
 * @param {string} currentPassword - Current password for verification.
 * @param {string} newPassword - New password.
 * @returns {Promise<object>} Updated sanitized user.
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Get user with password field
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw AppError.notFound('User not found.');
  }

  // Verify current password
  if (!user.password) {
    throw AppError.badRequest(
      'This account uses social login and does not have a password. Please use the OAuth provider to manage your account.'
    );
  }

  const isCorrect = await user.comparePassword(currentPassword);
  if (!isCorrect) {
    throw AppError.unauthorized('Current password is incorrect.');
  }

  // Update password (pre-save hook handles hashing)
  user.password = newPassword;
  await user.save();

  return sanitizeUser(user);
};

/**
 * Uploads user avatar to Cloudinary.
 * @param {string} userId - User's MongoDB _id.
 * @param {object} file - Multer file object (buffer).
 * @returns {Promise<object>} Updated sanitized user with new avatar URL.
 */
const uploadAvatar = async (userId, file) => {
  if (!file) {
    throw AppError.badRequest('No file uploaded.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  // Delete old avatar from Cloudinary if it exists
  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (error) {
      console.error('Failed to delete old avatar:', error.message);
    }
  }

  // Upload new avatar using stream (no temp file on disk)
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'orbit/avatars',
        public_id: `avatar_${userId}_${Date.now()}`,
        transformation: [
          { width: 256, height: 256, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

  // Update user with new avatar
  user.avatar = result.secure_url;
  user.avatarPublicId = result.public_id;
  await user.save({ validateBeforeSave: false });

  return sanitizeUser(user);
};

/**
 * Deletes user's avatar.
 * @param {string} userId - User's MongoDB _id.
 * @returns {Promise<object>} Updated sanitized user.
 */
const deleteAvatar = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found.');
  }

  // Delete from Cloudinary
  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (error) {
      console.error('Failed to delete avatar from Cloudinary:', error.message);
    }
  }

  user.avatar = null;
  user.avatarPublicId = null;
  await user.save({ validateBeforeSave: false });

  return sanitizeUser(user);
};

/**
 * Gets aggregated activity statistics for the user.
 * @param {string} userId - User's MongoDB _id.
 * @returns {Promise<object>} Stats object.
 */
const getUserStats = async (userId) => {
  const Workspace = require('../models/Workspace');
  const Project = require('../models/Project');
  const File = require('../models/File');
  const GitRepository = require('../models/GitRepository');
  const TerminalSession = require('../models/TerminalSession');

  const [workspaces, projects, files, gitRepos, terminalSessions] = await Promise.all([
    Workspace.countDocuments({ owner: userId }),
    Project.countDocuments({ owner: userId }),
    File.countDocuments({}), // All files (we'll scope later if needed)
    GitRepository.find({}).lean(),
    TerminalSession.countDocuments({})
  ]);

  // Count total commits across all repos
  const totalCommits = gitRepos.reduce((acc, repo) => acc + (repo.commits ? repo.commits.length : 0), 0);

  return {
    workspaces,
    projects,
    files,
    commits: totalCommits,
    terminalSessions
  };
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  getUserStats,
};
