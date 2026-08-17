/* =========================================
   BLUSHÉ - Utilities & API Integration
   ========================================= */

// Connected to live Render backend
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://blushe-makeup-e-commerce.onrender.com/api';
const AUTH_KEY = 'blushe_token';
const USER_KEY = 'blushe_user';

// Format currency (INR)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Auth Helpers ---
export const getToken = () => localStorage.getItem(AUTH_KEY);
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    localStorage.setItem(AUTH_KEY, data.session.access_token);
    const userData = {
      id: data.user.id,
      name: data.user.user_metadata.full_name || email.split('@')[0],
      email: data.user.email
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event('authUpdated'));
    return true;
  } catch (err) {
    showToast(err.message);
    return false;
  }
};

export const registerUser = async (fullName, email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    localStorage.setItem(AUTH_KEY, data.session.access_token);
    const userData = {
      id: data.user.id,
      name: data.user.user_metadata.full_name,
      email: data.user.email
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event('authUpdated'));
    return true;
  } catch (err) {
    showToast(err.message);
    return false;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
  cachedCart = [];
  cachedWishlist = [];
  window.dispatchEvent(new Event('authUpdated'));
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

// --- Cart Helpers ---
const CART_KEY = 'blushe_cart';
let cachedCart = [];

export const fetchCart = async () => {
  if (!getToken()) {
    cachedCart = [];
    return cachedCart;
  }
  try {
    const data = await apiFetch('/cart');
    cachedCart = data.map(item => ({
      id: item.product_id,
      cartItemId: item.id,
      name: item.products.name,
      price: item.products.price,
      image: item.products.image,
      brand: item.products.brand,
      quantity: item.quantity,
      shade: null
    }));
  } catch (e) {
    cachedCart = [];
  }
  return cachedCart;
};

export const getCart = async () => {
  return await fetchCart();
};

export const addToCart = async (product, quantity = 1, shade = null) => {
  if (!getToken()) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id, quantity })
    });
    await fetchCart();
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`${product.name} added to your bag.`);
  } catch (e) {
    showToast('Failed to add to cart.');
  }
};

export const removeFromCart = async (productId, shade = null) => {
  if (!getToken()) return;
  const item = cachedCart.find(i => i.id == productId);
  if (!item) return;
  try {
    await apiFetch(`/cart/${item.cartItemId}`, { method: 'DELETE' });
    await fetchCart();
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {
    showToast('Failed to remove from cart.');
  }
};

export const updateCartQuantity = async (productId, shade, quantity) => {
  if (!getToken() || quantity < 1) return;
  const item = cachedCart.find(i => i.id == productId);
  if (!item) return;
  try {
    await apiFetch(`/cart/${item.cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    await fetchCart();
    window.dispatchEvent(new Event('cartUpdated'));
  } catch(e) {
    showToast('Failed to update quantity.');
  }
};

export const getCartTotal = (cart = cachedCart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (cart = cachedCart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// --- Wishlist Helpers ---
const WISHLIST_KEY = 'blushe_wishlist';
let cachedWishlist = [];

export const fetchWishlist = async () => {
  if (!getToken()) {
    cachedWishlist = [];
    return cachedWishlist;
  }
  try {
    const data = await apiFetch('/wishlist');
    cachedWishlist = data.map(item => ({
      id: item.product_id,
      wishlistItemId: item.id,
      name: item.products.name,
      price: item.products.price,
      image: item.products.image,
      brand: item.products.brand
    }));
  } catch (e) {
    cachedWishlist = [];
  }
  return cachedWishlist;
};

export const getWishlist = async () => {
  return await fetchWishlist();
};

export const toggleWishlist = async (product) => {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  try {
    const data = await apiFetch('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id })
    });
    await fetchWishlist();
    window.dispatchEvent(new Event('wishlistUpdated'));
    showToast(data.message);
    return data.isWishlisted;
  } catch (e) {
    showToast('Failed to update wishlist.');
    return false;
  }
};

export const isInWishlist = (productId) => {
  return cachedWishlist.some(item => item.id == productId); // use loose equality just in case of string/int mismatch
};

export const getWishlistCount = () => {
  return cachedWishlist.length;
};

// --- API Helpers ---
export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options.headers }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'API Request failed');
  }
  return res.json();
};

// --- UI Helpers ---
export const showToast = (message) => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="flex:1;">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (container.contains(toast)) container.removeChild(toast);
    }, 250);
  }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('toast-container')) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  // Initial fetches
  fetchCart().then(() => window.dispatchEvent(new Event('cartUpdated')));
  fetchWishlist().then(() => window.dispatchEvent(new Event('wishlistUpdated')));
});
