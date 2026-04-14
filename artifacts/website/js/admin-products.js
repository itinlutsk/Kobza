const LS_PRODUCTS   = 'skinz_admin_products';
const LS_CATEGORIES = 'skinz_admin_categories';
const LS_VERSION    = 'skinz_admin_ver';
const CURRENT_VER   = '4';
const PAGE_SIZE_DEFAULT = 20;

const API_BASE = '/dotnet-api';

const DEFAULT_PRODUCTS = [
  {id:1,name:'Боді класичне',price:1500,salePrice:1200,description:'Класичне боді з еластичного трикотажу. Ідеально для повсякденного образу.',categoryId:1,active:true,isNew:true,isTop:false,
   photos:['https://images.pexels.com/photos/5935748/pexels-photo-5935748.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Чорний',colorHex:'#1A1A1A',
   sizes:[{size:'XS',stock:3},{size:'S',stock:5},{size:'M',stock:7},{size:'L',stock:4},{size:'XL',stock:2},{size:'XXL',stock:1}]},
  {id:2,name:'Боді класичне (бежевий)',price:1500,salePrice:1200,description:'Класичне боді з еластичного трикотажу.',categoryId:1,active:true,isNew:false,isTop:false,
   photos:['https://images.pexels.com/photos/5935748/pexels-photo-5935748.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Бежевий',colorHex:'#C8B49A',
   sizes:[{size:'XS',stock:2},{size:'S',stock:4},{size:'M',stock:5},{size:'L',stock:3},{size:'XL',stock:1},{size:'XXL',stock:0}]},
  {id:3,name:'Сукня вечірня',price:2800,salePrice:null,description:'Елегантна вечірня сукня для особливих подій.',categoryId:2,active:true,isNew:false,isTop:true,
   photos:['https://images.pexels.com/photos/1187719/pexels-photo-1187719.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Бордовий',colorHex:'#8B1A2A',
   sizes:[{size:'XS',stock:1},{size:'S',stock:3},{size:'M',stock:4},{size:'L',stock:2},{size:'XL',stock:1},{size:'XXL',stock:0}]},
  {id:4,name:'Сукня вечірня (чорна)',price:2800,salePrice:null,description:'Елегантна вечірня сукня для особливих подій.',categoryId:2,active:true,isNew:false,isTop:false,
   photos:['https://images.pexels.com/photos/1187719/pexels-photo-1187719.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Чорний',colorHex:'#1A1A1A',
   sizes:[{size:'XS',stock:2},{size:'S',stock:3},{size:'M',stock:5},{size:'L',stock:2},{size:'XL',stock:0},{size:'XXL',stock:0}]},
  {id:5,name:'Топ базовий',price:650,salePrice:null,description:'Базовий топ на кожен день.',categoryId:4,active:true,isNew:false,isTop:false,
   photos:['https://images.pexels.com/photos/2249528/pexels-photo-2249528.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Білий',colorHex:'#F0EDE8',
   sizes:[{size:'XS',stock:5},{size:'S',stock:8},{size:'M',stock:10},{size:'L',stock:6},{size:'XL',stock:3},{size:'XXL',stock:2}]},
  {id:6,name:'Топ базовий (чорний)',price:650,salePrice:null,description:'Базовий топ на кожен день.',categoryId:4,active:true,isNew:false,isTop:false,
   photos:['https://images.pexels.com/photos/2249528/pexels-photo-2249528.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Чорний',colorHex:'#1A1A1A',
   sizes:[{size:'XS',stock:4},{size:'S',stock:6},{size:'M',stock:8},{size:'L',stock:5},{size:'XL',stock:2},{size:'XXL',stock:1}]},
  {id:7,name:'Комбінезон літній',price:2200,salePrice:1800,description:'Легкий літній комбінезон з натуральних тканин.',categoryId:5,active:true,isNew:true,isTop:true,
   photos:['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Оливковий',colorHex:'#6B7645',
   sizes:[{size:'XS',stock:2},{size:'S',stock:4},{size:'M',stock:5},{size:'L',stock:3},{size:'XL',stock:1},{size:'XXL',stock:0}]},
  {id:8,name:'Спідниця міді',price:950,salePrice:null,description:'Класична спідниця міді-довжини.',categoryId:8,active:false,isNew:false,isTop:false,
   photos:['https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'],
   colorName:'Чорний',colorHex:'#1A1A1A',
   sizes:[{size:'XS',stock:0},{size:'S',stock:2},{size:'M',stock:3},{size:'L',stock:1},{size:'XL',stock:0},{size:'XXL',stock:0}]},
];

let products      = [];
let categories    = [];
let activeFilter  = null;
let currentPage   = 1;
let deleteTargetId = null;
let useApi        = false;

function pageSize() { return parseInt(document.getElementById('perPageSel')?.value) || PAGE_SIZE_DEFAULT; }

/* ─── API helpers ─── */
async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...opts });
    if (res.status === 401) { location.href = 'admin-login.html'; return null; }
    return res.ok ? res.json() : null;
  } catch { return null; }
}

/* ─── Load ─── */
async function loadData() {
  const authCheck = await apiFetch('/api/auth/me');
  if (authCheck) {
    useApi = true;
    const [prods, cats] = await Promise.all([
      apiFetch('/api/products'),
      apiFetch('/api/categories')
    ]);
    products   = prods   || [];
    categories = cats    || [];
    localStorage.setItem(LS_PRODUCTS,   JSON.stringify(products));
    localStorage.setItem(LS_CATEGORIES, JSON.stringify(categories));
  } else {
    useApi = false;
    if (localStorage.getItem(LS_VERSION) !== CURRENT_VER) {
      localStorage.setItem(LS_VERSION, CURRENT_VER);
      localStorage.removeItem(LS_PRODUCTS);
    }
    const sp = localStorage.getItem(LS_PRODUCTS);
    products   = sp ? JSON.parse(sp) : DEFAULT_PRODUCTS;
    if (!sp) localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
    const sc   = localStorage.getItem(LS_CATEGORIES);
    categories = sc ? JSON.parse(sc) : [];
  }
}

function save() { localStorage.setItem(LS_PRODUCTS, JSON.stringify(products)); }

function getCatName(id) {
  const c = categories.find(c => c.id == id);
  return c ? c.name : '—';
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtPrice(p) { return p ? p.toLocaleString('uk-UA') + '\u00a0₴' : ''; }

/* ─── Filters ─── */
function buildFilterChips() {
  const usedIds = [...new Set(products.map(p => p.categoryId))];
  const chips   = [{ id: null, name: 'Всі' }, ...categories.filter(c => usedIds.includes(c.id))];
  document.getElementById('filterChips').innerHTML = chips.map(c => `
    <button class="filter-chip${c.id === activeFilter ? ' active' : ''}"
      onclick="setFilter(${c.id === null ? 'null' : c.id})">
      ${escHtml(c.name)}
    </button>`).join('');
}

function setFilter(catId) { activeFilter = catId; currentPage = 1; buildFilterChips(); renderTable(); }

/* ─── Filtered list ─── */
function getFiltered() {
  const q = (document.getElementById('prodSearch')?.value || '').toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) &&
    (activeFilter === null || p.categoryId == activeFilter)
  );
}

/* ─── Table ─── */
function renderTable() {
  const filtered = getFiltered();
  const ps       = pageSize();
  const pages    = Math.max(1, Math.ceil(filtered.length / ps));
  if (currentPage > pages) currentPage = pages;
  const slice    = filtered.slice((currentPage - 1) * ps, currentPage * ps);

  const tbody  = document.getElementById('prodTbody');
  const empty  = document.getElementById('prodEmpty');
  const pagRow = document.getElementById('paginationRow');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display  = 'block';
    pagRow.style.display = 'none';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = slice.map(p => {
    const mainPhoto = (p.photos && p.photos.length) ? p.photos[0] : (p.photo || null);
    const thumb = mainPhoto
      ? `<img class="prod-thumb" src="${escHtml(mainPhoto)}" alt="" onerror="this.replaceWith(makePhPh())">`
      : `<div class="prod-thumb-ph"><i class="bi bi-image"></i></div>`;

    const sp = p.salePrice ?? 0;
    const hasSale = sp > 0;
    const pricePart = `
      <div class="price-cell">
        <span class="price-full${hasSale ? ' has-sale' : ''}" id="pf-${p.id}">${fmtPrice(p.price)}</span>
        <div class="price-sale-row">
          <span class="sale-label">акц.</span>
          <input type="number" class="sale-input${hasSale ? ' active' : ''}" id="si-${p.id}"
            value="${sp}" min="0"
            onchange="updateSalePrice(${p.id}, this)"
            onclick="event.stopPropagation()"/>
          <span class="sale-unit">₴</span>
        </div>
      </div>`;

    const dot = p.colorHex
      ? `<span class="color-dot" style="background:${escHtml(p.colorHex)}" title="${escHtml(p.colorName||'')}"></span>`
      : '';

    return `
    <tr id="row-${p.id}">
      <td>${thumb}</td>
      <td>
        <a href="admin-product.html?id=${p.id}" class="prod-list-name">${escHtml(p.name)}</a>
        <div style="display:flex;align-items:center;gap:.3rem;margin-top:.3rem;flex-wrap:wrap">
          <span class="badge-tag${p.isNew ? ' new-active' : ''}" id="tag-new-${p.id}"
            onclick="toggleTag(${p.id},'isNew')" title="Новинка — клік для перемикання">NEW</span>
          <span class="badge-tag${p.isTop ? ' top-active' : ''}" id="tag-top-${p.id}"
            onclick="toggleTag(${p.id},'isTop')" title="Топ — клік для перемикання">TOP</span>
          <span style="font-size:.68rem;color:var(--muted)"># ${p.id}</span>
        </div>
      </td>
      <td class="price-col">${pricePart}</td>
      <td class="col-colors">
        <div class="prod-colors-row">${dot}</div>
      </td>
      <td class="col-cat" style="font-size:.8125rem;color:var(--muted)">${escHtml(getCatName(p.categoryId))}</td>
      <td style="text-align:center">
        <label class="toggle-switch" title="${p.active ? 'Активний' : 'Прихований'}">
          <input type="checkbox" ${p.active ? 'checked' : ''} onchange="toggleStatus(${p.id}, this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
      </td>
      <td>
        <div style="display:flex;gap:.3rem;justify-content:center">
          <a href="admin-product.html?id=${p.id}" class="tbl-icon-btn" title="Редагувати">
            <i class="bi bi-pencil"></i>
          </a>
          <button class="tbl-icon-btn danger" onclick="openDeleteModal(${p.id})" title="Видалити">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination(pages, filtered.length);
}

function makePhPh() {
  const d = document.createElement('div');
  d.className = 'prod-thumb-ph';
  d.innerHTML = '<i class="bi bi-image"></i>';
  return d;
}

/* ─── Pagination ─── */
function renderPagination(pages, total) {
  const ps  = pageSize();
  const row = document.getElementById('paginationRow');
  if (pages <= 1) { row.style.display = 'none'; return; }
  row.style.display = 'flex';

  const from = (currentPage - 1) * ps + 1;
  const to   = Math.min(currentPage * ps, total);
  let html = `<span class="page-info">${from}–${to} з ${total}</span>`;

  html += `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
    <i class="bi bi-chevron-left" style="font-size:.7rem"></i></button>`;

  const maxBtns = 7;
  let start = Math.max(1, currentPage - Math.floor(maxBtns / 2));
  let end   = Math.min(pages, start + maxBtns - 1);
  if (end - start < maxBtns - 1) start = Math.max(1, end - maxBtns + 1);

  if (start > 1) html += `<button class="page-btn" onclick="goPage(1)">1</button>${start > 2 ? '<span class="page-info">…</span>' : ''}`;
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn${i === currentPage ? ' active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  if (end < pages) html += `${end < pages - 1 ? '<span class="page-info">…</span>' : ''}<button class="page-btn" onclick="goPage(${pages})">${pages}</button>`;

  html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}>
    <i class="bi bi-chevron-right" style="font-size:.7rem"></i></button>`;

  row.innerHTML = html;
}

function goPage(n) {
  const ps = pageSize();
  const pages = Math.max(1, Math.ceil(getFiltered().length / ps));
  currentPage = Math.max(1, Math.min(n, pages));
  renderTable();
  document.querySelector('.admin-section-card')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ─── Stats ─── */
function updateStats() {
  document.getElementById('statTotal').textContent  = products.length;
  document.getElementById('statActive').textContent = products.filter(p => p.active).length;
  document.getElementById('statHidden').textContent = products.filter(p => !p.active).length;
  const uniqueColors = new Set(products.map(p => p.colorHex).filter(Boolean)).size;
  document.getElementById('statColors').textContent = uniqueColors;
}

/* ─── Inline sale price ─── */
async function updateSalePrice(id, input) {
  const val = parseFloat(input.value) || 0;
  input.value = val;
  const p = products.find(p => p.id === id);
  if (!p) return;
  p.salePrice = val > 0 ? val : null;
  if (useApi) {
    await apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  } else {
    save();
  }
  input.classList.toggle('active', val > 0);
  const priceEl = document.getElementById(`pf-${id}`);
  if (priceEl) priceEl.classList.toggle('has-sale', val > 0);
  showToast(val > 0 ? 'Акційну ціну збережено' : 'Акційну ціну видалено');
}

/* ─── Status toggle ─── */
async function toggleStatus(id, isActive) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  p.active = isActive;
  if (useApi) {
    await apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  } else {
    save();
  }
  updateStats();
  showToast(isActive ? 'Товар активовано' : 'Товар приховано');
}

/* ─── Tag toggle (NEW / TOP) ─── */
async function toggleTag(id, tag) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  p[tag] = !p[tag];
  if (useApi) {
    await apiFetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  } else {
    save();
  }
  const key = tag === 'isNew' ? 'new' : 'top';
  const cls = tag === 'isNew' ? 'new-active' : 'top-active';
  const el = document.getElementById(`tag-${key}-${id}`);
  if (el) el.classList.toggle(cls, p[tag]);
  showToast(p[tag] ? `Мітку "${key.toUpperCase()}" встановлено` : `Мітку "${key.toUpperCase()}" знято`);
}

/* ─── Delete ─── */
function openDeleteModal(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  deleteTargetId = id;
  document.getElementById('deleteName').textContent = p.name;
  document.getElementById('deleteModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
  deleteTargetId = null;
}
async function confirmDelete() {
  if (!deleteTargetId) return;
  if (useApi) {
    await apiFetch(`/api/products/${deleteTargetId}`, { method: 'DELETE' });
  }
  products = products.filter(p => p.id !== deleteTargetId);
  if (!useApi) save();
  closeDeleteModal();
  updateStats();
  buildFilterChips();
  renderTable();
  showToast('Товар видалено');
}

/* ─── Toast ─── */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('i').className = type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill';
  t.className = 'admin-toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}

/* ─── Init ─── */
(async () => {
  await loadData();
  updateStats();
  buildFilterChips();
  renderTable();
})();
