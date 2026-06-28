const Folder = require('../models/Folder');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Create a new folder
 * @route   POST /api/folders
 * @access  Private
 */
exports.createFolder = catchAsync(async (req, res, next) => {
  const { name, project: projectId, parent } = req.body;

  // Validate project ownership/membership
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // (Optional: Add more rigorous permission checks here later, like checking if user is in workspace members)
  
  if (parent) {
    const parentFolder = await Folder.findOne({ _id: parent, project: projectId });
    if (!parentFolder) {
      return next(new AppError('Parent folder not found in this project', 404));
    }
  }

  const newFolder = await Folder.create({
    name,
    project: projectId,
    parent: parent || null
  });

  res.status(201).json({
    status: 'success',
    data: {
      folder: newFolder
    }
  });
});

/**
 * @desc    Update a folder (Rename or move)
 * @route   PATCH /api/folders/:id
 * @access  Private
 */
exports.updateFolder = catchAsync(async (req, res, next) => {
  const { name, parent } = req.body;
  const updates = {};
  
  if (name !== undefined) updates.name = name;
  if (parent !== undefined) updates.parent = parent || null;

  const folder = await Folder.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!folder) {
    return next(new AppError('Folder not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      folder
    }
  });
});

/**
 * @desc    Delete a folder (cascades via pre hook)
 * @route   DELETE /api/folders/:id
 * @access  Private
 */
exports.deleteFolder = catchAsync(async (req, res, next) => {
  const folder = await Folder.findOneAndDelete({ _id: req.params.id });

  if (!folder) {
    return next(new AppError('Folder not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
