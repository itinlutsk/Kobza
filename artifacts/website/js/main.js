/* ========================================
   SKINZ — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky nav: add .scrolled class ── */
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

  /* ── Scroll reveal (simple IntersectionObserver) ── */
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

  /* ── Quantity selector ── */
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const input = this.closest('.qty-selector')?.querySelector('.qty-input');
      if (!input) return;
      const step = this.dataset.action === 'plus' ? 1 : -1;
      const newVal = Math.max(1, parseInt(input.value, 10) + step);
      input.value = newVal;
    });
  });

  /* ── Size selector ── */
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const group = this.closest('.size-options');
      if (!group) return;
      group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── Color swatches ── */
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', function () {
      const group = this.closest('.color-swatches');
      if (!group) return;
      group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── Product tabs ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;
      const parent = this.closest('.product-tabs');
      if (!parent) return;
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const pane = parent.querySelector('#' + target);
      if (pane) pane.classList.add('active');
    });
  });

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

  /* ── Contact form prevent default submit ── */
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

  /* ── Cart button feedback ── */
  document.querySelectorAll('.btn-add-cart, .btn-card-primary').forEach(btn => {
    btn.addEventListener('click', function () {
      const orig = this.innerHTML;
      this.innerHTML = '<i class="bi bi-check-lg"></i> Додано до кошика';
      setTimeout(() => this.innerHTML = orig, 1800);
    });
  });

  /* ── Highlight active nav link ── */
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') && path.endsWith(link.getAttribute('href').split('/').pop())) {
      link.classList.add('active');
    }
  });

});
