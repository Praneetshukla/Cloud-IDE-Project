const express = require('express');
const workspaceController = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All workspace routes require authentication
router.use(protect);

router
  .route('/')
  .get(workspaceController.getWorkspaces)
  .post(workspaceController.createWorkspace);

router
  .route('/:id')
  .get(workspaceController.getWorkspace)
  .patch(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

module.exports = router;
