import { getUser, loginUser, logoutUser, formatCurrency } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const pathname = window.location.pathname;

  // Protect Account Routes
  if (pathname.includes('account.html') || pathname.includes('orders.html')) {
    if (!getUser()) {
      window.location.href = 'login.html';
      return;
    }
  }

  // Redirect if logged in
  if (pathname.includes('login.html') || pathname.includes('register.html')) {
    if (getUser()) {
      window.location.href = 'account.html';
      return;
    }
  }

  initAuthForms();
  initAccountPages();
});

const initAuthForms = () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      
      if (email && pass) {
        const success = await loginUser(email, pass);
        if (success) {
          window.location.href = 'index.html';
        }
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fname = document.getElementById('reg-fname').value;
      const lname = document.getElementById('reg-lname').value;
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      
      if (email && pass) {
        const { registerUser } = await import('./utils.js');
        const success = await registerUser(`${fname} ${lname}`, email, pass);
        if (success) {
          window.location.href = 'index.html';
        }
      }
    });
  }
};

const initAccountPages = async () => {
  const user = getUser();
  if (!user) return;

  // Sidebar Logout
  const sidebarLogout = document.getElementById('sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      window.location.href = 'login.html';
    });
  }

  // Profile Page
  const profileName = document.getElementById('profile-name');
  if (profileName) {
    profileName.textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
  }

  // Orders Page
  const ordersContainer = document.getElementById('orders-container');
  if (ordersContainer) {
    try {
      const { apiFetch } = await import('./utils.js');
      const orders = await apiFetch('/orders');
      
      if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="order-empty">
            <p>You haven't placed any orders yet.</p>
            <a href="products.html" class="btn btn-primary" style="margin-top: var(--space-md);">Start Shopping</a>
          </div>
        `;
        return;
      }

      let html = '';
      orders.forEach(order => {
        const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let itemsHtml = '';
        order.order_items.forEach(item => {
          itemsHtml += `
            <div class="order-item-row">
              <img src="${item.products?.image}" alt="" class="order-item-img" onerror="this.onerror=null; this.classList.add('img-error'); this.src='https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&h=750&fit=crop&q=80'">
              <div>
                <div style="font-weight: 500;">${item.products?.name}</div>
                <div style="font-size: 0.85rem; color: var(--color-text-muted);">
                  Qty: ${item.quantity}
                </div>
              </div>
            </div>
          `;
        });

        html += `
          <div class="order-card">
            <div class="order-header">
              <div class="flex gap-lg">
                <div class="order-header-info">
                  <span>Order Placed</span>
                  <strong>${dateStr}</strong>
                </div>
                <div class="order-header-info">
                  <span>Total</span>
                  <strong>${formatCurrency(order.total_amount)}</strong>
                </div>
              </div>
              <div class="order-header-info" style="text-align: right;">
                <span>Order #</span>
                <strong>${order.id.slice(0,8)}</strong>
              </div>
            </div>
            <div class="order-items">
              ${itemsHtml}
              <div style="margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--color-border-light);">
                <span class="badge" style="background-color: var(--color-background);">${order.status}</span>
              </div>
            </div>
          </div>
        `;
      });

      ordersContainer.innerHTML = html;
    } catch(err) {
      console.error(err);
      ordersContainer.innerHTML = '<p>Error fetching orders.</p>';
    }
  }
};
