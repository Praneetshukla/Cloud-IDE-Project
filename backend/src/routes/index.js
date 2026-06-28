const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');

const workspaceRoutes = require('./workspace.routes');
const projectRoutes = require('./project.routes');
const folderRoutes = require('./folder.routes');
const fileRoutes = require('./file.routes');
const settingRoutes = require('./setting.routes');

/**
 * Root router — mounts all sub-routers.
 * Base path: /api
 */

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Orbit API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/projects', projectRoutes);
router.use('/folders', folderRoutes);
router.use('/files', fileRoutes);
router.use('/settings', settingRoutes);

module.exports = router;
