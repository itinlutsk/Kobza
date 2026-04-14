const API_BASE = '/dotnet-api';

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

async function adminLogout() {
  try {
    await fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {}
  location.href = 'admin-login.html';
}

(async function () {
  const today = new Date().toISOString().split('T')[0];
  const views = parseInt(localStorage.getItem('skinz_views_' + today) || '0');
  document.getElementById('dashViews').textContent = views > 0 ? views : '—';

  try {
    const [cats, prods] = await Promise.all([
      fetch(API_BASE + '/api/categories', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch(API_BASE + '/api/products',   { credentials: 'include' }).then(r => r.ok ? r.json() : null),
    ]);

    if (cats) {
      document.getElementById('dashCategories').textContent = cats.length || '—';
      localStorage.setItem('skinz_admin_categories', JSON.stringify(cats));
    }
    if (prods) {
      const active = prods.filter(p => p.active).length;
      document.getElementById('dashProducts').textContent = active || '—';
      localStorage.setItem('skinz_admin_products', JSON.stringify(prods));
    }
  } catch {
    /* fallback to localStorage */
    try {
      const cats = JSON.parse(localStorage.getItem('skinz_admin_categories') || '[]');
      document.getElementById('dashCategories').textContent = cats.length || '—';
      const total = cats.reduce((s, c) => s + (c.count ?? 0), 0);
      document.getElementById('dashProducts').textContent = total || '—';
    } catch {}
  }
})();
