const Project = require('../models/Project');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all projects for the current user (with optional search/filter)
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = catchAsync(async (req, res, next) => {
  const { search, language } = req.query;
  
  let query = { owner: req.user.id };
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  if (language && language !== 'all') {
    query.language = language;
  }

  const projects = await Project.find(query)
    .populate('workspace', 'name color icon')
    .sort({ lastAccessed: -1 });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

/**
 * @desc    Get recent projects (limit 6)
 * @route   GET /api/projects/recent
 * @access  Private
 */
exports.getRecentProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({ owner: req.user.id })
    .populate('workspace', 'name color icon')
    .sort({ lastAccessed: -1 })
    .limit(6);

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
});

/**
 * @desc    Create a new project (Basic implementation for testing)
 * @route   POST /api/projects
 * @access  Private
 */
exports.createProject = catchAsync(async (req, res, next) => {
  const { name, description, workspace, language } = req.body;

  if (!workspace) {
    return next(new AppError('Project must belong to a workspace', 400));
  }

  const newProject = await Project.create({
    name,
    description,
    workspace,
    language,
    owner: req.user.id
  });

  // Populate workspace info before returning
  await newProject.populate('workspace', 'name color icon');

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});
