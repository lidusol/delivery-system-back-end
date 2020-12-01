const express = require("express");
const router = express.Router();
const checkAuth = require('../config/check-auth');
const checkImg = require('../config/check-img');

const waitingAccController = require('../controllers/waitingAccController');

router.post('/register', waitingAccController.register);

router.post('/login', waitingAccController.login);

router.get('/', waitingAccController.getWaitingAccounts);

module.exports = router;