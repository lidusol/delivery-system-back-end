const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/database');


const Agent = require('../models/agent');

exports.register = async (req, res, next) => {
  try {
    const newAgent = new Agent({
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
    Agent.getAgentByEmail(email, (err, agent) => {
      if (agent) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists. Please use different email address."
        });
      }
      Agent.getAgentByUsername(username, (err, agent) => {
        if (agent) {
          return res.status(500).json({
            success: false,
            message: "Username already exists. Please use different username."
          });
        }
        Agent.addAgent(newAgent, (err, agent) => {
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

    Agent.getAgentByUsername(username, (err, agent) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "Authentication failed."
        });
      }
      if (!agent) {
        return res.json({
          success: false,
          message: "You are not registered. Please sign up first."
        });
      }

      Agent.comparePassword(password, agent.password, (err, isMatch) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Authentication failed.' + RETRY_MESSAGE
          });
        }
        if (isMatch) {
          const token = jwt.sign(agent.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week in sec
          });
          res.status(200).json({
            success: true,
            token: 'JWT ' + token,
            agent
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

exports.getAgentById = async (req, res, next) => {
  const id = req.params.agentId;
  Agent.getAgentById(id, (err, Agent) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Can not get the agent." + RETRY_MESSAGE
      });
    }
    return res.json(Agent);
  });
}

exports.getAgents = (req, res, next) => {
  Agent.getAgents((err, Agent) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to retrieve agents." + RETRY_MESSAGE
      });
    }
    return res.json(Agent);
  });
}

exports.deleteAgents = (req, res, next) => {
  Agent.remove()
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Agents deleted",
      });
    });
}

exports.updateProfile = (req, res, next) => {
  const id = req.params.agentId;
  let updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  let data = { $set: updateOps };
  Agent.updateAgentData(id, data, (err, Agent) => {
    if (err) {
      res.status(200).json({
        success: false,
        message: "Failed to update profile" + RETRY_MESSAGE
      });
    }
    return res.status(500).json({
      success: true,
      message: "Profile successfully updated.",
      agent: Agent
    });
  });
}

exports.uploadImage = (req, res, next) => {
  const id = req.params.agentId;
  const img = req.file.path;
  Agent.updateAgentData(id, { profilePicture: img }, (err, Agent) => {
    if (err) {
      res.status(200).json({
        success: false,
        message: "Failed to update profile picture" + RETRY_MESSAGE
      });
    }
    return res.status(500).json({
      success: true,
      message: "Profile picture successfully updated.",
      agent: Agent
    });
  });
}

exports.manageAccount = async (req, res, next) => {
  const id = req.params.agentId;
  let updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  let data = { $set: updateOps };
  Agent.manageAccount(id, data, (err, Agent) => {
    if (err) {
      res.status(200).json({
        success: false,
        message: "Failed to approve account" + RETRY_MESSAGE
      });
    }
    return res.status(500).json({
      success: true,
      message: "Account successfully approved.",
      agent: Agent
    });
  });
};