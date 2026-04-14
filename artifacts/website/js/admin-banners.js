const LS_KEY_BANNERS = 'skinz_banners';
const API_BASE = '/dotnet-api';

const SECTIONS = [
  { label: '🌸 Весна', keys: ['spring-01','spring-02','spring-03','spring-04','spring-05'] },
  { label: '☀️ Літо',  keys: ['summer-01','summer-02','summer-03','summer-04','summer-05'] },
  { label: '🍂 Осінь', keys: ['autumn-01','autumn-02','autumn-03','autumn-04','autumn-05'] },
  { label: '❄️ Зима',  keys: ['winter-01','winter-02','winter-03','winter-04','winter-05'] },
];

const ORIG = {};
SECTIONS.forEach(s => s.keys.forEach(k => { ORIG[k] = `../images/slider/${k}.png`; }));

let overrides = {};    // key → URL  (from API or localStorage)
let useApi    = false;

/* ─── API helpers ─── */
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...opts });
    if (res.status === 401) { location.href = 'admin-login.html'; return null; }
    if (res.status === 204) return {};
    return res.ok ? res.json() : null;
  } catch { return null; }
}

/* ─── Init ─── */
async function init() {
  const authCheck = await apiFetch('/api/auth/me');
  useApi = !!authCheck;

  if (useApi) {
    const apiOverrides = await apiFetch('/api/upload/slider');
    overrides = apiOverrides || {};
  } else {
    try { overrides = JSON.parse(localStorage.getItem(LS_KEY_BANNERS) || '{}'); }
    catch { overrides = {}; }
  }

  buildSections();
  updateStats();
}

/* ─── Build HTML ─── */
function buildSections() {
  const container = document.getElementById('sectionsContainer');
  container.innerHTML = SECTIONS.map(sec => `
    <div class="admin-section-card" style="margin-bottom:1.25rem">
      <div class="admin-section-card__header">
        <div class="admin-section-card__title">${sec.label} — ${sec.keys.length} фото</div>
      </div>
      <div class="admin-section-card__body">
        <div class="banner-grid">
          ${sec.keys.map(key => bannerCardHTML(key)).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function bannerCardHTML(key) {
  const src     = overrides[key] || ORIG[key];
  const changed = !!overrides[key];
  return `
    <div class="banner-card" id="card-${key}">
      <div class="banner-img-wrap">
        <img src="${src}" id="img-${key}" alt="${key}"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22><rect width=%2216%22 height=%229%22 fill=%22%23eee%22/></svg>'"/>
        <div class="banner-overlay">
          <label class="banner-change-btn">
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onchange="changeBanner('${key}', this)"/>
            <i class="bi bi-arrow-repeat"></i> Замінити фото
          </label>
        </div>
      </div>
      <div class="banner-footer">
        <span class="banner-footer-name">${key}</span>
        <span class="banner-changed-badge" id="badge-${key}" style="display:${changed ? 'inline-flex' : 'none'}">
          <i class="bi bi-pencil-fill" style="font-size:.55rem"></i> змінено
        </span>
        <button class="banner-reset-btn" id="reset-${key}" title="Відновити оригінал"
          onclick="resetBanner('${key}')" style="display:${changed ? 'inline-flex' : 'none'}">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    </div>
  `;
}

/* ─── Change banner ─── */
async function changeBanner(key, input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Файл завеликий (макс. 5 МБ)', 'error'); return; }

  if (useApi) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/upload/slider/${encodeURIComponent(key)}`, {
        method: 'POST',
        credentials: 'include',
        body: fd
      });
      if (!res.ok) { showToast('Помилка завантаження', 'error'); return; }
      const data = await res.json();
      const url = data.url;
      overrides[key] = url;

      const img = document.getElementById('img-' + key);
      if (img) img.src = url + '?t=' + Date.now(); // bust cache
    } catch { showToast('Помилка мережі', 'error'); return; }

  } else {
    const reader = new FileReader();
    reader.onload = e => {
      overrides[key] = e.target.result;
      saveOverridesLocal();
      const img = document.getElementById('img-' + key);
      if (img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    return;
  }

  const badge = document.getElementById('badge-' + key);
  if (badge) badge.style.display = 'inline-flex';
  const reset = document.getElementById('reset-' + key);
  if (reset) reset.style.display = 'inline-flex';
  updateStats();
  showToast(`Слайд «${key}» оновлено`);
}

/* ─── Reset banner ─── */
async function resetBanner(key) {
  if (useApi) {
    await apiFetch(`/api/upload/slider/${encodeURIComponent(key)}`, { method: 'DELETE' });
  }
  delete overrides[key];
  if (!useApi) saveOverridesLocal();

  const img = document.getElementById('img-' + key);
  if (img) img.src = ORIG[key];

  const badge = document.getElementById('badge-' + key);
  if (badge) badge.style.display = 'none';
  const reset = document.getElementById('reset-' + key);
  if (reset) reset.style.display = 'none';

  updateStats();
  showToast(`Слайд «${key}» відновлено`);
}

/* ─── Stats ─── */
function updateStats() {
  const changedCount = Object.keys(overrides).length;
  const statChanged = document.getElementById('statChanged');
  const statOriginal = document.getElementById('statOriginal');
  if (statChanged)  statChanged.textContent  = changedCount;
  if (statOriginal) statOriginal.textContent = 20 - changedCount;
}

function saveOverridesLocal() {
  localStorage.setItem(LS_KEY_BANNERS, JSON.stringify(overrides));
}

/* ─── Toast ─── */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  const i = t.querySelector('i');
  if (m) m.textContent = msg;
  if (i) i.className = type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill';
  t.className = 'admin-toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

init();
