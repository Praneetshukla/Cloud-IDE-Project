const express = require('express');
const projectController = require('../controllers/project.controller');
const fileController = require('../controllers/file.controller');
const executeController = require('../controllers/execute.controller');
const gitController = require('../controllers/git.controller');
const aiController = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All project routes require authentication
router.use(protect);

// AI Routes
router.get('/:projectId/ai/chat', aiController.getChatHistory);
router.post('/:projectId/ai/chat', aiController.sendMessage);

// Git Routes
router.get('/:projectId/git', gitController.getRepository);
router.post('/:projectId/git/commit', gitController.createCommit);

// Execute Code Route
router.post('/:projectId/execute', executeController.executeFile);

// Tree Route (must be above /:id to avoid matching :id to 'recent')
router.get('/:projectId/tree', fileController.getProjectTree);

router.get('/recent', projectController.getRecentProjects);

router
  .route('/')
  .get(projectController.getProjects)
  .post(projectController.createProject);

module.exports = router;
