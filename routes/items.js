const express = require("express");
const router = express.Router();
const passport = require('passport');


const Order = require('../models/order');

router.post('/set-order', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  let order = new Order({
    name: req.body.name,
    category: req.body.category,
    weightRange: req.body.weightRange,
    sourceAddress: req.body.sourceAddress,
    destinationAddress: req.body.destinationAddress,
    deliveryDate: req.body.deliveryDate,
    status: req.body.status,
    orderer: req.body.orderer,
    assignee: req.body.assignee
  });

  Order.setOrder(order, (err, Order) => {
    if (err) {
      res.json({
        success: false,
        msg: 'Failed to set order. Please try again.'
      });
    } else {
      res.json({
        success: true,
        msg: 'Order set successfully.'
      });
    }
  });
});

router.get('/order/:id', (req, res, next) => {
  let id = req.params.id;
  Order.getOrderDetail(id, (err, Order) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    }
    return res.json(Order);
  });
});

module.exports = router;