const express = require("express");
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/profile', userController.getProfile);

router.get('/', userController.getUsers);

router.delete('/', userController.deleteUsers);

router.patch('/:userId', userController.updateUserData);

router.delete('/:id', userController.deleteUserById);

module.exports = router;