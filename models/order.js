const mongoose = require('mongoose');
const bcrypt = require('bcrypt.js');
const config = require('../config/database');

const OrderSchema = mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: String
  },
  weightRange: {
    type: String
  },
  sourceAddress: {
    type: String
  },
  destinationAddress: {
    type: String
  },
  deliveryDate: {
    type: String
  },
  status: {
    type: String
  },
  orderer: {
    type: String
  },
  assignee: {
    type: String
  }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.setOrder = function (orderData, callback) {
  orderData.save(callback);
}

module.exports.getOrderDetail = function (callback) {
  Order.find(callback);
}