const API_BASE    = '/dotnet-api';
const LS_KEY      = 'skinz_admin_categories';

let categories    = [];
let deleteTargetId = null;
let useApi        = false;

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
  const me = await apiFetch('/api/auth/me');
  useApi = !!me;

  if (useApi) {
    const data = await apiFetch('/api/categories');
    categories = data || [];
  } else {
    const raw = localStorage.getItem(LS_KEY);
    categories = raw ? JSON.parse(raw) : [];
  }

  renderTable();
}

/* ─── Helpers ─── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function slugify(str) {
  const map = {'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya',' ':'-'};
  return str.toLowerCase().split('').map(c=>map[c]??c).join('').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'');
}
function lsSave() { localStorage.setItem(LS_KEY, JSON.stringify(categories)); }
function nextLocalId() { return categories.length ? Math.max(...categories.map(c=>c.id))+1 : 1; }

/* ─── Render ─── */
function renderTable() {
  const query    = (document.getElementById('catSearch')?.value || '').toLowerCase();
  const filtered = categories.filter(c => c.name.toLowerCase().includes(query));
  const grid     = document.getElementById('catGrid');
  const empty    = document.getElementById('catEmptyState');

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = filtered.map(cat => {
      const cnt = cat.count ?? 0;
      return `
      <div class="cat-card">
        <div class="cat-card-img">
          ${cat.photo
            ? `<img src="${escHtml(cat.photo)}" alt="${escHtml(cat.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="cat-card-img-placeholder" ${cat.photo ? 'style="display:none"' : ''}>
            <i class="bi bi-image"></i>
          </div>
          <div class="cat-card-status">
            <span class="${cat.active ? 'badge-active' : 'badge-hidden'}" style="font-size:.6rem;padding:.15rem .45rem">
              ${cat.active ? 'Активна' : 'Прихована'}
            </span>
          </div>
          <div class="cat-card-actions">
            <a href="admin-category.html?id=${cat.id}" class="cat-card-btn" title="Редагувати">
              <i class="bi bi-pencil"></i>
            </a>
            <button class="cat-card-btn danger" onclick="openDeleteModal(${cat.id})" title="Видалити">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </div>
        <div class="cat-card-body">
          <a href="admin-category.html?id=${cat.id}" class="cat-card-name">${escHtml(cat.name)}</a>
          <div class="cat-card-meta">
            <span class="cat-card-id">ID: ${cat.id}</span>
            <span class="count-pill ${cnt === 0 ? 'empty' : ''}" style="padding:.15rem .45rem;font-size:.68rem">
              <i class="bi bi-box-seam" style="font-size:.65rem"></i> ${cnt}
            </span>
          </div>
        </div>
      </div>`;
    }).join('');
  }
  updateStats();
}

function updateStats() {
  const el = id => document.getElementById(id);
  if (el('statTotal'))  el('statTotal').textContent  = categories.length;
  if (el('statActive')) el('statActive').textContent = categories.filter(c => c.active).length;
  if (el('statHidden')) el('statHidden').textContent = categories.filter(c => !c.active).length;
}

/* ─── Add modal ─── */
function openAddModal() {
  document.getElementById('modalTitle').textContent    = 'Додати категорію';
  document.getElementById('modalSubtitle').textContent = 'Заповніть дані нової категорії';
  document.getElementById('editId').value    = '';
  document.getElementById('fName').value     = '';
  document.getElementById('fPhoto').value    = '';
  document.getElementById('fCount').value    = '';
  document.getElementById('fActive').checked = true;
  const prev = document.getElementById('photoPreview');
  if (prev) prev.style.display = 'none';
  document.getElementById('catModal').classList.add('open');
}

/* ─── Edit modal ─── */
function openEditModal(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('modalTitle').textContent    = 'Редагувати категорію';
  document.getElementById('modalSubtitle').textContent = cat.name;
  document.getElementById('editId').value    = id;
  document.getElementById('fName').value     = cat.name;
  document.getElementById('fPhoto').value    = cat.photo || '';
  document.getElementById('fCount').value    = cat.count ?? 0;
  document.getElementById('fActive').checked = cat.active !== false;
  const prev = document.getElementById('photoPreview');
  if (prev) { prev.src = cat.photo || ''; prev.style.display = cat.photo ? 'block' : 'none'; }
  document.getElementById('catModal').classList.add('open');
}

function closeModal() { document.getElementById('catModal').classList.remove('open'); }

function previewPhoto() {
  const url  = document.getElementById('fPhoto').value;
  const prev = document.getElementById('photoPreview');
  if (!prev) return;
  prev.src           = url;
  prev.style.display = url ? 'block' : 'none';
}

/* ─── Save (Add / Edit) ─── */
async function saveCategory() {
  const name = document.getElementById('fName').value.trim();
  if (!name) { showToast('Введіть назву категорії', 'error'); return; }

  const id      = parseInt(document.getElementById('editId').value) || 0;
  const payload = {
    id,
    name,
    slug:   slugify(name),
    photo:  document.getElementById('fPhoto').value.trim() || '',
    count:  parseInt(document.getElementById('fCount').value) || 0,
    active: document.getElementById('fActive').checked,
  };

  if (useApi) {
    let result;
    if (id) {
      result = await apiFetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      result = await apiFetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    if (!result) { showToast('Помилка збереження', 'error'); return; }
    if (id) {
      const idx = categories.findIndex(c => c.id === id);
      if (idx >= 0) categories[idx] = result;
    } else {
      categories.push(result);
    }
  } else {
    if (id) {
      const idx = categories.findIndex(c => c.id === id);
      if (idx >= 0) categories[idx] = { ...categories[idx], ...payload };
    } else {
      categories.push({ ...payload, id: nextLocalId() });
    }
    lsSave();
  }

  renderTable();
  closeModal();
  showToast(id ? 'Категорію оновлено' : 'Категорію додано');
}

/* ─── Delete ─── */
function openDeleteModal(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  deleteTargetId = id;
  document.getElementById('deleteName').textContent = cat.name;
  document.getElementById('deleteModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
  deleteTargetId = null;
}
async function confirmDelete() {
  if (!deleteTargetId) return;
  if (useApi) {
    const res = await apiFetch(`/api/categories/${deleteTargetId}`, { method: 'DELETE' });
    if (res === null) { showToast('Помилка видалення', 'error'); return; }
  }
  categories = categories.filter(c => c.id !== deleteTargetId);
  if (!useApi) lsSave();
  renderTable();
  closeDeleteModal();
  showToast('Категорію видалено');
}

/* ─── Toast ─── */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.querySelector('i').className = type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill';
  document.getElementById('toastMsg').textContent = msg;
  t.className = 'admin-toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ─── Sidebar ─── */
function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

/* ─── Start ─── */
init();
