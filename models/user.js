const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    default: 'end-user',
    enum: ['end-user', 'agent', 'admin']
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  profilePicture: {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function (user, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save(callback)
      // .then(result => result)
      // .catch(err => console.log(err));
    });
  });
}

module.exports.getUserById = function (id, callback) {
  User
    .findById(id, callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email }
  User
    .findOne(query, callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getUserByUsername = function (username, callback) {
  const query = { username: username }
  User.
    findOne(query, callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) console.log(err)
    callback(null, isMatch);
  });
}

module.exports.getUsers = function (callback) {
  User
    .find(callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getUserById = function (id, callback) {
  User
    .findById(id, callback)
    .exec()
}

module.exports.updateUserData = function (id, data, callback) {
  User
    .update({ _id: id }, data)
    .exec(callback);
}