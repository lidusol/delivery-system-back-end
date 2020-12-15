const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = mongoose.Schema({
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
  },
  document: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false
  }
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);


const waitingAgAcc = module.exports = mongoose.model('WaitingAgentAcc', AgentSchema);

module.exports.addAgent = function (agent, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(agent.account.password, salt, (err, hash) => {
      if (err) throw err;
      agent.account.password = hash;
      agent
        .save(callback);
    });
  });
}


module.exports.getAgentByEmail = function (email, callback) {
  const query = { "account.email": email }
  waitingAgAcc
    .findOne(query, callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getAgentByUsername = function (username, callback) {
  const query = { "account.username": username }
  waitingAgAcc.
    findOne(query, callback)
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

module.exports.getAgents = function (callback) {
  waitingAgAcc
    .find(callback)
    .sort({ "created_at": -1 })
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.manageAccount = function (id, data, callback) {
  waitingAgAcc
    .findOneAndUpdate({ _id: id }, data, callback)
    .exec()
    .then(result => result);
}

module.exports.removeAccount = function (id, callback) {
  waitingAgAcc
    .deleteOne({ _id: id }, callback)
    .exec()
    .then(result => result);
}