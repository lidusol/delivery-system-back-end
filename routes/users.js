const express = require("express");
const router = express.Router();

const checkAuth = require('../config/check-auth');
const checkImg = require('../config/check-img');

const userController = require('../controllers/userController');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/:userId', checkAuth, userController.getUserById);

router.get('/', userController.getUsers);

router.delete('/', userController.deleteUsers);

router.patch('/:userId', userController.updateProfile);

router.delete('/:id', userController.deleteUserById);

router.patch('/uploadImg/:userId', checkImg, userController.uploadImage)

module.exports = router;