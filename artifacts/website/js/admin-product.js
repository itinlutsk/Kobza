const LS_PRODUCTS   = 'skinz_admin_products';
const LS_CATEGORIES = 'skinz_admin_categories';
const SIZES = ['XS','S','M','L','XL','XXL'];
const API_BASE = '/dotnet-api';

let prodId     = null;
let product    = null;
let categories = [];
const MAX_PHOTOS = 8;
let useApi = false;

// Each photo item:
//   { kind: 'url',     url: '/uploads/products/5/123.jpg' }  — already on server
//   { kind: 'pending', file: File, preview: string }          — selected, not yet uploaded
//   { kind: 'base64',  data: string }                         — localStorage fallback
let photoItems = [];
const objectURLs = []; // track for cleanup

/* ─── API helpers ─── */
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...opts });
    if (res.status === 401) { location.href = 'admin-login.html'; return null; }
    if (res.status === 204) return {};
    return res.ok ? res.json() : null;
  } catch { return null; }
}

/* Upload a single file to /api/upload/products/{id}; returns URL string or null */
async function uploadFile(id, file) {
  const fd = new FormData();
  fd.append('file', file);
  try {
    const res = await fetch(`${API_BASE}/api/upload/products/${id}`, {
      method: 'POST',
      credentials: 'include',
      body: fd
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch { return null; }
}

/* ─── Init ─── */
async function init() {
  const params = new URLSearchParams(location.search);
  prodId = params.get('id') ? parseInt(params.get('id')) : null;

  const authCheck = await apiFetch('/api/auth/me');
  useApi = !!authCheck;

  if (useApi) {
    const [cats, prods] = await Promise.all([
      apiFetch('/api/categories'),
      prodId ? apiFetch(`/api/products/${prodId}`) : Promise.resolve(null)
    ]);
    categories = cats || [];
    if (prodId && prods) product = prods;
  } else {
    const storedC = localStorage.getItem(LS_CATEGORIES);
    categories = storedC ? JSON.parse(storedC) : [];
    if (prodId) {
      const storedP = localStorage.getItem(LS_PRODUCTS);
      const allProds = storedP ? JSON.parse(storedP) : [];
      product = allProds.find(p => p.id === prodId) || null;
    }
  }

  populateCategorySelect();

  if (product) {
    document.getElementById('pageTitle').textContent       = product.name;
    document.getElementById('breadcrumbName').textContent  = product.name;
    document.title = product.name + ' — SKINZ Адмін';
    document.getElementById('fName').value        = product.name;
    document.getElementById('fPrice').value       = product.price || '';
    document.getElementById('fSalePrice').value   = product.salePrice ?? '';
    document.getElementById('fCategory').value    = product.categoryId || '';
    document.getElementById('fDescription').value = product.description || '';
    document.getElementById('fActive').checked    = product.active !== false;
    document.getElementById('fIsNew').checked     = !!product.isNew;
    document.getElementById('fIsTop').checked     = !!product.isTop;

    const hex = product.colorHex || '#8B1A2A';
    document.getElementById('fColorHex').value       = hex;
    document.getElementById('fColorHexText').value   = hex;
    document.getElementById('fColorName').value      = product.colorName || '';
    document.getElementById('colorSwatchWrap').style.background = hex;

    (product.sizes || []).forEach(s => {
      const el = document.getElementById('sz-' + s.size);
      if (el) {
        el.value = s.stock;
        el.classList.toggle('zero', !(s.stock));
      }
    });

    // Existing photos: load as url items
    const photos = product.photos || (product.photo ? [product.photo] : []);
    photoItems = photos.map(src => ({ kind: 'url', url: src }));
  } else {
    SIZES.forEach(sz => {
      const el = document.getElementById('sz-' + sz);
      if (el) el.classList.add('zero');
    });
  }

  renderPhotoGrid();
  initDragDrop();
}

function populateCategorySelect() {
  const sel = document.getElementById('fCategory');
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

/* ─── Hex sync ─── */
function syncHexText(val) {
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    document.getElementById('fColorHex').value = val;
    document.getElementById('colorSwatchWrap').style.background = val;
  }
}

/* ─── Photo gallery ─── */
function getPhotoSrc(item) {
  if (item.kind === 'url')     return item.url;
  if (item.kind === 'pending') return item.preview;
  if (item.kind === 'base64')  return item.data;
  return '';
}

function renderPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  const countEl = document.getElementById('photoCount');
  if (countEl) countEl.textContent = `${photoItems.length} / ${MAX_PHOTOS}`;

  let html = photoItems.map((item, i) => `
    <div class="pg-item">
      <img src="${escHtml(getPhotoSrc(item))}" alt="Фото ${i + 1}" loading="lazy"/>
      ${i === 0 ? '<span class="pg-main-badge">Головне</span>' : ''}
      ${item.kind === 'pending' ? '<span class="pg-upload-badge"><i class="bi bi-cloud-arrow-up"></i></span>' : ''}
      <button class="pg-remove" onclick="removePhoto(${i})" title="Видалити фото">
        <i class="bi bi-x"></i>
      </button>
    </div>`).join('');

  if (photoItems.length < MAX_PHOTOS) {
    html += `
    <div class="pg-add" onclick="document.getElementById('photoAddInput').click()">
      <i class="bi bi-plus-lg pg-add-icon"></i>
      <span class="pg-add-label">${photoItems.length === 0 ? 'Додати фото' : 'Ще фото'}</span>
    </div>`;
  }
  grid.innerHTML = html;
}

function removePhoto(idx) {
  const item = photoItems[idx];
  if (item?.kind === 'pending' && item.preview?.startsWith('blob:')) {
    URL.revokeObjectURL(item.preview);
  }
  photoItems.splice(idx, 1);
  renderPhotoGrid();
}

function handleFileSelect(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const remaining = MAX_PHOTOS - photoItems.length;
  if (remaining <= 0) { showToast(`Максимум ${MAX_PHOTOS} фотографій`, 'error'); return; }
  const toProcess = files.slice(0, remaining);
  toProcess.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(`Файл "${file.name}" завеликий (макс. 5 МБ)`, 'error');
      return;
    }
    if (useApi) {
      const preview = URL.createObjectURL(file);
      objectURLs.push(preview);
      photoItems.push({ kind: 'pending', file, preview });
    } else {
      const reader = new FileReader();
      reader.onload = e => {
        photoItems.push({ kind: 'base64', data: e.target.result });
        renderPhotoGrid();
      };
      reader.readAsDataURL(file);
      return;
    }
  });
  renderPhotoGrid();
  input.value = '';
}

function initDragDrop() {
  const grid = document.getElementById('photoGrid');
  grid.addEventListener('dragover', e => { e.preventDefault(); grid.classList.add('drag-over'); });
  grid.addEventListener('dragleave', () => grid.classList.remove('drag-over'));
  grid.addEventListener('drop', e => {
    e.preventDefault(); grid.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length) {
      const dt = new DataTransfer();
      files.forEach(f => dt.items.add(f));
      handleFileSelect({ files: dt.files, value: '' });
    }
  });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Save ─── */
async function saveProduct() {
  const name  = document.getElementById('fName').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value) || 0;
  if (!name)  { showToast('Введіть назву товару', 'error'); return; }
  if (!price) { showToast('Введіть ціну товару', 'error'); return; }

  const colorHex  = document.getElementById('fColorHex').value  || '#8B1A2A';
  const colorName = document.getElementById('fColorName').value.trim();

  const sizes = SIZES.map(sz => ({
    size:  sz,
    stock: parseInt(document.getElementById('sz-' + sz)?.value) || 0
  }));

  const baseData = {
    name,
    price,
    salePrice:   parseFloat(document.getElementById('fSalePrice').value) || null,
    description: document.getElementById('fDescription').value.trim(),
    categoryId:  parseInt(document.getElementById('fCategory').value) || null,
    active:      document.getElementById('fActive').checked,
    isNew:       document.getElementById('fIsNew').checked,
    isTop:       document.getElementById('fIsTop').checked,
    colorName,
    colorHex,
    sizes
  };

  if (useApi) {
    const btn = document.querySelector('.admin-btn-primary');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Зберігаємо…'; }

    let targetId = prodId;

    // Step 1: Create/update without photos first to get the ID
    let saved;
    if (prodId) {
      saved = await apiFetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseData, id: prodId, photos: photoItems.filter(i => i.kind === 'url').map(i => i.url) })
      });
    } else {
      saved = await apiFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseData, id: 0, photos: [] })
      });
    }

    if (!saved) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check2"></i> Зберегти'; }
      showToast('Помилка збереження', 'error');
      return;
    }

    targetId = saved.id;

    // Step 2: Upload pending photos
    const pendingItems = photoItems.filter(i => i.kind === 'pending');
    const uploadedUrls = [];
    for (const item of pendingItems) {
      const url = await uploadFile(targetId, item.file);
      if (url) uploadedUrls.push(url);
    }

    // Step 3: Build final photos list (existing urls + newly uploaded)
    const existingUrls = photoItems.filter(i => i.kind === 'url').map(i => i.url);
    const allPhotos = [...existingUrls, ...uploadedUrls];

    // Step 4: Update product with all photos
    if (uploadedUrls.length > 0 || !prodId) {
      await apiFetch(`/api/products/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseData, id: targetId, photos: allPhotos })
      });
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check2"></i> Зберегти'; }
    showToast('Товар збережено ✓');
    setTimeout(() => location.href = 'admin-products.html', 900);

  } else {
    // localStorage fallback — store base64
    const photos = photoItems.map(item => {
      if (item.kind === 'base64') return item.data;
      if (item.kind === 'url')    return item.url;
      return null;
    }).filter(Boolean);

    const storedP  = localStorage.getItem(LS_PRODUCTS);
    let allProds   = storedP ? JSON.parse(storedP) : [];
    const nextId   = allProds.length ? Math.max(...allProds.map(p => p.id)) + 1 : 1;
    const data = { ...baseData, id: prodId || nextId, photos };

    if (prodId) {
      const idx = allProds.findIndex(p => p.id === prodId);
      if (idx >= 0) allProds[idx] = data;
      else allProds.push(data);
    } else {
      allProds.push(data);
    }
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(allProds));
    showToast('Товар збережено ✓');
    setTimeout(() => location.href = 'admin-products.html', 900);
  }
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

// Cleanup object URLs on unload
window.addEventListener('unload', () => {
  objectURLs.forEach(u => URL.revokeObjectURL(u));
});

init();
