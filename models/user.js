const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  account: {
    type: mongoose.Schema.Types.Object,
    ref: 'Account',
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
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = function (user, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.account.password, salt, (err, hash) => {
      if (err) throw err;
      user.account.password = hash;
      user
        .save(callback);
    });
  });
}

module.exports.getUserById = function (id, callback) {
  User
    .findById(id, callback)
    .exec();
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { "account.email": email }
  User
    .findOne(query, callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getUserByUsername = function (username, callback) {
  const query = { "account.username": username }
  User
    .findOne(query, callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
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
    .sort({ "created_at": -1 })
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}


module.exports.updateUserData = function (id, data, callback) {
  User
    .findOneAndUpdate({ _id: id }, data)
    .exec(callback);
}
