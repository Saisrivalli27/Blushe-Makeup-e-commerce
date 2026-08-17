import { getCart, removeFromCart, updateCartQuantity, formatCurrency, toggleWishlist, getCartTotal } from './utils.js?v=3';

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  window.addEventListener('cartUpdated', renderCartPage);
});

const renderCartPage = async () => {
  const container = document.getElementById('cart-items-container');
  const layout = document.getElementById('cart-layout');
  const emptyState = document.getElementById('cart-empty-state');
  const subtotalEl = document.getElementById('summary-subtotal');
  const totalEl = document.getElementById('summary-total');

  if (!container) return;

  const cart = await getCart();

  if (cart.length === 0) {
    layout.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  layout.style.display = 'grid';
  emptyState.style.display = 'none';

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <a href="product-details.html?id=${item.id}">
          <img src="${item.image}" alt="" class="cart-item-image" onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'">
        </a>
        <div class="cart-item-info">
          <div class="cart-item-brand">${item.brand}</div>
          <a href="product-details.html?id=${item.id}" class="cart-item-name">${item.name}</a>
          ${item.shade ? `<div class="cart-item-shade">Shade: ${item.shade}</div>` : ''}
          <div class="cart-item-price" style="color: var(--color-text-muted);">${formatCurrency(item.price)}</div>
          
          <div class="cart-item-actions">
            <button class="cart-remove-btn" data-id="${item.id}" data-shade="${item.shade}">Remove</button>
            <button class="cart-wishlist-btn" data-id="${item.id}">Move to Wishlist</button>
          </div>
        </div>
        
        <div class="cart-item-qty">
          <button class="qty-btn minus" data-id="${item.id}" data-shade="${item.shade}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.id}" data-shade="${item.shade}">+</button>
        </div>
        
        <div class="cart-item-total">
          ${formatCurrency(item.price * item.quantity)}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Update Summary
  const total = getCartTotal();
  subtotalEl.textContent = formatCurrency(total);
  totalEl.textContent = formatCurrency(total);

  attachCartEvents(cart);
};

const attachCartEvents = (cart) => {
  const container = document.getElementById('cart-items-container');

  // Remove
  container.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      // In the API, cart items are removed by cartItemId, not productId+shade.
      // We mapped cartItemId when fetching the cart in utils.js
      const item = cart.find(i => i.id === id);
      if (item && item.cartItemId) {
        await removeFromCart(item.cartItemId);
      }
    });
  });

  // Move to Wishlist
  container.querySelectorAll('.cart-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      
      const { getProductById } = await import('./data.js?v=3');
      const product = await getProductById(id);
      if(product) {
        const u = await import('./utils.js?v=3');
        if(!u.isInWishlist(id)) {
          await u.toggleWishlist(product);
        }
        const item = cart.find(i => i.id === id);
        if (item && item.cartItemId) {
          await u.removeFromCart(item.cartItemId);
        }
      }
    });
  });

  // Quantity
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const isPlus = e.target.classList.contains('plus');
      const item = cart.find(i => i.id === id);
      if(item && item.cartItemId) {
        await updateCartQuantity(item.cartItemId, isPlus ? item.quantity + 1 : item.quantity - 1);
      }
    });
  });
};
