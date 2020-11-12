const express = require("express");
const router = express.Router();

const checkAuth = require('../config/check-auth');
const orderController = require('../controllers/orderController');

router.post('/item', checkAuth, orderController.addItem);

router.post('/', checkAuth, orderController.addOrder);

router.get('/', checkAuth, orderController.getOrders);

router.get('/:orderId', checkAuth, orderController.getOrderById);

// FIX: Try to solve with get request
router.post('/filter', checkAuth, orderController.getOrderByFilter);

router.patch('/:orderId', checkAuth, orderController.updateOrder);

router.post('/:orderId', checkAuth, orderController.cancelOrder);

router.get('/cacelledOrders', checkAuth, orderController.getCancelledOrders);

router.delete('/', orderController.deleteOrders);

router.delete('/:id', orderController.deleteOrderById);

module.exports = router;