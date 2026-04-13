function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

(function () {
  const STORAGE_KEY = 'skinz_admin_categories';
  const today = new Date().toISOString().split('T')[0];
  const views = parseInt(localStorage.getItem('skinz_views_' + today) || '0');
  document.getElementById('dashViews').textContent = views > 0 ? views : '—';

  try {
    const cats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    document.getElementById('dashCategories').textContent = cats.length || '—';
    const total = cats.reduce((s, c) => s + (c.count ?? 0), 0);
    document.getElementById('dashProducts').textContent = total || '—';
  } catch (e) {}
})();