!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

const wishIds = ['wish1','wish2','wish3','wish4'];

  function removeWish(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; updateWishCount(); }, 300);
  }

  function updateWishCount() {
    const visible = wishIds.filter(id => {
      const el = document.getElementById(id);
      return el && el.style.display !== 'none';
    }).length;

    document.getElementById('wishBadge').textContent = visible;
    document.getElementById('wishCountLabel').textContent = '(' + visible + ' ' + noun(visible, 'товар', 'товари', 'товарів') + ')';

    if (visible === 0) {
      document.getElementById('wishlistFilled').style.display = 'none';
      document.getElementById('wishlistFilled2').style.display = 'none';
      document.getElementById('wishlistEmpty').style.display = 'block';
      document.getElementById('wishBadge').textContent = '0';
    }
  }

  function clearWishlist() {
    wishIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    document.getElementById('wishlistFilled').style.display = 'none';
    document.getElementById('wishlistFilled2').style.display = 'none';
    document.getElementById('wishlistEmpty').style.display = 'block';
    document.getElementById('wishBadge').textContent = '0';
  }

  function addAllToCart() {
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Додано до кошика';
    setTimeout(() => { btn.innerHTML = '<i class="bi bi-bag-plus"></i> Додати все до кошика'; }, 2000);
  }

  function addToCart(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Додано';
    btn.style.background = 'var(--color-success)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
  }

  function noun(n, one, few, many) {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return few;
    return many;
  }