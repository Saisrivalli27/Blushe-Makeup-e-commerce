import { initNavbar } from './navbar.js?v=3';
import { getNewArrivals } from './data.js?v=3';
import { renderProductCard } from './components.js?v=3';
import { addToCart, toggleWishlist } from './utils.js?v=3';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Global UI (Navbar, Footer, Modals)
  initNavbar();

  // Set Active Nav Link
  setActiveNavLink();

  // 2. Page Specific Logic
  const pathname = window.location.pathname;

  // Home Page Logic
  if (pathname.endsWith('/') || pathname.endsWith('index.html')) {
    initHomePage();
  }

  // 3. Global Event Listeners for Product Interactions
  setupGlobalProductInteractions();
});

const initHomePage = async () => {
  const newArrivalsGrid = document.getElementById('new-arrivals-grid');
  if (newArrivalsGrid) {
    const newProducts = await getNewArrivals();
    newArrivalsGrid.innerHTML = newProducts.map(product => renderProductCard(product)).join('');
  }
};

const setActiveNavLink = () => {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-list a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    // Homepage logic
    if (linkHref === 'index.html') {
      if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        link.classList.add('active');
      }
      return;
    }

    // Other pages
    const [path, search] = linkHref.split('?');
    if (currentPath.includes(path)) {
      if (search) {
        // If the link has a query param, it must match the current URL's query param
        if (currentSearch.includes(search)) {
          link.classList.add('active');
        }
      } else {
        // If the link has NO query param, the current URL should ideally have NO query param (or be a generic parent)
        // For simplicity, we only mark it active if there's no query param, except for "Products" dropdowns
        if (!currentSearch || link.classList.contains('submenu-toggle')) {
          link.classList.add('active');
        }
      }
    }
  });
};

const setupGlobalProductInteractions = () => {
  document.body.addEventListener('click', async (e) => {
    // Handle Quick Add
    if (e.target.closest('.quick-add-btn')) {
      const btn = e.target.closest('.quick-add-btn');
      const productId = btn.dataset.id;
      const { getProductById } = await import('./data.js?v=3');
      const product = await getProductById(productId);
      if (product) {
        const defaultShade = product.shades > 1 ? "Standard Shade" : null;
        await addToCart(product, 1, defaultShade);
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if(cartDrawer) cartDrawer.classList.add('open');
        if(cartOverlay) cartOverlay.classList.add('open');
      }
    }

    // Handle Wishlist Toggle
    if (e.target.closest('.wishlist-btn')) {
      const btn = e.target.closest('.wishlist-btn');
      const productId = btn.dataset.id;
      const { getProductById } = await import('./data.js?v=3');
      const product = await getProductById(productId);
      if (product) {
        const isNowActive = await toggleWishlist(product);
        if (isNowActive) {
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', 'var(--color-primary)');
        } else {
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
        }
      }
    }
  });
};
