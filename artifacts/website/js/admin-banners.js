const LS_KEY = 'skinz_banners';

const SECTIONS = [
  { label: '🌸 Весна', keys: ['spring-01','spring-02','spring-03','spring-04','spring-05'] },
  { label: '☀️ Літо',  keys: ['summer-01','summer-02','summer-03','summer-04','summer-05'] },
  { label: '🍂 Осінь', keys: ['autumn-01','autumn-02','autumn-03','autumn-04','autumn-05'] },
  { label: '❄️ Зима',  keys: ['winter-01','winter-02','winter-03','winter-04','winter-05'] },
];

const ORIG = {};
SECTIONS.forEach(s => s.keys.forEach(k => { ORIG[k] = `../images/slider/${k}.png`; }));

let overrides = {};
try { overrides = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch(e) { overrides = {}; }

/* ─── Build HTML ─── */
function buildSections() {
  const container = document.getElementById('sectionsContainer');
  container.innerHTML = SECTIONS.map((sec, si) => `
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
  const src = overrides[key] || ORIG[key];
  const changed = !!overrides[key];
  return `
    <div class="banner-card" id="card-${key}">
      <div class="banner-img-wrap">
        <img src="${src}" id="img-${key}" alt="${key}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22><rect width=%2216%22 height=%229%22 fill=%22%23eee%22/></svg>'"/>
        <div class="banner-overlay">
          <label class="banner-change-btn">
            <input type="file" accept="image/jpeg,.jpg,.jpeg" onchange="changeBanner('${key}', this)"/>
            <i class="bi bi-arrow-repeat"></i> Замінити фото
          </label>
        </div>
      </div>
      <div class="banner-footer">
        <span class="banner-footer-name">${key}.png</span>
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
function changeBanner(key, input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Файл завеликий (макс. 5 МБ)', 'error'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    overrides[key] = e.target.result;
    saveOverrides();

    const img = document.getElementById('img-' + key);
    if (img) img.src = e.target.result;

    const badge = document.getElementById('badge-' + key);
    if (badge) badge.style.display = 'inline-flex';

    const reset = document.getElementById('reset-' + key);
    if (reset) reset.style.display = 'inline-flex';

    updateStats();
    showToast('Банер «' + key + '» оновлено');
  };
  reader.readAsDataURL(file);
}

/* ─── Reset banner ─── */
function resetBanner(key) {
  delete overrides[key];
  saveOverrides();

  const img = document.getElementById('img-' + key);
  if (img) img.src = ORIG[key];

  const badge = document.getElementById('badge-' + key);
  if (badge) badge.style.display = 'none';

  const reset = document.getElementById('reset-' + key);
  if (reset) reset.style.display = 'none';

  updateStats();
  showToast('Банер «' + key + '» відновлено');
}

/* ─── Stats ─── */
function updateStats() {
  const changedCount = Object.keys(overrides).length;
  document.getElementById('statChanged').textContent = changedCount;
  document.getElementById('statOriginal').textContent = 20 - changedCount;
}

function saveOverrides() {
  localStorage.setItem(LS_KEY, JSON.stringify(overrides));
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

/* ─── Init ─── */
buildSections();
updateStats();