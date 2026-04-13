/* ─── Load category from localStorage ─── */
const LS_KEY = 'skinz_admin_categories';
const params = new URLSearchParams(location.search);
const catId  = parseInt(params.get('id'), 10);
let categories = [];
let category   = null;
let photoData  = null; // base64 or URL

function loadData() {
  const raw = localStorage.getItem(LS_KEY);
  categories = raw ? JSON.parse(raw) : [];
  category   = categories.find(c => c.id === catId) || null;
}

function populateForm() {
  if (!category) {
    document.getElementById('pageTitle').textContent = 'Категорію не знайдено';
    return;
  }

  document.getElementById('pageTitle').textContent    = category.name;
  document.getElementById('breadcrumbName').textContent = category.name;
  document.getElementById('fName').value   = category.name;
  document.getElementById('fCount').value  = category.count ?? 0;
  document.getElementById('fActive').checked = category.active !== false;
  if (category.photo) {
    photoData = category.photo;
    showPreview(category.photo, category.name, null);
  }
}

function showPreview(src, name, size) {
  document.getElementById('uploadZone').style.display = 'none';
  document.getElementById('previewWrap').style.display = 'block';
  document.getElementById('previewImg').src = src;
  document.getElementById('imgMeta').style.display = 'block';
  document.getElementById('imgFileName').textContent = name || 'зображення';
  const sizeEl = document.getElementById('imgFileSize');
  if (size) {
    sizeEl.textContent = size < 1024*1024 ? (size/1024).toFixed(0) + ' КБ' : (size/1024/1024).toFixed(1) + ' МБ';
    sizeEl.style.display = '';
  } else {
    sizeEl.style.display = 'none';
  }
}

/* ─── File input handler ─── */
function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Файл завеликий (макс. 5 МБ)', 'error'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    photoData = e.target.result;
    showPreview(e.target.result, file.name, file.size);
  };
  reader.readAsDataURL(file);
}

/* ─── Drag-and-drop ─── */
const zone = document.getElementById('uploadZone');
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => {
  e.preventDefault(); zone.classList.remove('drag-over');
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    const dt = new DataTransfer(); dt.items.add(file);
    const tmp = { files: dt.files };
    handleFileSelect(tmp);
  }
});

/* ─── Save ─── */
function saveCategory() {
  const name  = document.getElementById('fName').value.trim();
  const count = parseInt(document.getElementById('fCount').value, 10) || 0;
  const active = document.getElementById('fActive').checked;

  if (!name)  { showToast('Введіть назву категорії', 'error'); return; }

  if (!category) { showToast('Категорію не знайдено', 'error'); return; }

  const idx = categories.findIndex(c => c.id === catId);
  if (idx === -1) { showToast('Помилка збереження', 'error'); return; }

  categories[idx] = {
    ...categories[idx],
    name, count, active,
    photo: photoData || category.photo || ''
  };

  localStorage.setItem(LS_KEY, JSON.stringify(categories));
  document.getElementById('pageTitle').textContent = name;
  document.getElementById('breadcrumbName').textContent = name;
  category = categories[idx];
  showToast('Зміни збережено ✓', 'success');
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

/* ─── Init ─── */
loadData();
populateForm();