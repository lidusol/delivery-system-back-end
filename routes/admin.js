const express = require("express");
const router = express.Router();

const checkAuth = require('../config/check-auth');
const agentController = require('../controllers/agentController');

router.patch('/approve/:agentId', agentController.manageAccount);

module.exports = router;