/* ========================================
   SKINZ — Main JavaScript
   ======================================== */

/* ── Apply saved theme immediately (prevents flash) ── */
(function () {
  const saved = localStorage.getItem('skinz-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ── Theme toggle (desktop + mobile) ── */
  const updateThemeIcon = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) icon.className = isLight ? 'bi bi-moon' : 'bi bi-sun';
      btn.title = isLight ? 'Темна тема' : 'Світла тема';
    });
  };
  updateThemeIcon();
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
      localStorage.setItem('skinz-theme', isLight ? 'dark' : 'light');
      updateThemeIcon();
    });
  });

  /* ── Sticky nav ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Back to top ── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll reveal ── */
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.aos-fade').forEach(el => observer.observe(el));

  /* ── Wishlist toggle ── */
  document.querySelectorAll('.product-card-wishlist').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      this.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon) icon.className = this.classList.contains('active') ? 'bi bi-heart-fill' : 'bi bi-heart';
    });
  });

  /* ── Quantity selector (.qty-minus / .qty-plus → .qty-value span) ── */
  document.querySelectorAll('.qty-selector').forEach(selector => {
    const minusBtn = selector.querySelector('.qty-minus');
    const plusBtn  = selector.querySelector('.qty-plus');
    const valueEl  = selector.querySelector('.qty-value');
    if (!valueEl) return;

    const getVal = () => parseInt(valueEl.textContent, 10) || 1;

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        const v = Math.max(1, getVal() - 1);
        valueEl.textContent = v;
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        valueEl.textContent = getVal() + 1;
      });
    }
  });

  /* ── Size selector (.size-selector → .size-btn) ── */
  document.querySelectorAll('.size-selector').forEach(group => {
    group.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        if (this.disabled) return;
        group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const label = document.getElementById('selectedSize');
        if (label) label.textContent = this.textContent.trim();
      });
    });
  });

  /* ── Color swatches (.color-selector → .color-swatch) ── */
  document.querySelectorAll('.color-selector').forEach(group => {
    group.querySelectorAll('.color-swatch').forEach(sw => {
      sw.addEventListener('click', function () {
        group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
        const label = document.getElementById('selectedColor');
        if (label) label.textContent = this.getAttribute('title') || '';
      });
    });
  });

  /* ── Product tabs (.product-tab → .product-tab-content) ── */
  document.querySelectorAll('.product-tab').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;
      const parent = this.closest('.product-tabs');
      if (!parent) return;
      parent.querySelectorAll('.product-tab').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.product-tab-content').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const pane = parent.querySelector('#' + target);
      if (pane) pane.classList.add('active');
    });
  });

  /* ── Add to cart (product detail page only) ── */
  const productInfoPanel = document.querySelector('.product-info');
  const addCartBtn = productInfoPanel ? productInfoPanel.querySelector('.btn-add-cart') : null;
  const cartFeedback = document.getElementById('cartFeedback');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', function () {
      if (cartFeedback) {
        cartFeedback.classList.add('show');
        setTimeout(() => cartFeedback.classList.remove('show'), 3000);
      }
      const badge = document.querySelector('.cart-badge');
      if (badge) badge.textContent = (parseInt(badge.textContent, 10) || 0) + 1;
    });
  }

  /* ── Mobile filter toggle ── */
  const filterToggle = document.querySelector('.filter-toggle-btn');
  const filterSidebar = document.querySelector('.filter-sidebar');
  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', function () {
      filterSidebar.classList.toggle('show');
      const icon = this.querySelector('i');
      if (icon) icon.className = filterSidebar.classList.contains('show') ? 'bi bi-x-lg' : 'bi bi-sliders';
    });
  }

  /* ── Contact form ── */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Надіслано!';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3000);
      }
    });
  }

  /* ── Active nav link highlight ── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop().split('?')[0];
    if (page && path.endsWith(page)) {
      link.classList.add('active');
    }
  });

});

/* ── Global addToCart for catalog card buttons ── */
function addToCart(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-check-lg"></i> Додано!';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 1800);
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = (parseInt(badge.textContent, 10) || 0) + 1;
}
