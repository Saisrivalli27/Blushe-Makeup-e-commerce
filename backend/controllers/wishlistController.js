const supabase = require('../config/supabase');

// @desc    Get user wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*, products(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'Product ID required' });

  try {
    // Check if already in wishlist
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Remove it
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return res.status(200).json({ message: 'Removed from wishlist', isWishlisted: false });
    } else {
      // Add it
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: req.user.id, product_id: productId });

      if (error) throw error;
      return res.status(200).json({ message: 'Added to wishlist', isWishlisted: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
