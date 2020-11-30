const express = require("express");
const router = express.Router();

const checkAuth = require('../config/check-auth');
const checkImg = require('../config/check-img');

const agentController = require('../controllers/agentController');

router.post('/register', agentController.register);

router.post('/login', agentController.login);

router.get('/:agentId', checkAuth, agentController.getAgentById);

router.get('/', agentController.getAgents);

router.delete('/', agentController.deleteAgents);

router.patch('/:agentId', agentController.updateProfile);

router.patch('/uploadImg/:agentId', checkImg, agentController.uploadImage)

module.exports = router;