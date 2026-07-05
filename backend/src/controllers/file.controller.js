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

  if (
    project.owner.toString() !== req.user.id &&
    !project.collaborators.some(c => c.toString() === req.user.id)
  ) {
    return next(new AppError('You do not have permission to access this project', 403));
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

/**
 * @desc    Batch create files and folders (for drag and drop)
 * @route   POST /api/files/batch
 * @access  Private
 */
exports.createBatchFiles = catchAsync(async (req, res, next) => {
  const { project: projectId, files } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Cache folder paths to avoid redundant DB queries
  const folderCache = {}; 
  
  // Helper to sequentially get or create folder structure
  const getOrCreateFolder = async (folderPath) => {
    if (!folderPath || folderPath === '/' || folderPath === '') return null;
    
    // Normalize path
    folderPath = folderPath.replace(/^\/+|\/+$/g, '');
    
    if (folderCache[folderPath]) return folderCache[folderPath];

    const parts = folderPath.split('/');
    let currentParentId = null;
    let currentPath = '';

    for (const part of parts) {
      currentPath += currentPath ? `/${part}` : part;
      
      if (folderCache[currentPath]) {
        currentParentId = folderCache[currentPath];
        continue;
      }

      let folder = await Folder.findOne({ 
        project: projectId, 
        name: part, 
        parent: currentParentId 
      });

      if (!folder) {
        folder = await Folder.create({
          project: projectId,
          name: part,
          parent: currentParentId
        });
      }

      folderCache[currentPath] = folder._id;
      currentParentId = folder._id;
    }

    return currentParentId;
  };

  const createdFiles = [];

  for (const fileData of files) {
    const { name, content, path } = fileData; 
    const folderId = await getOrCreateFolder(path);

    // Check if file already exists in this folder
    let file = await File.findOne({ project: projectId, folder: folderId, name });
    
    if (file) {
      file.content = content || '';
      await file.save();
    } else {
      file = await File.create({
        name,
        content: content || '',
        project: projectId,
        folder: folderId || null
      });
    }
    
    createdFiles.push(file);
  }

  res.status(201).json({
    status: 'success',
    data: {
      files: createdFiles
    }
  });
});
