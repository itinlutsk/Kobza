!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

/* ---- STEP NAVIGATION ---- */
  const steps = ['formStep1','formStep2','formStep3'];
  const indicators = ['step1Indicator','step2Indicator','step3Indicator'];

  function goToStep(n) {
    steps.forEach((id, i) => {
      document.getElementById(id).style.display = (i === n - 1) ? 'block' : 'none';
    });
    indicators.forEach((id, i) => {
      const el = document.getElementById(id);
      el.classList.toggle('active', i < n);
      el.classList.toggle('done', i < n - 1);
    });
    window.scrollTo({ top: document.getElementById('checkoutMain').offsetTop - 80, behavior: 'smooth' });
  }

  /* ---- DELIVERY TABS ---- */
  const deliveryForms = { nova:'deliveryNova', ukr:'deliveryUkr' };

  function selectDelivery(btn, type) {
    document.querySelectorAll('.checkout-delivery-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(deliveryForms).forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(deliveryForms[type]).style.display = 'block';

    const deliveryCost = document.getElementById('deliveryCost');
    deliveryCost.textContent = 'Безкоштовно від ₴1500';
    deliveryCost.className = 'text-success-custom';
  }

  /* ---- PAYMENT SELECTION ---- */
  function selectPayment(selectedId) {
    ['payCard','payPrivat','payCash','payTransfer'].forEach(id => {
      document.getElementById(id)?.classList.remove('selected');
    });
    document.getElementById(selectedId)?.classList.add('selected');
    document.getElementById('cardFields').style.display = (selectedId === 'payCard') ? 'block' : 'none';
  }

  /* ---- CARD FORMATTING ---- */
  function formatCard(el) {
    let v = el.value.replace(/\D/g,'').substring(0,16);
    el.value = v.replace(/(.{4})/g,'$1 ').trim();
  }

  function formatExpiry(el) {
    let v = el.value.replace(/\D/g,'').substring(0,4);
    if (v.length >= 3) v = v.substring(0,2) + ' / ' + v.substring(2);
    el.value = v;
  }



  /* ---- PLACE ORDER ---- */
  function placeOrder() {
    if (!document.getElementById('agreeTerms').checked) {
      alert('Будь ласка, погодьтесь з умовами оферти');
      return;
    }
    const emailVal = document.getElementById('email').value || 'your@email.com';
    document.getElementById('orderEmail').textContent = emailVal;
    document.getElementById('orderNum').textContent = 'SK-' + String(Math.floor(1000 + Math.random() * 9000));
    document.getElementById('checkoutMain').style.display = 'none';
    const success = document.getElementById('orderSuccess');
    success.style.display = 'block';
    success.className = 'section';
    document.getElementById('cartBadge').textContent = '0';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---- INIT ---- */
  document.getElementById('payCard').classList.add('selected');