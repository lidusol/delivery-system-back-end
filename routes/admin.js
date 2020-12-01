const express = require("express");
const router = express.Router();

const waitingAccController = require('../controllers/waitingAccController');

router.patch('/approve/:agentId', waitingAccController.approveAccount);

module.exports = router;