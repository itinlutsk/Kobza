const LS_KEY_CAT  = 'skinz_admin_categories';
const API_BASE    = '/dotnet-api';

const params = new URLSearchParams(location.search);
const catId  = parseInt(params.get('id'), 10);

let categories = [];
let category   = null;
let photoUrl   = null;  // current saved URL on server (or existing)
let pendingFile = null; // File object waiting to be uploaded
let useApi = false;

/* ─── API helpers ─── */
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...opts });
    if (res.status === 401) { location.href = 'admin-login.html'; return null; }
    if (res.status === 204) return {};
    return res.ok ? res.json() : null;
  } catch { return null; }
}

async function uploadCategoryPhoto(id, file) {
  const fd = new FormData();
  fd.append('file', file);
  try {
    const res = await fetch(`${API_BASE}/api/upload/categories/${id}`, {
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
  const authCheck = await apiFetch('/api/auth/me');
  useApi = !!authCheck;

  if (useApi) {
    const cats = await apiFetch('/api/categories');
    categories = cats || [];
    category = categories.find(c => c.id === catId) || null;
  } else {
    const raw = localStorage.getItem(LS_KEY_CAT);
    categories = raw ? JSON.parse(raw) : [];
    category   = categories.find(c => c.id === catId) || null;
  }

  populateForm();
  initDragDrop();
}

function populateForm() {
  if (!category) {
    document.getElementById('pageTitle').textContent = 'Категорію не знайдено';
    return;
  }

  document.getElementById('pageTitle').textContent      = category.name;
  document.getElementById('breadcrumbName').textContent = category.name;
  document.getElementById('fName').value    = category.name;
  document.getElementById('fCount').value   = category.count ?? 0;
  document.getElementById('fActive').checked = category.active !== false;

  if (category.photo) {
    photoUrl = category.photo;
    showPreview(category.photo, 'фото категорії', null);
  }
}

function showPreview(src, name, size) {
  document.getElementById('uploadZone').style.display  = 'none';
  document.getElementById('previewWrap').style.display = 'block';
  document.getElementById('previewImg').src = src;
  document.getElementById('imgMeta').style.display = 'block';
  document.getElementById('imgFileName').textContent = name || 'зображення';
  const sizeEl = document.getElementById('imgFileSize');
  if (size) {
    sizeEl.textContent = size < 1024*1024
      ? (size/1024).toFixed(0) + ' КБ'
      : (size/1024/1024).toFixed(1) + ' МБ';
    sizeEl.style.display = '';
  } else {
    sizeEl.style.display = 'none';
  }
}

/* ─── File input handler ─── */
function handleFileSelect(input) {
  const file = (input.files || [])[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Файл завеликий (макс. 5 МБ)', 'error'); return; }

  pendingFile = file;

  if (useApi) {
    const preview = URL.createObjectURL(file);
    showPreview(preview, file.name, file.size);
  } else {
    const reader = new FileReader();
    reader.onload = e => {
      photoUrl = e.target.result;
      showPreview(e.target.result, file.name, file.size);
    };
    reader.readAsDataURL(file);
  }
}

/* ─── Drag-and-drop ─── */
function initDragDrop() {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      const dt = new DataTransfer(); dt.items.add(file);
      handleFileSelect({ files: dt.files });
    }
  });
}

/* ─── Save ─── */
async function saveCategory() {
  const name   = document.getElementById('fName').value.trim();
  const count  = parseInt(document.getElementById('fCount').value, 10) || 0;
  const active = document.getElementById('fActive').checked;

  if (!name) { showToast('Введіть назву категорії', 'error'); return; }
  if (!category) { showToast('Категорію не знайдено', 'error'); return; }

  const btn = document.querySelector('.btn-primary-admin');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Зберігаємо…'; }

  let finalPhoto = photoUrl || category.photo || null;

  if (useApi) {
    // Upload new photo if a file was selected
    if (pendingFile) {
      const uploaded = await uploadCategoryPhoto(catId, pendingFile);
      if (uploaded) finalPhoto = uploaded;
    }

    const updated = await apiFetch(`/api/categories/${catId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: catId, name, count, active, photo: finalPhoto, slug: category.slug })
    });

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check2"></i> Зберегти зміни'; }

    if (!updated) { showToast('Помилка збереження', 'error'); return; }

    document.getElementById('pageTitle').textContent      = name;
    document.getElementById('breadcrumbName').textContent = name;
    category = updated;
    photoUrl = finalPhoto;
    pendingFile = null;
    showToast('Зміни збережено ✓', 'success');

  } else {
    const idx = categories.findIndex(c => c.id === catId);
    if (idx === -1) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check2"></i> Зберегти зміни'; }
      showToast('Помилка збереження', 'error');
      return;
    }
    categories[idx] = { ...categories[idx], name, count, active, photo: finalPhoto };
    localStorage.setItem(LS_KEY_CAT, JSON.stringify(categories));
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check2"></i> Зберегти зміни'; }
    document.getElementById('pageTitle').textContent      = name;
    document.getElementById('breadcrumbName').textContent = name;
    category = categories[idx];
    showToast('Зміни збережено ✓', 'success');
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

/* ─── Mobile sidebar ─── */
function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

init();
