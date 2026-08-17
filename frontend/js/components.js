import { formatCurrency, isInWishlist } from './utils.js';

export const renderProductCard = (product) => {
  const isWishlisted = isInWishlist(product.id);
  const badgeHTML = product.badge 
    ? `<span class="badge ${product.badge.toLowerCase().replace(' ', '-')} badge-absolute">${product.badge}</span>` 
    : '';
    
  const priceHTML = product.originalPrice 
    ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span> <span class="price-sale">${formatCurrency(product.price)}</span>`
    : `<span class="price-current">${formatCurrency(product.price)}</span>`;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrapper">
        ${badgeHTML}
        <a href="product-details.html?id=${product.id}">
          <img src="${product.image}" alt="" class="product-image main-img" onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'">
          ${product.hoverImage ? `<img src="${product.hoverImage}" alt="" class="product-image hover-img" onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'">` : ''}
        </a>
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Toggle Wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'var(--color-primary)' : 'none'}" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="quick-add-btn" data-id="${product.id}">Quick Add</button>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <a href="product-details.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-shades">${product.shades} ${product.shades === 1 ? 'Shade' : 'Shades'}</div>
        <div class="product-price">${priceHTML}</div>
        <div class="product-rating">
          <span class="star">★</span> ${product.rating} (${product.reviews})
        </div>
      </div>
    </div>
  `;
};

export const renderNavbar = () => {
  return `
    <!-- Announcement Bar -->
    <div class="announcement-bar" id="announcement-bar">
      <p>Complimentary shipping on orders above ₹1,999 — Shop now</p>
    </div>
    
    <header class="header">
      <!-- Main Brand Row -->
      <div class="container navbar-main">
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-btn icon-btn" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Left: Locale -->
        <div class="nav-locale">
          <span>India | English</span>
        </div>

        <!-- Center: Logo -->
        <a href="index.html" class="logo">BLUSHÉ</a>

        <!-- Right: Icons -->
        <div class="nav-actions">
          <button class="icon-btn search-toggle" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <a href="account.html" class="icon-btn profile-btn" aria-label="Account">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>
          
          <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="badge-count" id="wishlist-count">0</span>
          </a>
          
          <button class="icon-btn cart-toggle" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="badge-count" id="cart-count">0</span>
          </button>
        </div>
      </div>

      <!-- Navigation Row -->
      <nav class="desktop-nav-row">
        <div class="container">
          <ul class="nav-list" id="desktop-nav-list">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="products.html?badge=New" class="nav-link">New In</a></li>
            <li class="has-dropdown">
              <a href="products.html" class="nav-link">Makeup</a>
              <div class="mega-menu">
                <div class="container flex gap-xl justify-center">
                  <div class="menu-col">
                    <h4>Face</h4>
                    <a href="products.html?category=face&type=foundation">Foundation</a>
                    <a href="products.html?category=face&type=concealer">Concealer</a>
                    <a href="products.html?category=face&type=powder">Setting Powder</a>
                  </div>
                  <div class="menu-col">
                    <h4>Eyes</h4>
                    <a href="products.html?category=eyes&type=eyeshadow">Eyeshadow</a>
                    <a href="products.html?category=eyes&type=mascara">Mascara</a>
                  </div>
                  <div class="menu-col">
                    <h4>Lips</h4>
                    <a href="products.html?category=lips&type=lipstick">Lipstick</a>
                    <a href="products.html?category=lips&type=lipgloss">Lip Gloss</a>
                  </div>
                </div>
              </div>
            </li>
            <li><a href="products.html?category=face" class="nav-link">Face</a></li>
            <li><a href="products.html?category=eyes" class="nav-link">Eyes</a></li>
            <li><a href="products.html?category=lips" class="nav-link">Lips</a></li>
            <li><a href="products.html?category=brushes" class="nav-link">Brushes</a></li>
            <li><a href="products.html?category=collections" class="nav-link">Sets</a></li>
            <li><a href="products.html?badge=BestSeller" class="nav-link">Best Sellers</a></li>
            <li><a href="products.html?badge=Sale" class="nav-link text-primary">Sale</a></li>
            <li><a href="about.html" class="nav-link">Discover</a></li>
          </ul>
        </div>
      </nav>
      
      <!-- Expandable Search -->
      <div class="search-drawer" id="search-drawer">
        <div class="container flex items-center">
          <input type="text" id="search-input" placeholder="Search for products, shades..." autocomplete="off">
          <button class="close-search">&times;</button>
        </div>
      </div>
    </header>
    
    <!-- Mobile Menu Drawer -->
    <div class="mobile-drawer-overlay" id="mobile-overlay"></div>
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="mobile-drawer-header">
        <h3>Menu</h3>
        <button class="close-mobile">&times;</button>
      </div>
      <div class="mobile-drawer-content">
        <ul class="mobile-nav-list" id="mobile-nav-list">
          <li><a href="index.html">Home</a></li>
          <li><a href="products.html?badge=New">New In</a></li>
          <li class="mobile-has-submenu">
            <button class="submenu-toggle">Makeup <span>+</span></button>
            <ul class="mobile-submenu">
              <li><a href="products.html?category=face&type=foundation">Face</a></li>
              <li><a href="products.html?category=eyes">Eyes</a></li>
              <li><a href="products.html?category=lips">Lips</a></li>
            </ul>
          </li>
          <li><a href="products.html?category=face">Face</a></li>
          <li><a href="products.html?category=eyes">Eyes</a></li>
          <li><a href="products.html?category=lips">Lips</a></li>
          <li><a href="products.html?category=brushes">Brushes</a></li>
          <li><a href="products.html?category=collections">Sets</a></li>
          <li><a href="products.html?badge=BestSeller">Best Sellers</a></li>
          <li><a href="products.html?badge=Sale" class="text-primary">Sale</a></li>
          <li><a href="about.html">Discover</a></li>
        </ul>
      </div>
      </div>
    </div>
    
    <!-- Mini Cart Drawer -->
    <div class="cart-drawer-overlay" id="cart-overlay"></div>
    <div class="cart-drawer" id="cart-drawer">
      <div class="cart-drawer-header">
        <h3>Your Bag</h3>
        <button class="close-cart">&times;</button>
      </div>
      <div class="cart-drawer-content" id="mini-cart-items">
        <!-- Rendered by JS -->
      </div>
      <div class="cart-drawer-footer">
        <div class="cart-subtotal flex justify-between">
          <span>Subtotal</span>
          <span id="mini-cart-subtotal">₹0</span>
        </div>
        <p class="shipping-notice">Shipping and taxes calculated at checkout.</p>
        <a href="cart.html" class="btn btn-outline btn-block" style="margin-bottom: var(--space-sm);">View Bag</a>
        <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a>
      </div>
    </div>
  `;
};

export const renderFooter = () => {
  return `
    <footer class="footer">
      <div class="container">
        <div class="grid grid-cols-4 footer-grid">
          <div class="footer-col">
            <h3 class="footer-brand">BLUSHÉ</h3>
            <p>Premium beauty, curated for you. Elevate your everyday rituals with our high-performance cosmetics.</p>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><a href="products.html?category=face">Face</a></li>
              <li><a href="products.html?category=eyes">Eyes</a></li>
              <li><a href="products.html?category=lips">Lips</a></li>
              <li><a href="products.html?category=collections">Collections</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Help & Account</h4>
            <ul>
              <li><a href="wishlist.html">Wishlist</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">TikTok</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} BLUSHÉ. All rights reserved.</p>
          <div class="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `;
};
