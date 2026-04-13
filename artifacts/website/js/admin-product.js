const LS_PRODUCTS   = 'skinz_admin_products';
const LS_CATEGORIES = 'skinz_admin_categories';
const SIZES = ['XS','S','M','L','XL','XXL'];

let prodId     = null;
let product    = null;
let categories = [];
let colorItems = []; // { id, name, hex, expanded, sizes:[{size,stock}] }
let photosSrc  = []; // array of base64/URL strings; index 0 = main
const MAX_PHOTOS = 8;

/* ─── Init ─── */
function init() {
  const params = new URLSearchParams(location.search);
  prodId = params.get('id') ? parseInt(params.get('id')) : null;

  const storedC = localStorage.getItem(LS_CATEGORIES);
  categories = storedC ? JSON.parse(storedC) : [];
  populateCategorySelect();

  if (prodId) {
    const storedP = localStorage.getItem(LS_PRODUCTS);
    const allProds = storedP ? JSON.parse(storedP) : [];
    product = allProds.find(p => p.id === prodId) || null;
  }

  if (product) {
    document.getElementById('pageTitle').textContent       = product.name;
    document.getElementById('breadcrumbName').textContent  = product.name;
    document.title = product.name + ' — SKINZ Адмін';
    document.getElementById('fName').value        = product.name;
    document.getElementById('fPrice').value       = product.price || '';
    document.getElementById('fSalePrice').value   = product.salePrice ?? 0;
    document.getElementById('fCategory').value    = product.categoryId || '';
    document.getElementById('fDescription').value = product.description || '';
    document.getElementById('fActive').checked    = product.active !== false;
    document.getElementById('fIsNew').checked     = !!product.isNew;
    document.getElementById('fIsTop').checked     = !!product.isTop;
    photosSrc = product.photos || (product.photo ? [product.photo] : []);
    colorItems = (product.colors || []).map(c => ({
      id: c.id || uid(),
      name: c.name || '',
      hex: c.hex || '#8B1A2A',
      expanded: true,
      sizes: SIZES.map(sz => {
        const found = (c.sizes || []).find(s => s.size === sz);
        return { size: sz, stock: found ? found.stock : 0 };
      })
    }));
  }

  renderPhotoGrid();
  renderColors();
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

/* ─── Photo gallery ─── */
function renderPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  const countEl = document.getElementById('photoCount');
  if (countEl) countEl.textContent = `${photosSrc.length} / ${MAX_PHOTOS}`;

  let html = photosSrc.map((src, i) => `
    <div class="pg-item">
      <img src="${escHtml(src)}" alt="Фото ${i + 1}" loading="lazy"/>
      ${i === 0 ? '<span class="pg-main-badge">Головне</span>' : ''}
      <button class="pg-remove" onclick="removePhoto(${i})" title="Видалити фото">
        <i class="bi bi-x"></i>
      </button>
    </div>`).join('');

  if (photosSrc.length < MAX_PHOTOS) {
    html += `
    <div class="pg-add" onclick="document.getElementById('photoAddInput').click()">
      <i class="bi bi-plus-lg pg-add-icon"></i>
      <span class="pg-add-label">${photosSrc.length === 0 ? 'Додати фото' : 'Ще фото'}</span>
    </div>`;
  }
  grid.innerHTML = html;
}

function removePhoto(idx) {
  photosSrc.splice(idx, 1);
  renderPhotoGrid();
}

function handleFileSelect(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const remaining = MAX_PHOTOS - photosSrc.length;
  if (remaining <= 0) { showToast(`Максимум ${MAX_PHOTOS} фотографій`, 'error'); return; }
  const toProcess = files.slice(0, remaining);
  let loaded = 0;
  toProcess.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(`Файл "${file.name}" завеликий (макс. 5 МБ)`, 'error');
      loaded++; if (loaded === toProcess.length) renderPhotoGrid();
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      photosSrc.push(e.target.result);
      loaded++;
      if (loaded === toProcess.length) renderPhotoGrid();
    };
    reader.readAsDataURL(file);
  });
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

/* ─── Colors ─── */
function uid() { return 'c_' + Math.random().toString(36).slice(2); }

function addColor() {
  commitDOMValues();
  colorItems.push({
    id: uid(), name: '', hex: '#8B1A2A',
    sizes: SIZES.map(s => ({ size: s, stock: 0 }))
  });
  renderColors();
  setTimeout(() => {
    const tbody = document.getElementById('colorsTbody');
    tbody?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    tbody?.lastElementChild?.querySelector('.color-name-inp')?.focus();
  }, 50);
}

function removeColor(i) {
  commitDOMValues();
  colorItems.splice(i, 1);
  renderColors();
}

function commitDOMValues() {
  document.querySelectorAll('[data-color-idx]').forEach(row => {
    const i = parseInt(row.dataset.colorIdx);
    const c = colorItems[i];
    if (!c) return;
    const nameEl = row.querySelector('.color-name-inp');
    const hexEl  = row.querySelector('input[type="color"]');
    if (nameEl) c.name = nameEl.value;
    if (hexEl)  c.hex  = hexEl.value;
    SIZES.forEach((sz, si) => {
      const inp = row.querySelector(`[data-size="${sz}"]`);
      if (inp) c.sizes[si].stock = parseInt(inp.value) || 0;
    });
  });
}

function renderColors() {
  const tbody = document.getElementById('colorsTbody');
  if (!tbody) return;
  if (colorItems.length === 0) {
    tbody.innerHTML = `<tr class="colors-empty-row"><td colspan="${SIZES.length + 2}">
      <i class="bi bi-palette" style="font-size:1.75rem;opacity:.25;display:block;margin-bottom:.4rem"></i>
      Додайте колір, натиснувши кнопку нижче
    </td></tr>`;
    return;
  }
  tbody.innerHTML = colorItems.map((c, i) => `
    <tr data-color-idx="${i}">
      <td class="td-name">
        <div class="color-name-cell">
          <div class="color-swatch-pick" style="background:${escHtml(c.hex)}" title="Вибрати колір">
            <input type="color" value="${escHtml(c.hex)}"
              oninput="this.parentElement.style.background=this.value"/>
          </div>
          <input type="text" class="color-name-inp" value="${escHtml(c.name)}" placeholder="Назва кольору"/>
        </div>
      </td>
      ${SIZES.map((sz, si) => {
        const stock = c.sizes[si]?.stock ?? 0;
        return `<td><input type="number" class="stock-inp${stock === 0 ? ' zero' : ''}"
          value="${stock}" min="0" data-size="${sz}"
          oninput="this.classList.toggle('zero', !(parseInt(this.value)||0))"/></td>`;
      }).join('')}
      <td>
        <button class="colors-del-btn" onclick="removeColor(${i})" title="Видалити колір">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    </tr>`).join('');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Save ─── */
function saveProduct() {
  commitDOMValues();

  const name  = document.getElementById('fName').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value) || 0;
  if (!name)  { showToast('Введіть назву товару', 'error'); return; }
  if (!price) { showToast('Введіть ціну товару', 'error'); return; }

  const storedP  = localStorage.getItem(LS_PRODUCTS);
  let products   = storedP ? JSON.parse(storedP) : [];
  const nextId   = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const data = {
    id:          prodId || nextId,
    name,
    price,
    salePrice:   parseFloat(document.getElementById('fSalePrice').value) || null,
    description: document.getElementById('fDescription').value.trim(),
    categoryId:  parseInt(document.getElementById('fCategory').value) || null,
    active:      document.getElementById('fActive').checked,
    isNew:       document.getElementById('fIsNew').checked,
    isTop:       document.getElementById('fIsTop').checked,
    photos:      photosSrc,
    colors:      colorItems.map(c => ({
      id:    c.id,
      name:  c.name,
      hex:   c.hex,
      sizes: c.sizes
    }))
  };

  if (prodId) {
    const idx = products.findIndex(p => p.id === prodId);
    if (idx >= 0) products[idx] = data;
    else products.push(data);
  } else {
    products.push(data);
  }

  localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  showToast('Товар збережено ✓');
  setTimeout(() => location.href = 'admin-products.html', 900);
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