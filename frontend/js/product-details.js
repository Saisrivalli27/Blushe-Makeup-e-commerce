import { getProductById, getProductsByCategory } from './data.js';
import { formatCurrency, addToCart, toggleWishlist, isInWishlist } from './utils.js';
import { renderProductCard } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  initProductDetails();
});

const initProductDetails = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    showError();
    return;
  }

  const product = await getProductById(productId);
  
  if (!product) {
    showError();
    return;
  }

  // Populate DOM
  document.getElementById('product-layout').style.display = 'grid';
  document.getElementById('breadcrumb-current').textContent = product.name;
  
  // Images
  document.getElementById('main-product-image').src = product.image;
  const thumbList = document.getElementById('thumbnail-list');
  const fallback = `onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'"`;
  let thumbsHTML = `<img src="${product.image}" class="thumbnail active img-cover" ${fallback}>`;
  if (product.hoverImage) {
    thumbsHTML += `<img src="${product.hoverImage}" class="thumbnail img-cover" ${fallback}>`;
  }
  thumbList.innerHTML = thumbsHTML;

  // Handle Thumbnail Clicks
  thumbList.querySelectorAll('.thumbnail').forEach(img => {
    img.addEventListener('click', (e) => {
      document.getElementById('main-product-image').src = e.target.src;
      thumbList.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Badge
  if (product.badge) {
    const badgeEl = document.getElementById('product-badge');
    badgeEl.textContent = product.badge;
    badgeEl.className = `badge ${product.badge.toLowerCase().replace(' ', '-')}`;
    badgeEl.style.display = 'inline-block';
  }

  // Details
  document.getElementById('product-brand').textContent = product.brand;
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-rating').textContent = product.rating;
  document.getElementById('product-reviews').textContent = product.reviews;
  document.getElementById('product-description').textContent = product.description;

  // Price
  const priceEl = document.getElementById('product-price');
  if (product.originalPrice) {
    priceEl.innerHTML = `<span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 1.25rem; margin-right: 10px;">${formatCurrency(product.originalPrice)}</span> <span style="color: var(--color-primary);">${formatCurrency(product.price)}</span>`;
  } else {
    priceEl.textContent = formatCurrency(product.price);
  }
  
  // Mobile Sticky Price
  document.getElementById('mobile-price').textContent = formatCurrency(product.price);

  // Shades
  let selectedShade = null;
  if (product.shades > 1) {
    document.getElementById('shade-picker-container').style.display = 'block';
    
    // Generate mock swatches
    const colors = [
      '#F4E5D8', '#E6C9B3', '#D6A582', '#B97C51', '#8E502B', '#5A2A18', // Foundations/Concealers
      '#ECA4A6', '#D97375', '#B54748', '#8A2D2F', // Blushes/Lips
      '#FFD700', '#F5F5DC', '#C0C0C0' // Highlighters
    ];
    
    let swatchesHTML = '';
    const numToRender = Math.min(product.shades, 10); // Render max 10 for demo
    
    for (let i=0; i<numToRender; i++) {
      const color = colors[i % colors.length];
      const shadeName = `Shade ${String(i+1).padStart(2, '0')}`;
      swatchesHTML += `<div class="swatch ${i===0 ? 'selected' : ''}" style="background-color: ${color};" data-shade="${shadeName}"></div>`;
      if (i===0) selectedShade = shadeName;
    }
    
    if(product.shades > 10) {
      swatchesHTML += `<div style="display:flex; align-items:center; font-size: 0.8rem; color: var(--color-text-muted);">+${product.shades - 10} more</div>`;
    }
    
    document.getElementById('shade-swatches').innerHTML = swatchesHTML;
    document.getElementById('selected-shade-name').textContent = selectedShade;

    // Swatch Interaction
    document.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', (e) => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedShade = e.target.dataset.shade;
        document.getElementById('selected-shade-name').textContent = selectedShade;
      });
    });
  }

  // Quantity
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus').addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    if(val > 1) qtyInput.value = val - 1;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    let val = parseInt(qtyInput.value);
    if(val < 10) qtyInput.value = val + 1;
  });

  // Wishlist State
  const wishlistBtn = document.getElementById('wishlist-action-btn');
  if (isInWishlist(product.id)) {
    wishlistBtn.classList.add('active');
  }
  wishlistBtn.addEventListener('click', async () => {
    const isNowActive = await toggleWishlist(product);
    wishlistBtn.classList.toggle('active', isNowActive);
  });

  // Add to Cart
  document.getElementById('add-to-cart-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const qty = parseInt(qtyInput.value);
    await addToCart(product, qty, selectedShade);
    
    // Open drawer
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    if(cartDrawer) cartDrawer.classList.add('open');
    if(cartOverlay) cartOverlay.classList.add('open');
  });

  // Mobile Sticky Add to Cart
  document.getElementById('mobile-add-btn').addEventListener('click', () => {
    document.getElementById('add-to-cart-form').dispatchEvent(new Event('submit'));
  });

  // Accordions
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.parentElement;
      accordion.classList.toggle('open');
    });
  });

  // Recommendations
  const relatedProducts = await getProductsByCategory(product.category);
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  if (filteredRelated.length > 0) {
    document.getElementById('recommendations-section').style.display = 'block';
    document.getElementById('recommendations-grid').innerHTML = filteredRelated.map(p => renderProductCard(p)).join('');
  }
};

const showError = () => {
  document.getElementById('product-error').style.display = 'block';
};
