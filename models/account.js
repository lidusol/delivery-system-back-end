const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    default: 'end-user',
    enum: ['end-user', 'agent', 'admin']
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true
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