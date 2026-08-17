const supabase = require('../config/supabase');

// @desc    Get all products (with optional category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, badge } = req.query;
    let query = supabase.from('products').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (badge) {
      query = query.eq('badge', badge);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Supabase Product Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
