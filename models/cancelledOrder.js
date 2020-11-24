const mongoose = require('mongoose');

const CancelledOrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  reason: {
    type: String
  },
  fee: {
    type: Number
  }
});

const CancelledOrder = module.exports = mongoose.model('CancelledOrder', CancelledOrderSchema);

module.exports.saveCancelledOrder = function (orderData, callback) {
  orderData
    .save(callback)
  // .then(result => result)
  // .catch(err => console.log(err));
}

module.exports.getCancelledOrders = function (callback) {
  CancelledOrder
    .find(callback)
  // .then(result => result)
  // .catch(err => console.log(err));
}