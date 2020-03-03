const mongoose = require('mongoose');
const bcrypt = require('bcrypt.js');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  profilePicture
    : {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

