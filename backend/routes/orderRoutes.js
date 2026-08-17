const express = require('express');
const router = express.Router();
const { getOrders, placeOrder } = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken); // All order routes require auth

router.route('/')
  .get(getOrders)
  .post(placeOrder);

module.exports = router;
