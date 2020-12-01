const mongoose = require('mongoose');

const Order = require('../models/order');
const Item = require('../models/item');
const CancelledOrder = require('../models/cancelledOrder');

const ORDER_STATUS_PENDING = "PENDING";
const RETRY_MESSAGE = " Please try again.";

exports.addOrder = (req, res, next) => {
  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.item.name,
    category: req.body.item.category,
    weightRange: req.body.item.weightRange,
    quantity: req.body.item.quantity,
  });
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    item: item,
    sourceAddress: req.body.sourceAddress,
    destinationAddress: req.body.destinationAddress,
    deliveryDate: req.body.deliveryDate,
    status: ORDER_STATUS_PENDING,
    orderer: req.body.orderer,
    receiver: req.body.receiver,
    assignee: {},
  });

  Order.setOrder(order, (err, Order) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to set order.' + RETRY_MESSAGE
      });
    } else {
      res.json({
        success: true,
        message: 'Order set successfully.',
        order: Order
      });
    }
  });
}

exports.getOrders = async (req, res, next) => {
  Order.getOrders((err, Order) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to retrieve orders." + RETRY_MESSAGE
      });
    }
    return res.json(Order);
  });
}

exports.getOrderById = async (req, res, next) => {
  const id = req.params.orderId;
  Order.getOrderById(id, (err, Order) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Can not get the order." + RETRY_MESSAGE
      });
    }
    return res.json(Order);
  });
}

exports.getOrderByFilter = async (req, res, next) => {
  const filter = req.body;
  Order.getOrderByFilter(filter, (err, Order) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Can not get the order." + RETRY_MESSAGE
      });
    }
    return res.json(Order);
  });
}

exports.updateOrder = (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  let data = { $set: updateOps };
  Order.updateOrder(id, data, (err, order) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to save response." + RETRY_MESSAGE
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order detail updated",
      order: order
    });
  });
}

exports.deleteOrders = async (req, res, next) => {
  Order
    .remove()
    .exec()
    .then(result => {
      res.status(200).json({
        message: "All Orders are deleted",
      });
    });
}

exports.deleteOrderById = async (req, res, next) => {
  const id = req.params.id;
  Order
    .remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
      });
    });
}

exports.cancelOrder = (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  const reason = updateOps.cancellationReason;
  const fee = updateOps.cancellationFee;

  let cancelledOrder = {};
  Order.getOrderById(id, (err, order) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Can not get the order." + RETRY_MESSAGE
      });
    }

    cancelledOrder = new CancelledOrder({
      _id: new mongoose.Types.ObjectId(),
      order: order,
      reason: reason,
      fee: fee
    });

    CancelledOrder.saveCancelledOrder(cancelledOrder, (err, CancelledOrder) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: "Failed to cancel order"
        });
      }
      let data = { $set: { status: updateOps.status } };

      Order.updateOrder(id, data, (err, Order) => {
        if (err) {
          res.status(404).json({
            success: false,
            message: "Failed to save response." + RETRY_MESSAGE
          });
        }
        return res.status(200).json({
          success: true,
          message: "Order cancelled",
          order: cancelledOrder
        });
      });
    });
  });
}


exports.getCancelledOrders = (req, res, next) => {
  CancelledOrder.getCancelledOrders((err, CancelledOrder) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: "Failed to retrieve orders." + RETRY_MESSAGE
      });
    }
    return res.json(CancelledOrder);
  });
}
