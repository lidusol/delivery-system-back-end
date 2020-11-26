const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/database');

const User = require('../models/user');

const RETRY_MESSAGE = " Please try again.";

exports.register = async (req, res, next) => {
  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address
    });

    const email = req.body.email;
    const username = req.body.username;
    User.getUserByEmail(email, (err, user) => {
      if (user) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists. Please use different email address."
        });
      }
      User.getUserByUsername(username, (err, user) => {
        if (user) {
          return res.status(500).json({
            success: false,
            message: "Username already exists. Please use different username."
          });
        }
        User.addUser(newUser, (err, user) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: "Registration failed." + RETRY_MESSAGE + err
            });
          } else {
            res.status(200).json({
              success: true,
              message: "You are successfully registered."
            });
          }
        });
      });
    });
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "Authentication failed."
        });
      }
      if (!user) {
        return res.json({
          success: false,
          message: "You are not registered. Please sign up first."
        });
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Authentication failed.' + RETRY_MESSAGE
          });
        }
        if (isMatch) {
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week in sec
          });
          res.status(200).json({
            success: true,
            token: 'JWT ' + token,
            user
          });
        } else {
          return res.json({
            success: false,
            message: 'You have entered a wrong password.' + RETRY_MESSAGE
          });
        }
      });
    });
  } catch (error) {
    next(error);
  }
}

exports.getUserById = async (req, res, next) => {
  const id = req.params.userId;
  User.getUserById(id, (err, User) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Can not get the user." + RETRY_MESSAGE
      });
    }
    return res.json(User);
  });
}

exports.getUsers = (req, res, next) => {
  User.getUsers((err, User) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to retrieve users." + RETRY_MESSAGE
      });
    }
    return res.json(User);
  });
}

exports.deleteUsers = (req, res, next) => {
  User.remove()
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Users deleted",
      });
    });
}

exports.updateProfile = (req, res, next) => {
  const id = req.params.userId;
  let updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  let data = { $set: updateOps };
  User.updateUserData(id, data, (err, User) => {
    if (err) {
      res.status(200).json({
        success: false,
        message: "Failed to update profile" + RETRY_MESSAGE
      });
    }
    return res.status(500).json({
      success: true,
      message: "Profile successfully updated.",
      user: User
    });
  });
}

exports.uploadImage = (req, res, next) => {
  const id = req.params.userId;
  const img = req.file.path;
  User.updateUserData(id, { profilePicture: img }, (err, User) => {
    if (err) {
      res.status(200).json({
        success: false,
        message: "Failed to update profile picture" + RETRY_MESSAGE
      });
    }
    return res.status(500).json({
      success: true,
      message: "Profile picture successfully updated.",
      user: User
    });
  });
}

exports.deleteUserById = (req, res, next) => {
  const id = req.params.id;
  User
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted",
      });
    });
}