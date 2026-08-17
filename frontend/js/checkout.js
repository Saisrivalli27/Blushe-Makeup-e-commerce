import { getCart, getCartTotal, formatCurrency } from './utils.js?v=2';

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  setupCheckoutFlow();
});

const renderCheckoutSummary = async () => {
  const cart = await getCart();
  const container = document.getElementById('checkout-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="checkout-item">
        <div class="checkout-item-img">
          <img src="${item.image}" alt="" onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'">
          <span class="checkout-item-qty">${item.quantity}</span>
        </div>
        <div class="checkout-item-info">
          <h4>${item.name}</h4>
        </div>
        <div class="checkout-item-price">
          ${formatCurrency(item.price * item.quantity)}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  
  const total = getCartTotal(cart);
  subtotalEl.textContent = formatCurrency(total);
  totalEl.textContent = formatCurrency(total);
};

const setupCheckoutFlow = () => {
  const placeOrderBtn = document.getElementById('place-order-btn');
  const modal = document.getElementById('success-modal');
  const orderNumberDisplay = document.getElementById('order-number-display');

  // Payment method toggle logic is handled by CSS (radio:checked ~ details)
  
  placeOrderBtn.addEventListener('click', async () => {
    // Basic mock validation
    const requiredInputs = document.querySelectorAll('.checkout-forms input[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = 'var(--color-border)';
      }
    });

    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Mock successful order placement without backend
      const mockOrderId = Math.floor(Math.random() * 100000000).toString();
      orderNumberDisplay.textContent = mockOrderId;
      
      // Clear Cart from Local Storage since we removed backend
      localStorage.removeItem('blushe_cart');
      const u = await import('./utils.js?v=2');
      await u.fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));

      modal.classList.add('open');
    } catch (e) {
      alert(e.message || "Failed to place order.");
    }
  });
};
