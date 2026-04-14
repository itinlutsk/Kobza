const STORAGE_KEY = 'skinz_admin_categories';
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Боді', slug: 'body', photo: 'https://images.pexels.com/photos/5935748/pexels-photo-5935748.jpeg?auto=compress&cs=tinysrgb&w=200', count: 12, active: true },
  { id: 2, name: 'Сукні', slug: 'sukni', photo: 'https://images.pexels.com/photos/1187719/pexels-photo-1187719.jpeg?auto=compress&cs=tinysrgb&w=200', count: 18, active: true },
  { id: 3, name: 'Нижня білизна', slug: 'bilyznа', photo: 'https://images.pexels.com/photos/4792086/pexels-photo-4792086.jpeg?auto=compress&cs=tinysrgb&w=200', count: 9, active: true },
  { id: 4, name: 'Топи', slug: 'topy', photo: 'https://images.pexels.com/photos/2249528/pexels-photo-2249528.jpeg?auto=compress&cs=tinysrgb&w=200', count: 15, active: true },
  { id: 5, name: 'Комбінезони', slug: 'kombinezony', photo: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=200', count: 7, active: true },
  { id: 6, name: 'Шорти', slug: 'shorty', photo: 'https://images.pexels.com/photos/1485781/pexels-photo-1485781.jpeg?auto=compress&cs=tinysrgb&w=200', count: 6, active: true },
  { id: 7, name: 'Піжами', slug: 'pyzhamы', photo: 'https://images.pexels.com/photos/3807332/pexels-photo-3807332.jpeg?auto=compress&cs=tinysrgb&w=200', count: 4, active: true },
  { id: 8, name: 'Спідниці', slug: 'spidnytsi', photo: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=200', count: 8, active: true },
  { id: 9, name: 'Джинси', slug: 'dzhinsy', photo: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=200', count: 5, active: false },
  { id: 10, name: 'Пальта', slug: 'palta', photo: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=200', count: 6, active: true },
];

let categories = [];
let deleteTargetId = null;

function loadCategories() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) { categories = JSON.parse(stored); }
  else { categories = DEFAULT_CATEGORIES; saveToStorage(); }
}
function saveToStorage() { localStorage.setItem(STORAGE_KEY, JSON.stringify(categories)); }
function nextId() { return categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1; }
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function slugify(str) {
  const map = { 'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya',' ':'-' };
  return str.toLowerCase().split('').map(c => map[c] ?? c).join('').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'');
}

function renderTable() {
  const query = (document.getElementById('catSearch')?.value || '').toLowerCase();
  const filtered = categories.filter(c => c.name.toLowerCase().includes(query));
  const grid = document.getElementById('catGrid');
  const empty = document.getElementById('catEmptyState');
  if (filtered.length === 0) { grid.innerHTML = ''; empty.style.display = 'block'; }
  else {
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
      </div>
    `}).join('');
  }
  updateStats();
}

function updateStats() {
  document.getElementById('statTotal').textContent = categories.length;
  document.getElementById('statActive').textContent = categories.filter(c => c.active).length;
  document.getElementById('statHidden').textContent = categories.filter(c => !c.active).length;
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Додати категорію';
  document.getElementById('modalSubtitle').textContent = 'Заповніть дані нової категорії';
  document.getElementById('editId').value = '';
  document.getElementById('fName').value = '';
  document.getElementById('fPhoto').value = '';
  document.getElementById('fCount').value = '';
  document.getElementById('fActive').checked = true;
  document.getElementById('photoPreview').style.display = 'none';
  document.getElementById('catModal').classList.add('open');
}

function openEditModal(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('modalTitle').textContent = 'Редагувати категорію';
  document.getElementById('modalSubtitle').textContent = cat.name;
  document.getElementById('editId').value = id;
  document.getElementById('fName').value = cat.name;
  document.getElementById('fPhoto').value = cat.photo || '';
  document.getElementById('fCount').value = cat.count ?? 0;
  document.getElementById('fActive').checked = cat.active;
  const prev = document.getElementById('photoPreview');
  if (cat.photo) { prev.src = cat.photo; prev.style.display = 'block'; }
  else { prev.style.display = 'none'; }
  document.getElementById('catModal').classList.add('open');
}

function closeModal() { document.getElementById('catModal').classList.remove('open'); }

function previewPhoto() {
  const url = document.getElementById('fPhoto').value;
  const prev = document.getElementById('photoPreview');
  if (url) { prev.src = url; prev.style.display = 'block'; }
  else { prev.style.display = 'none'; }
}

function saveCategory() {
  const name = document.getElementById('fName').value.trim();
  if (!name) { showToast('Введіть назву категорії', 'error'); return; }
  const id = parseInt(document.getElementById('editId').value);
  const data = {
    name,
    photo: document.getElementById('fPhoto').value.trim() || '',
    count: parseInt(document.getElementById('fCount').value) || 0,
    active: document.getElementById('fActive').checked,
  };
  if (id) {
    const idx = categories.findIndex(c => c.id === id);
    if (idx >= 0) { categories[idx] = { ...categories[idx], ...data }; }
  } else {
    categories.push({ id: nextId(), ...data });
  }
  saveToStorage();
  renderTable();
  closeModal();
  showToast(id ? 'Категорію оновлено' : 'Категорію додано');
}

function openDeleteModal(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  deleteTargetId = id;
  document.getElementById('deleteName').textContent = cat.name;
  document.getElementById('deleteModal').classList.add('open');
}
function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('open'); deleteTargetId = null; }
function confirmDelete() {
  if (!deleteTargetId) return;
  categories = categories.filter(c => c.id !== deleteTargetId);
  saveToStorage(); renderTable(); closeDeleteModal();
  showToast('Категорію видалено');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.querySelector('i').className = type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill';
  document.getElementById('toastMsg').textContent = msg;
  t.className = 'admin-toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fName')?.addEventListener('input', function () {
    if (!document.getElementById('editId').value) {
      document.getElementById('fSlug').value = slugify(this.value);
    }
  });
});

loadCategories();
renderTable();