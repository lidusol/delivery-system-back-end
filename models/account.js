const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    default: 'end-user',
    enum: ['end-user', 'agent', 'admin']
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
  }
});

module.exports = mongoose.model('Account', AccountSchema);