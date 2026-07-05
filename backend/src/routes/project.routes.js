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
router.post('/:projectId/git/revert/:commitId', gitController.revertToCommit);

// Execute Code Route
router.post('/:projectId/execute', executeController.executeFile);

// Tree Route (must be above /:id to avoid matching :id to 'recent')
router.get('/:projectId/tree', fileController.getProjectTree);

router.get('/recent', projectController.getRecentProjects);
router.get('/trash', projectController.getTrashedProjects);

// Invite routes
router.post('/invite/accept', projectController.acceptInvite);
router.get('/:id/invite', projectController.generateInviteLink);

router
  .route('/')
  .get(projectController.getProjects)
  .post(projectController.createProject);

router.get('/:id', projectController.getProjectById);
router.put('/:id/favorite', projectController.toggleFavorite);
router.delete('/:id', projectController.deleteProject);
router.put('/:id/restore', projectController.restoreProject);
router.delete('/:id/hard', projectController.hardDeleteProject);

module.exports = router;
