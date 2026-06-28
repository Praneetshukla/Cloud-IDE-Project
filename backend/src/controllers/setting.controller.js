const Setting = require('../models/Setting');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get user settings (creates defaults if not found)
 * @route   GET /api/settings
 * @access  Private
 */
exports.getSettings = catchAsync(async (req, res, next) => {
  let settings = await Setting.findOne({ user: req.user._id });
  
  if (!settings) {
    settings = await Setting.create({ user: req.user._id });
  }

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});

/**
 * @desc    Update user settings
 * @route   PUT /api/settings
 * @access  Private
 */
exports.updateSettings = catchAsync(async (req, res, next) => {
  const allowedFields = ['theme', 'fontSize', 'tabSize', 'wordWrap'];
  
  const updateData = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updateData[key] = req.body[key];
    }
  });

  const settings = await Setting.findOneAndUpdate(
    { user: req.user._id },
    updateData,
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      settings
    }
  });
});
