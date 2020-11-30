const express = require("express");
const router = express.Router();
const cors = require("cors");
const checkAuth = require('../config/check-auth');
const checkImg = require('../config/check-img');

const agentController = require('../controllers/agentController');

router.post('/register', agentController.register);
router.use(cors())
router.post('/login', agentController.login);

router.patch('/approve/:agentId', agentController.manageAccount);

router.get('/:agentId', checkAuth, agentController.getAgentById);

router.get('/', agentController.getAgents);

router.delete('/', agentController.deleteAgents);

router.patch('/:agentId', agentController.updateProfile);

router.patch('/uploadImg/:agentId', checkImg, agentController.uploadImage)

module.exports = router;