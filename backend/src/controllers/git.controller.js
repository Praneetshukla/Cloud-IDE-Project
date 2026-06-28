const GitRepository = require('../models/GitRepository');
const Project = require('../models/Project');
const File = require('../models/File');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get Git repository for a project (creates one if it doesn't exist)
 * @route   GET /api/projects/:projectId/git
 * @access  Private
 */
exports.getRepository = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  let repo = await GitRepository.findOne({ project: projectId }).populate('commits.author', 'name email avatarUrl');
  
  // If no repo exists yet for this project, create an empty one
  if (!repo) {
    repo = await GitRepository.create({ project: projectId, commits: [] });
  }

  res.status(200).json({
    status: 'success',
    data: {
      repository: repo
    }
  });
});

/**
 * @desc    Create a new commit
 * @route   POST /api/projects/:projectId/git/commit
 * @access  Private
 */
exports.createCommit = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { message } = req.body;

  if (!message) {
    return next(new AppError('Commit message is required', 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Get current files
  const currentFiles = await File.find({ project: projectId }).select('_id content');
  
  const snapshots = currentFiles.map(f => ({
    fileId: f._id,
    content: f.content
  }));

  const newCommit = {
    message,
    author: req.user._id,
    timestamp: new Date(),
    snapshots
  };

  const repo = await GitRepository.findOneAndUpdate(
    { project: projectId },
    { $push: { commits: newCommit } },
    { new: true, upsert: true }
  ).populate('commits.author', 'name email avatarUrl');

  res.status(201).json({
    status: 'success',
    data: {
      repository: repo
    }
  });
});
