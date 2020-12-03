const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/database');

const Account = require('../models/account');
const User = require('../models/user');
const WaitingAgentAcc = require('../models/waitingAgAccount');

const RETRY_MESSAGE = " Please try again.";

exports.register = async (req, res, next) => {
  try {
    const account = new Account({
      _id: new mongoose.Types.ObjectId(),
      role: req.body.role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const waitingAcc = new WaitingAgentAcc({
      _id: new mongoose.Types.ObjectId(),
      account: account,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });

    const email = req.body.email;
    const username = req.body.username;
    WaitingAgentAcc.getAgentByEmail(email, (err, agent) => {
      if (agent) {
        return res.status(409).json({
          success: false,
          message: "Email address already exists. Please use different email address."
        });
      }
      WaitingAgentAcc.getAgentByUsername(username, (err, agent) => {
        if (agent) {
          return res.status(500).json({
            success: false,
            message: "Username already exists. Please use different username."
          });
        }
        WaitingAgentAcc.addAgent(waitingAcc, (err, agent) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: "Registration failed." + RETRY_MESSAGE + err
            });
          } else {
            res.status(200).json({
              success: true,
              message: "You are successfully registered.",
              AgAccount: agent
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

    WaitingAgentAcc.getAgentByUsername(username, (err, agent) => {
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

      WaitingAgentAcc.comparePassword(password, agent.account.password, (err, isMatch) => {
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
            message: 'You have entered wrong username or password.' + RETRY_MESSAGE
          });
        }
      });
    });
  } catch (error) {
    next(error);
  }
}


exports.getWaitingAccounts = (req, res, next) => {
  WaitingAgentAcc.getAgents((err, Agent) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to retrieve agents." + RETRY_MESSAGE
      });
    }
    return res.status(200).json({
      success: true,
      message: "Waiting agents accounts:",
      accounts: Agent
    });
  });
}


exports.approveAccount = (req, res, next) => {
  const id = req.params.agentId;
  let data = {
    $set: { isApproved: true }
  };
  WaitingAgentAcc.manageAccount(id, data, (err, agent) => {
    if (err) {
      res.json({
        success: false,
        message: "Failed to approve agent account. " + RETRY_MESSAGE
      });
    } else {
      const approvedAgent = new User({
        _id: agent._id,
        account: agent.account,
        phoneNumber: agent.phoneNumber,
        address: agent.address
      });
      let obj = User.find({ _id: approvedAgent._id });
      if (!obj) {
        approvedAgent
          .save()
          .then(result => {
            res.json({
              success: true,
              message: "Agent account approved",
              agent: result
            })
          });
      } else {
        res.json({
          success: true,
          message: "Agent account already approved",
          agent: approvedAgent
        })
      }

    }
  });
}

