const express = require('express');
const settingController = require('../controllers/setting.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(settingController.getSettings)
  .put(settingController.updateSettings);

module.exports = router;
