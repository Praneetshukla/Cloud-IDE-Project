const Workspace = require('../models/Workspace');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all workspaces for the current user
 * @route   GET /api/workspaces
 * @access  Private
 */
exports.getWorkspaces = catchAsync(async (req, res, next) => {
  // Fetch workspaces where user is owner OR a member
  const workspaces = await Workspace.find({
    $or: [
      { owner: req.user.id },
      { 'members.user': req.user.id }
    ]
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    status: 'success',
    results: workspaces.length,
    data: {
      workspaces
    }
  });
});

/**
 * @desc    Create a new workspace (Basic implementation for Phase 2)
 * @route   POST /api/workspaces
 * @access  Private
 */
exports.createWorkspace = catchAsync(async (req, res, next) => {
  const { name, description, icon, color } = req.body;

  const newWorkspace = await Workspace.create({
    name,
    description,
    icon,
    color,
    owner: req.user.id,
    members: [
      {
        user: req.user.id,
        role: 'admin'
      }
    ]
  });

  res.status(201).json({
    status: 'success',
    data: {
      workspace: newWorkspace
    }
  });
});

/**
 * @desc    Get a single workspace by ID
 * @route   GET /api/workspaces/:id
 * @access  Private
 */
exports.getWorkspace = catchAsync(async (req, res, next) => {
  const workspace = await Workspace.findOne({
    _id: req.params.id,
    $or: [
      { owner: req.user.id },
      { 'members.user': req.user.id }
    ]
  });

  if (!workspace) {
    return next(new AppError('Workspace not found or you do not have access', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      workspace
    }
  });
});

/**
 * @desc    Update a workspace
 * @route   PATCH /api/workspaces/:id
 * @access  Private
 */
exports.updateWorkspace = catchAsync(async (req, res, next) => {
  // Allow updating name, description, color, icon
  const updates = {};
  const allowedFields = ['name', 'description', 'color', 'icon'];
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const workspace = await Workspace.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id }, // Only owner can update
    updates,
    { new: true, runValidators: true }
  );

  if (!workspace) {
    return next(new AppError('Workspace not found or you are not the owner', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      workspace
    }
  });
});

/**
 * @desc    Delete a workspace (and cascade delete its projects)
 * @route   DELETE /api/workspaces/:id
 * @access  Private
 */
exports.deleteWorkspace = catchAsync(async (req, res, next) => {
  // Use findOneAndDelete to trigger the pre hook in the model
  const workspace = await Workspace.findOneAndDelete({
    _id: req.params.id,
    owner: req.user.id // Only owner can delete
  });

  if (!workspace) {
    return next(new AppError('Workspace not found or you are not the owner', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
