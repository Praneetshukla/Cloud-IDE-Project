const express = require('express');
const fileController = require('../controllers/file.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(fileController.createFile);

router.post('/batch', fileController.createBatchFiles);

router
  .route('/:id')
  .get(fileController.getFile)
  .patch(fileController.updateFile)
  .delete(fileController.deleteFile);

module.exports = router;
