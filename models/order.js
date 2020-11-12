const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item: {
    type: mongoose.Schema.Types.Object,
    ref: 'Item',
    required: true
  },
  sourceAddress: {
    type: String,
    required: true
  },
  destinationAddress: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  orderer: {
    type: Object,
    required: true
  },
  receiver: {
    type: Object,
    required: true
  },
  assignee: {
    type: Object,
    required: true
  }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.setOrder = function (orderData, callback) {
  orderData
    .save(callback)
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getOrders = function (callback) {
  Order
    .find(callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getOrderById = function (id, callback) {
  Order
    .findById(id, callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getOrderByFilter = function (filter, callback) {
  Order
    .find(filter, callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.updateOrder = function (id, data, callback) {
  Order
    .update({ _id: id }, data)
    .exec(callback)
    .then(result => result)
    .catch(err => console.log(err));
}