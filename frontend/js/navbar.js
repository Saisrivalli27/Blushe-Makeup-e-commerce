import { renderNavbar, renderFooter } from './components.js?v=3';
import { getCartCount, getWishlistCount, getCart, formatCurrency, removeFromCart, updateCartQuantity } from './utils.js?v=3';

export const initNavbar = () => {
  // Inject Navbar and Footer
  const body = document.body;
  
  // Create a wrapper for content if not exists, or just prepend/append
  const headerWrapper = document.createElement('div');
  headerWrapper.innerHTML = renderNavbar();
  body.insertBefore(headerWrapper, body.firstChild);
  
  const footerWrapper = document.createElement('div');
  footerWrapper.innerHTML = renderFooter();
  body.appendChild(footerWrapper);
  
  // Attach event listeners
  setupEvents();
  updateCounts();
  updateMiniCart();
};

const setupEvents = () => {
  // Announcement Close
  const annClose = document.querySelector('.close-announcement');
  if (annClose) {
    annClose.addEventListener('click', (e) => {
      e.target.closest('.announcement-bar').style.display = 'none';
    });
  }

  // Mobile Menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const closeMobile = document.querySelector('.close-mobile');

  const toggleMobileMenu = () => {
    mobileDrawer.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  };

  if(mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
  if(closeMobile) closeMobile.addEventListener('click', toggleMobileMenu);
  if(mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

  // Submenu Toggle
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const submenu = e.target.closest('.mobile-has-submenu').querySelector('.mobile-submenu');
      submenu.classList.toggle('open');
      const span = toggle.querySelector('span');
      if(span) span.textContent = submenu.classList.contains('open') ? '-' : '+';
    });
  });

  // Cart Drawer
  const cartToggles = document.querySelectorAll('.cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.querySelector('.close-cart');

  const toggleCartDrawer = () => {
    cartDrawer.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
  };

  cartToggles.forEach(btn => btn.addEventListener('click', toggleCartDrawer));
  if(closeCart) closeCart.addEventListener('click', toggleCartDrawer);
  if(cartOverlay) cartOverlay.addEventListener('click', toggleCartDrawer);

  // Search Drawer
  const searchToggles = document.querySelectorAll('.search-toggle');
  const searchDrawer = document.getElementById('search-drawer');
  const closeSearch = document.querySelector('.close-search');
  const searchInput = document.getElementById('search-input');

  const toggleSearch = () => {
    searchDrawer.classList.toggle('open');
    if (searchDrawer.classList.contains('open')) {
      setTimeout(() => searchInput.focus(), 300);
    }
  };

  searchToggles.forEach(btn => btn.addEventListener('click', toggleSearch));
  if(closeSearch) closeSearch.addEventListener('click', toggleSearch);
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // Scroll Behavior for Header
  let lastScroll = 0;
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
      header.classList.remove('scrolled-up');
      return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scrolled-down')) {
      header.classList.remove('scrolled-up');
      header.classList.add('scrolled-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scrolled-down')) {
      header.classList.remove('scrolled-down');
      header.classList.add('scrolled-up');
    }
    lastScroll = currentScroll;
  });

  // Listen for storage changes
  window.addEventListener('cartUpdated', () => {
    updateCounts();
    updateMiniCart();
  });
  window.addEventListener('wishlistUpdated', updateCounts);
  
  // Listen for storage events from other tabs
  window.addEventListener('storage', (e) => {
    if(e.key === 'blushe_cart') { window.dispatchEvent(new Event('cartUpdated')); }
    if(e.key === 'blushe_wishlist') { window.dispatchEvent(new Event('wishlistUpdated')); }
  });
};

const updateCounts = () => {
  const cartCount = document.getElementById('cart-count');
  const wishlistCount = document.getElementById('wishlist-count');
  
  if (cartCount) cartCount.textContent = getCartCount();
  if (wishlistCount) wishlistCount.textContent = getWishlistCount();
};

// Auth removed

const updateMiniCart = async () => {
  const container = document.getElementById('mini-cart-items');
  const subtotalEl = document.getElementById('mini-cart-subtotal');
  if (!container) return;

  const cart = await getCart();
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: var(--space-xl) 0;">
        <p>Your bag is empty.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top: var(--space-md);">Shop Now</a>
      </div>
    `;
    subtotalEl.textContent = '₹0';
    return;
  }

  let html = '';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    html += `
      <div class="mini-cart-item flex gap-md" style="margin-bottom: var(--space-md); padding-bottom: var(--space-md); border-bottom: 1px solid var(--color-border-light);">
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 100px; object-fit: cover;">
        <div style="flex:1;">
          <div class="flex justify-between">
            <a href="product-details.html?id=${item.id}" style="font-weight: 500; font-size: 0.95rem;">${item.name}</a>
            <button class="remove-item" data-id="${item.id}" data-shade="${item.shade}" style="background:none; border:none; cursor:pointer;">&times;</button>
          </div>
          ${item.shade ? `<p style="font-size: 0.8rem; color: var(--color-text-muted);">Shade: ${item.shade}</p>` : ''}
          <div class="flex justify-between items-center" style="margin-top: var(--space-sm);">
            <div class="qty-control flex items-center" style="border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
              <button class="qty-btn minus" data-id="${item.id}" data-shade="${item.shade}" style="padding: 2px 8px; background:none; border:none; cursor:pointer;">-</button>
              <span style="padding: 0 10px; font-size: 0.9rem;">${item.quantity}</span>
              <button class="qty-btn plus" data-id="${item.id}" data-shade="${item.shade}" style="padding: 2px 8px; background:none; border:none; cursor:pointer;">+</button>
            </div>
            <span style="font-weight: 500;">${formatCurrency(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  subtotalEl.textContent = formatCurrency(subtotal);

  // Attach listeners for remove and qty
  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const shade = e.target.dataset.shade === 'null' ? null : e.target.dataset.shade;
      removeFromCart(id, shade);
    });
  });

  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const shade = e.target.dataset.shade === 'null' ? null : e.target.dataset.shade;
      const isPlus = e.target.classList.contains('plus');
      const item = cart.find(i => i.id === id && i.shade == shade); // Loose equality on purpose for nulls
      if(item) {
        updateCartQuantity(id, shade, isPlus ? item.quantity + 1 : item.quantity - 1);
      }
    });
  });
};
