!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

const PRICES = { qty1: 890, qty2: 1290 };

  function changeQty(id, delta) {
    const input = document.getElementById(id);
    input.value = Math.max(1, parseInt(input.value) + delta);
    updateCart();
  }

  function updateCart() {
    const i1 = document.getElementById('cartItem1')?.style.display !== 'none';
    const i2 = document.getElementById('cartItem2')?.style.display !== 'none';
    const q1 = parseInt(document.getElementById('qty1')?.value || 0);
    const q2 = parseInt(document.getElementById('qty2')?.value || 0);

    const sub  = (i1 ? q1 * PRICES.qty1 : 0) + (i2 ? q2 * PRICES.qty2 : 0);
    const disc = i1 ? 100 : 0;
    const count = (i1 ? q1 : 0) + (i2 ? q2 : 0);

    document.getElementById('subtotal').textContent = '₴' + sub.toLocaleString('uk-UA');
    document.getElementById('discount').textContent = disc > 0 ? '−₴' + disc : '₴0';
    document.getElementById('total').textContent = '₴' + (sub - disc).toLocaleString('uk-UA');
    document.getElementById('cartBadge').textContent = count;
    document.getElementById('cartCountLabel').textContent = '(' + count + ' ' + noun(count, 'товар', 'товари', 'товарів') + ')';

    if (count === 0) showEmptyCart();
  }

  function noun(n, one, few, many) {
    if (n % 10 === 1 && n % 100 !== 11) return one;
    if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return few;
    return many;
  }

  function removeItem(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; updateCart(); }, 300);
  }

  function clearCart() {
    ['cartItem1','cartItem2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    showEmptyCart();
  }

  function showEmptyCart() {
    document.getElementById('cartFilled').style.display = 'none';
    document.getElementById('cartEmpty').style.display = 'block';
    document.getElementById('cartBadge').textContent = '0';
  }

  function addToCart(btn) {
    const badge = document.getElementById('cartBadge');
    badge.textContent = parseInt(badge.textContent || 0) + 1;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Додано';
    btn.style.background = 'var(--color-success)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
  }