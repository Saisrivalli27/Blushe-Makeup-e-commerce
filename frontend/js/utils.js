/* =========================================
   BLUSHÉ - Utilities & API Integration
   ========================================= */

// Connected to live Render backend
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://blushe-makeup-e-commerce.onrender.com/api';

// Format currency (INR)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Cart Helpers (Local Storage) ---
const CART_KEY = 'blushe_cart';
let cachedCart;
try {
  cachedCart = JSON.parse(localStorage.getItem(CART_KEY));
  if (!Array.isArray(cachedCart)) throw new Error('Not an array');
} catch (e) {
  cachedCart = [];
  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));
}

const saveCart = () => {
  localStorage.setItem(CART_KEY, JSON.stringify(cachedCart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const fetchCart = async () => {
  try {
    cachedCart = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(cachedCart)) throw new Error('Not an array');
  } catch (e) {
    cachedCart = [];
  }
  return cachedCart;
};

export const getCart = async () => {
  return cachedCart;
};

export const addToCart = async (product, quantity = 1, shade = null) => {
  const existingItemIndex = cachedCart.findIndex(item => item.id == product.id && item.shade == shade);
  
  if (existingItemIndex > -1) {
    cachedCart[existingItemIndex].quantity += quantity;
  } else {
    cachedCart.push({
      id: product.id,
      cartItemId: Date.now() + Math.random().toString(), // unique id
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      quantity: quantity,
      shade: shade
    });
  }
  
  saveCart();
  showToast(`${product.name} added to your bag.`);
};

export const removeFromCart = async (productId, shade = null) => {
  cachedCart = cachedCart.filter(item => !(item.id == productId && item.shade == shade));
  saveCart();
};

export const updateCartQuantity = async (productId, shade, quantity) => {
  if (quantity < 1) return;
  const item = cachedCart.find(i => i.id == productId && i.shade == shade);
  if (item) {
    item.quantity = quantity;
    saveCart();
  }
};

export const getCartTotal = (cart = cachedCart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (cart = cachedCart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};


// --- Wishlist Helpers (Local Storage) ---
const WISHLIST_KEY = 'blushe_wishlist';
let cachedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

const saveWishlist = () => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(cachedWishlist));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

export const fetchWishlist = async () => {
  cachedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  return cachedWishlist;
};

export const getWishlist = async () => {
  return cachedWishlist;
};

export const toggleWishlist = async (product) => {
  const index = cachedWishlist.findIndex(item => item.id == product.id);
  let isWishlisted = false;
  
  if (index > -1) {
    cachedWishlist.splice(index, 1);
    showToast(`${product.name} removed from wishlist.`);
  } else {
    cachedWishlist.push({
      id: product.id,
      wishlistItemId: Date.now(),
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand
    });
    isWishlisted = true;
    showToast(`${product.name} added to wishlist.`);
  }
  
  saveWishlist();
  return isWishlisted;
};

export const isInWishlist = (productId) => {
  return cachedWishlist.some(item => item.id == productId);
};

export const getWishlistCount = () => {
  return cachedWishlist.length;
};


// --- API Helpers (Products Only) ---
export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
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
  
  // Initial dispatches for UI
  window.dispatchEvent(new Event('cartUpdated'));
  window.dispatchEvent(new Event('wishlistUpdated'));
});
