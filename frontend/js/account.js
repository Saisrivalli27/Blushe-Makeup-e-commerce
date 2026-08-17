document.addEventListener('DOMContentLoaded', () => {
  initAccountPages();
});

const initAccountPages = async () => {
  // Sidebar Logout (mock)
  const sidebarLogout = document.getElementById('sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  // Profile Page
  const profileName = document.getElementById('profile-name');
  if (profileName) {
    profileName.textContent = 'Guest User';
    document.getElementById('profile-email').textContent = 'guest@blushe.com';
    document.getElementById('profile-avatar').textContent = 'G';
  }

  // Orders Page (empty mock)
  const ordersContainer = document.getElementById('orders-container');
  if (ordersContainer) {
    ordersContainer.innerHTML = `
      <div class="order-empty">
        <p>You haven't placed any orders yet.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top: var(--space-md);">Start Shopping</a>
      </div>
    `;
  }
};
