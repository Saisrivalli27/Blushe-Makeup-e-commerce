const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken); // All wishlist routes require auth

router.route('/')
  .get(getWishlist)
  .post(toggleWishlist);

module.exports = router;
