import { fetchAllProducts, getProductById } from './data.js';
import { renderProductCard } from './components.js';
import { addToCart } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initCatalog();
});

const initCatalog = async () => {
  const products = await fetchAllProducts();
  
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  const initialType = urlParams.get('type');
  const initialBadge = urlParams.get('badge');
  const initialQuery = urlParams.get('q');

  const state = {
    filters: {
      categories: initialCategory ? [initialCategory] : [],
      types: initialType ? [initialType] : [],
      price: 'all',
      badge: initialBadge || null,
      query: initialQuery ? initialQuery.toLowerCase() : null
    },
    sort: 'featured' // 'newest', 'price-low', 'price-high', 'rating'
  };

  // Sync checkboxes with initial URL state
  if(initialCategory) {
    const cb = document.querySelector(`input[value="${initialCategory}"]`);
    if(cb) cb.checked = true;
  }
  if(initialType) {
    const cb = document.querySelector(`input[value="${initialType}"]`);
    if(cb) cb.checked = true;
  }

  // Update Page Title and Banner based on filters
  const updateHeader = () => {
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const pageHeader = document.querySelector('.page-header');
    
    // Default banner images per category
    const banners = {
      face: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&q=80',
      eyes: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&q=80',
      lips: 'https://images.unsplash.com/photo-1586444855520-22c6085a6a26?w=1600&q=80',
      brushes: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1600&q=80',
      collections: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1600&q=80',
      default: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1600&q=80'
    };

    let title = 'Shop All';
    let bannerImg = banners.default;

    if (state.filters.categories.length === 1) {
      const cat = state.filters.categories[0];
      title = cat.charAt(0).toUpperCase() + cat.slice(1);
      bannerImg = banners[cat] || banners.default;
    } else if (state.filters.badge) {
      title = state.filters.badge;
    } else if (state.filters.query) {
      title = `Search: "${state.filters.query}"`;
    }

    pageTitle.textContent = title;
    pageHeader.style.backgroundImage = `url('${bannerImg}')`;
    pageHeader.classList.add('has-banner');
  };

  const render = () => {
    updateHeader();
    let filtered = [...products];

    // Apply Search Query
    if (state.filters.query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(state.filters.query) || 
        p.category.toLowerCase().includes(state.filters.query)
      );
    }

    // Apply Category Filter
    if (state.filters.categories.length > 0) {
      filtered = filtered.filter(p => state.filters.categories.includes(p.category));
    }

    // Apply Type Filter
    if (state.filters.types.length > 0) {
      filtered = filtered.filter(p => state.filters.types.includes(p.type));
    }

    // Apply Badge Filter (used via URL primarily)
    if (state.filters.badge) {
      filtered = filtered.filter(p => p.badge === state.filters.badge);
    }

    // Apply Price Filter
    if (state.filters.price !== 'all') {
      const [min, max] = state.filters.price.split('-').map(Number);
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    // Apply Sorting
    switch (state.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Mock newest by checking if it has 'New' badge
        filtered.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
        break;
      default: // featured
        break;
    }

    // Render Grid
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    const countEl = document.getElementById('results-count');

    countEl.textContent = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
      attachModalListeners();
    }

    renderActiveFilters();
  };

  const attachModalListeners = () => {
    const productLinks = document.querySelectorAll('.product-image-wrapper a, .product-name');
    productLinks.forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = new URL(link.href);
        const productId = parseInt(url.searchParams.get('id'));
        if (productId) {
          openModal(productId);
        }
      });
    });
  };

  let currentModalProductId = null;

  const openModal = async (id) => {
    const product = await getProductById(id);
    if (!product) return;

    currentModalProductId = product.id; // Store current product ID

    document.getElementById('modal-image').src = product.image_url || product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `₹${product.price.toLocaleString('en-IN')}`;
    document.getElementById('modal-desc').textContent = product.description;
    
    const ratingStr = `
      <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
      <span style="margin-left: 5px;">(${product.reviews_count || 0})</span>
    `;
    document.getElementById('modal-rating').innerHTML = ratingStr;

    document.getElementById('product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    document.getElementById('product-modal').classList.remove('active');
    document.body.style.overflow = '';
    currentModalProductId = null;
  };

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
      closeModal();
    }
  });

  document.getElementById('modal-add-btn').addEventListener('click', async () => {
    if (currentModalProductId) {
      const product = await getProductById(currentModalProductId);
      if (product) {
        await addToCart(product, 1);
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartDrawer) cartDrawer.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('open');
        closeModal();
      }
    }
  });

  const renderActiveFilters = () => {
    const container = document.getElementById('active-filters');
    let html = '';

    state.filters.categories.forEach(cat => {
      html += `<div class="filter-chip">${cat} <button data-type="category" data-val="${cat}">&times;</button></div>`;
    });
    state.filters.types.forEach(type => {
      html += `<div class="filter-chip">${type} <button data-type="type" data-val="${type}">&times;</button></div>`;
    });
    if (state.filters.price !== 'all') {
      html += `<div class="filter-chip">Price: ${state.filters.price} <button data-type="price">&times;</button></div>`;
    }

    container.innerHTML = html;

    // Attach chip remove events
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const val = e.target.dataset.val;

        if (type === 'category') {
          state.filters.categories = state.filters.categories.filter(c => c !== val);
          const cb = document.querySelector(`input[value="${val}"]`);
          if(cb) cb.checked = false;
        } else if (type === 'type') {
          state.filters.types = state.filters.types.filter(t => t !== val);
          const cb = document.querySelector(`input[value="${val}"]`);
          if(cb) cb.checked = false;
        } else if (type === 'price') {
          state.filters.price = 'all';
          document.querySelector('input[value="all"]').checked = true;
        }
        render();
      });
    });
  };

  // Event Listeners for Sidebar
  document.getElementById('filter-category').addEventListener('change', (e) => {
    const val = e.target.value;
    if (e.target.checked) state.filters.categories.push(val);
    else state.filters.categories = state.filters.categories.filter(c => c !== val);
    render();
  });

  document.getElementById('filter-type').addEventListener('change', (e) => {
    const val = e.target.value;
    if (e.target.checked) state.filters.types.push(val);
    else state.filters.types = state.filters.types.filter(t => t !== val);
    render();
  });

  document.getElementById('filter-price').addEventListener('change', (e) => {
    state.filters.price = e.target.value;
    render();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });

  const clearFilters = () => {
    state.filters.categories = [];
    state.filters.types = [];
    state.filters.price = 'all';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelector('input[value="all"]').checked = true;
    render();
  };

  document.getElementById('clear-filters').addEventListener('click', clearFilters);
  document.getElementById('reset-empty-filters').addEventListener('click', clearFilters);

  // Mobile Filter Drawer
  const mobileBtn = document.getElementById('mobile-filter-btn');
  const closeBtn = document.getElementById('close-filters');
  const sidebar = document.getElementById('sidebar-filters');

  const toggleSidebar = () => {
    sidebar.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  };

  mobileBtn.addEventListener('click', toggleSidebar);
  closeBtn.addEventListener('click', toggleSidebar);

  // Initial Render
  render();
};
