const supabase = require('../config/supabase');

// @desc    Get user orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// @desc    Place a new order
// @route   POST /api/orders
const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    // 1. Get user cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', req.user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.products.price * item.quantity);
    }, 0);

    // 3. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        status: 'processing'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    const orderItemsData = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 5. Clear Cart
    await supabase.from('cart_items').delete().eq('user_id', req.user.id);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
};

module.exports = {
  getOrders,
  placeOrder
};
