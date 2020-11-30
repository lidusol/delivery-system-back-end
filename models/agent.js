const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AgentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  role: {
    type: String,
    default: 'agent'
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
  },
  isApproved: {
    type: Boolean
  }
});

const Agent = module.exports = mongoose.model('Agent', AgentSchema);

module.exports.addAgent = function (agent, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(agent.password, salt, (err, hash) => {
      if (err) throw err;
      agent.password = hash;
      agent
        .save(callback)
      // .then(result => result)
      // .catch(err => console.log(err));
    });
  });
}

module.exports.getAgentById = function (id, callback) {
  Agent
    .findById(id, callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}


module.exports.manageAccount = function (id, data, callback) {
  Agent
    .update({ _id: id }, data)
    .exec(callback);
}

module.exports.getAgentByEmail = function (email, callback) {
  const query = { email: email }
  Agent
    .findOne(query, callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getAgentByUsername = function (username, callback) {
  const query = { username: username }
  Agent.
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

module.exports.getAgents = function (callback) {
  Agent
    .find(callback)
    .exec()
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getAgentById = function (id, callback) {
  Agent
    .findById(id, callback)
    .exec()
}

module.exports.updateAgentData = function (id, data, callback) {
  Agent
    .update({ _id: id }, data)
    .exec(callback);
}