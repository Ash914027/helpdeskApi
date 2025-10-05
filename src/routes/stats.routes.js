const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/overview', statsController.getOverview);

module.exports = router;
