const Project = require('../models/Project');
const File = require('../models/File');
const Folder = require('../models/Folder');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all projects for the current user (with optional search/filter)
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = catchAsync(async (req, res, next) => {
  const { search, language } = req.query;
  
  // Show projects the user owns OR collaborates on, excluding deleted ones
  let query = { 
    $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    isDeleted: { $ne: true }
  };
  
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
  const projects = await Project.find({
    $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    isDeleted: { $ne: true }
  })
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

  // Scaffold initial files based on language template
  if (language === 'react') {
    const srcFolder = await Folder.create({ name: 'src', project: newProject._id });
    const publicFolder = await Folder.create({ name: 'public', project: newProject._id });

    await File.insertMany([
      { name: 'package.json', project: newProject._id, content: '{\n  "name": "react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}' },
      { name: 'index.html', project: newProject._id, folder: publicFolder._id, content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>React App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>' },
      { name: 'App.jsx', project: newProject._id, folder: srcFolder._id, content: 'import React from "react";\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Hello from React!</h1>\n    </div>\n  );\n}' },
      { name: 'index.jsx', project: newProject._id, folder: srcFolder._id, content: 'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);' }
    ]);
  } else if (language === 'node') {
    await File.insertMany([
      { name: 'package.json', project: newProject._id, content: '{\n  "name": "node-app",\n  "version": "1.0.0",\n  "main": "server.js",\n  "dependencies": {\n    "express": "^4.18.2"\n  }\n}' },
      { name: 'server.js', project: newProject._id, content: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello from Node.js!");\n});\n\napp.listen(3000, () => console.log("Server running on port 3000"));' }
    ]);
  } else if (language === 'html') {
    await File.insertMany([
      { name: 'index.html', project: newProject._id, content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>HTML App</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="script.js"></script>\n</body>\n</html>' },
      { name: 'style.css', project: newProject._id, content: 'body {\n  font-family: sans-serif;\n  text-align: center;\n  padding-top: 50px;\n}' },
      { name: 'script.js', project: newProject._id, content: 'console.log("Hello from script.js!");' }
    ]);
  } else if (language === 'python') {
    await File.create({ name: 'main.py', project: newProject._id, content: 'print("Hello from Python!")' });
  } else {
    // javascript or other
    await File.create({ name: 'index.js', project: newProject._id, content: 'console.log("Hello World!");' });
  }

  // Populate workspace info before returning
  await newProject.populate('workspace', 'name color icon');

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

/**
 * @desc    Get project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
exports.getProjectById = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('workspace', 'name color icon')
    .populate('owner', 'name email avatar')
    .populate('collaborators', 'name email avatar');

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Allow if owner or collaborator
  if (
    project.owner._id.toString() !== req.user.id &&
    !project.collaborators.some(c => c._id.toString() === req.user.id)
  ) {
    return next(new AppError('You do not have permission to access this project', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

const jwt = require('jsonwebtoken');

/**
 * @desc    Generate an invite link for a project
 * @route   GET /api/projects/:id/invite
 * @access  Private
 */
exports.generateInviteLink = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Only owner can generate invite link (or collaborators if you want)
  if (project.owner.toString() !== req.user.id) {
    return next(new AppError('Only the project owner can generate invite links', 403));
  }

  const payload = {
    projectId: project._id,
    inviterId: req.user.id,
  };

  // Create a JWT token valid for 7 days
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });

  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  });
});

/**
 * @desc    Accept an invite link for a project
 * @route   POST /api/projects/invite/accept
 * @access  Private
 */
exports.acceptInvite = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Invite token is required', 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return next(new AppError('Invalid or expired invite token', 400));
  }

  const project = await Project.findById(decoded.projectId);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Check if user is the owner
  if (project.owner.toString() === req.user.id) {
    return res.status(200).json({
      status: 'success',
      message: 'You are the owner of this project',
      data: { projectId: project._id }
    });
  }

  // Check if already a collaborator
  if (project.collaborators.some(c => c.toString() === req.user.id)) {
    return res.status(200).json({
      status: 'success',
      message: 'You are already a collaborator',
      data: { projectId: project._id }
    });
  }

  // Add to collaborators
  project.collaborators.push(req.user.id);
  await project.save();

  res.status(200).json({
    status: 'success',
    message: 'Successfully joined the project',
    data: { projectId: project._id }
  });
});

/**
 * @desc    Toggle project favorite status
 * @route   PUT /api/projects/:id/favorite
 * @access  Private
 */
exports.toggleFavorite = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Allow if owner or collaborator
  if (
    project.owner.toString() !== req.user.id &&
    !project.collaborators.some(c => c.toString() === req.user.id)
  ) {
    return next(new AppError('You do not have permission to modify this project', 403));
  }

  project.isFavorite = !project.isFavorite;
  await project.save();

  await project.populate('workspace', 'name color icon');

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

/**
 * @desc    Delete project by ID
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Only owner can delete project
  if (project.owner.toString() !== req.user.id) {
    return next(new AppError('Only the project owner can delete this project', 403));
  }

  // Soft delete
  project.isDeleted = true;
  project.deletedAt = Date.now();
  await project.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * @desc    Get all soft-deleted projects
 * @route   GET /api/projects/trash
 * @access  Private
 */
exports.getTrashedProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({
    owner: req.user.id,
    isDeleted: true
  }).sort({ deletedAt: -1 });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects }
  });
});

/**
 * @desc    Restore a soft-deleted project
 * @route   PUT /api/projects/:id/restore
 * @access  Private
 */
exports.restoreProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });

  if (!project) {
    return next(new AppError('Project not found or not owned by you', 404));
  }

  project.isDeleted = false;
  project.deletedAt = null;
  await project.save();

  await project.populate('workspace', 'name color icon');

  res.status(200).json({
    status: 'success',
    data: { project }
  });
});

/**
 * @desc    Permanently delete a project
 * @route   DELETE /api/projects/:id/hard
 * @access  Private
 */
exports.hardDeleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });

  if (!project) {
    return next(new AppError('Project not found or not owned by you', 404));
  }

  await Project.findByIdAndDelete(req.params.id);
  
  await File.deleteMany({ project: req.params.id });
  await Folder.deleteMany({ project: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
