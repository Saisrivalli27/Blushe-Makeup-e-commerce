import { getWishlist, toggleWishlist, addToCart } from './utils.js';
import { renderProductCard } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  renderWishlistPage();
  window.addEventListener('wishlistUpdated', renderWishlistPage);
});

const renderWishlistPage = async () => {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');

  if (!container) return;

  const wishlist = await getWishlist();

  if (wishlist.length === 0) {
    container.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  container.style.display = 'grid';
  emptyState.style.display = 'none';

  container.innerHTML = wishlist.map(product => renderProductCard(product)).join('');
  attachWishlistEvents();
};

const attachWishlistEvents = () => {
  const container = document.getElementById('wishlist-grid');

  // Handle Quick Add to Cart
  container.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = e.target.dataset.id;
      const { getProductById } = await import('./data.js');
      const product = await getProductById(productId);
      if (product) {
        const defaultShade = product.shades > 1 ? "Standard Shade" : null;
        await addToCart(product, 1, defaultShade);
        // Optional: Remove from wishlist after adding to cart
        await toggleWishlist(product);
        
        // Open mini-cart automatically
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if(cartDrawer) cartDrawer.classList.add('open');
        if(cartOverlay) cartOverlay.classList.add('open');
      }
    });
  });

  // Handle Wishlist Toggle (Remove from wishlist)
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = e.target.closest('.wishlist-btn').dataset.id;
      const { getProductById } = await import('./data.js');
      const product = await getProductById(productId);
      if (product) {
        await toggleWishlist(product);
      }
    });
  });
};
