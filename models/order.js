const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  item: {
    type: mongoose.Schema.Types.Object,
    ref: 'Item',
    required: true
  },
  sourceAddress: {
    type: Object,
    required: true
  },
  destinationAddress: {
    type: Object,
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
  },
  shippingFee: {
    type: Number,
    require: true
  }
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.setOrder = function (orderData, callback) {
  orderData
    .save(callback);
}

module.exports.getOrders = function (callback) {
  Order
    .find(callback)
    .sort({ "created_at": -1 })
    .exec();
}

module.exports.getOrderById = function (id, callback) {
  Order
    .findById(id, callback)
    .exec();
}

module.exports.getOrderByFilter = function (filter, callback) {
  Order
    .find(filter, callback)
    .sort({ "created_at": -1 })
    .exec();
}

module.exports.updateOrder = function (id, data, callback) {
  Order
    .findOneAndUpdate({ _id: id }, data)
    .exec(callback);
}

module.exports.deleteById = function (id, callback) {
  Order
    .findOneAndDelete({ _id: id })
    .exec(callback)
}