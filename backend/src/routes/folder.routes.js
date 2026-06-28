const express = require('express');
const folderController = require('../controllers/folder.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // Ensure all folder routes are protected

router
  .route('/')
  .post(folderController.createFolder);

router
  .route('/:id')
  .patch(folderController.updateFolder)
  .delete(folderController.deleteFolder);

module.exports = router;
