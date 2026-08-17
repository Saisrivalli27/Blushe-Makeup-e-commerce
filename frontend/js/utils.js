/* =========================================
   BLUSHÉ - Utilities & API Integration
   ========================================= */

// TODO: Replace 'https://your-backend-app.onrender.com/api' with your actual Render URL before deploying to Vercel
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://your-backend-app.onrender.com/api';
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
  window.dispatchEvent(new Event('authUpdated'));
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

// --- Cart Helpers ---
const CART_KEY = 'blushe_cart';
let cachedCart = [];

export const fetchCart = async () => {
  try {
    const local = localStorage.getItem(CART_KEY);
    cachedCart = local ? JSON.parse(local) : [];
  } catch (e) {
    cachedCart = [];
  }
  return cachedCart;
};

export const getCart = async () => {
  return await fetchCart();
};

export const addToCart = async (product, quantity = 1, shade = null) => {
  await fetchCart();
  const existing = cachedCart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cachedCart.push({
      id: product.id,
      cartItemId: Date.now() + Math.random(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: quantity,
      shade: shade
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));
  window.dispatchEvent(new Event('cartUpdated'));
  showToast(`${product.name} added to your bag.`);
};

export const removeFromCart = async (productId, shade = null) => {
  await fetchCart();
  // Filter out the item matching both ID and shade. Loose equality for ID just in case.
  cachedCart = cachedCart.filter(item => !(item.id == productId && item.shade == shade));
  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const updateCartQuantity = async (productId, shade, quantity) => {
  if (quantity < 1) return;
  await fetchCart();
  const item = cachedCart.find(item => item.id == productId && item.shade == shade);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));
    window.dispatchEvent(new Event('cartUpdated'));
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
  try {
    const local = localStorage.getItem(WISHLIST_KEY);
    cachedWishlist = local ? JSON.parse(local) : [];
  } catch (e) {
    cachedWishlist = [];
  }
  return cachedWishlist;
};

export const getWishlist = async () => {
  return await fetchWishlist();
};

export const toggleWishlist = async (product) => {
  await fetchWishlist();
  const index = cachedWishlist.findIndex(item => item.id === product.id);
  let isWishlisted = false;
  if (index >= 0) {
    cachedWishlist.splice(index, 1);
    showToast(`${product.name} removed from wishlist`);
  } else {
    cachedWishlist.push({
      id: product.id,
      wishlistItemId: Date.now() + Math.random(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand
    });
    isWishlisted = true;
    showToast(`${product.name} added to wishlist`);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(cachedWishlist));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return isWishlisted;
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
