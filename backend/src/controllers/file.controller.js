const File = require('../models/File');
const Folder = require('../models/Folder');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get the entire file tree for a project
 * @route   GET /api/projects/:projectId/tree
 * @access  Private
 */
exports.getProjectTree = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Fetch all folders and files for the project
  const folders = await Folder.find({ project: projectId }).select('-__v');
  // Avoid fetching file content for the tree overview to save bandwidth
  const files = await File.find({ project: projectId }).select('-content -__v');

  res.status(200).json({
    status: 'success',
    data: {
      folders,
      files
    }
  });
});

/**
 * @desc    Get full file by ID (including content)
 * @route   GET /api/files/:id
 * @access  Private
 */
exports.getFile = catchAsync(async (req, res, next) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      file
    }
  });
});

/**
 * @desc    Create a new file
 * @route   POST /api/files
 * @access  Private
 */
exports.createFile = catchAsync(async (req, res, next) => {
  const { name, content, project: projectId, folder: folderId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, project: projectId });
    if (!folder) {
      return next(new AppError('Parent folder not found in this project', 404));
    }
  }

  const newFile = await File.create({
    name,
    content: content || '',
    project: projectId,
    folder: folderId || null
  });

  res.status(201).json({
    status: 'success',
    data: {
      file: newFile
    }
  });
});

/**
 * @desc    Update a file (rename, change content, or move)
 * @route   PATCH /api/files/:id
 * @access  Private
 */
exports.updateFile = catchAsync(async (req, res, next) => {
  const { name, content, folder } = req.body;
  const updates = {};
  
  if (name !== undefined) updates.name = name;
  if (content !== undefined) updates.content = content;
  if (folder !== undefined) updates.folder = folder || null;

  const file = await File.findById(req.params.id);
  
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  // Object.assign triggers the pre-save hook for extension language checking
  Object.assign(file, updates);
  await file.save();

  res.status(200).json({
    status: 'success',
    data: {
      file
    }
  });
});

/**
 * @desc    Delete a file
 * @route   DELETE /api/files/:id
 * @access  Private
 */
exports.deleteFile = catchAsync(async (req, res, next) => {
  const file = await File.findByIdAndDelete(req.params.id);

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
