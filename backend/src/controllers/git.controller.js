const GitRepository = require('../models/GitRepository');
const Project = require('../models/Project');
const File = require('../models/File');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { docs } = require('y-websocket/bin/utils');

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
  const { message, filesData } = req.body;

  if (!message) {
    return next(new AppError('Commit message is required', 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Get current files from DB
  const currentFiles = await File.find({ project: projectId }).select('_id content');
  
  // Create snapshots, prioritizing frontend's live data over DB
  const snapshots = currentFiles.map(f => {
    const liveFile = filesData ? filesData.find(fd => fd.fileId === f._id.toString()) : null;
    return {
      fileId: f._id,
      content: liveFile ? liveFile.content : f.content
    };
  });

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

/**
 * @desc    Revert to a specific commit
 * @route   POST /api/projects/:projectId/git/revert/:commitId
 * @access  Private
 */
exports.revertToCommit = catchAsync(async (req, res, next) => {
  const { projectId, commitId } = req.params;

  const repo = await GitRepository.findOne({ project: projectId }).populate('commits.author', 'name email avatarUrl');
  if (!repo) {
    return next(new AppError('Repository not found', 404));
  }

  const commitToRevert = repo.commits.id(commitId);
  if (!commitToRevert) {
    return next(new AppError('Commit not found', 404));
  }

  // Restore file contents to the snapshots
  for (const snapshot of commitToRevert.snapshots) {
    await File.findByIdAndUpdate(snapshot.fileId, { content: snapshot.content });
    
    // CRITICAL: Clear the Yjs document from backend memory so the frontend's
    // reload will fetch the fresh database content instead of the old memory state.
    // Note: y-websocket uses req.url.slice(1) as the docName, so it includes 'yjs/' prefix
    const roomName = `yjs/${projectId}-${snapshot.fileId}`;
    if (docs.has(roomName)) {
      const doc = docs.get(roomName);
      // Properly destroy the Yjs document to clear it from memory and clean up
      doc.destroy();
      docs.delete(roomName);
    }
  }

  // Create a new commit for the revert
  const revertCommit = {
    message: `Reverted to commit ${commitId.substring(0, 7)}`,
    author: req.user._id,
    timestamp: new Date(),
    snapshots: commitToRevert.snapshots
  };

  repo.commits.push(revertCommit);
  await repo.save();
  await repo.populate('commits.author', 'name email avatarUrl');

  res.status(200).json({
    status: 'success',
    data: {
      repository: repo,
      message: 'Reverted successfully'
    }
  });
});
