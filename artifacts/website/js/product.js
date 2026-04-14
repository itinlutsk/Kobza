!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

const thumbs = new Swiper('#productGalleryThumbs', {
    slidesPerView: 5,
    spaceBetween: 8,
    watchSlidesProgress: true,
    freeMode: true,
  });
  new Swiper('#productGalleryMain', {
    spaceBetween: 10,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    thumbs: { swiper: thumbs },
  });

  // Size selection + cart logic (color is chosen via separate product page links)
  (function(){
    let selectedSize = null;

    const sizeLabel = document.getElementById('selectedSize');
    const cartBtn   = document.getElementById('addToCartBtn');
    const hint      = document.getElementById('selectionHint');
    const feedback  = document.getElementById('cartFeedback');

    function updateCartBtn(){
      cartBtn.disabled       = !selectedSize;
      cartBtn.style.opacity  = selectedSize ? '1'   : '0.45';
      cartBtn.style.cursor   = selectedSize ? 'pointer' : 'not-allowed';
      if(selectedSize) hint.style.display = 'none';
    }

    // Size buttons
    document.querySelectorAll('.size-btn:not(.out-of-stock)').forEach(btn => {
      btn.addEventListener('click', function(){
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedSize = this.textContent.trim();
        sizeLabel.textContent = selectedSize;
        sizeLabel.style.color = '';
        updateCartBtn();
      });
    });

    // Qty
    const qtyValue = document.querySelector('.qty-value');
    const qtyMinus = document.querySelector('.qty-minus');
    const qtyPlus  = document.querySelector('.qty-plus');
    let qty = 1;
    if(qtyMinus) qtyMinus.addEventListener('click', ()=>{ if(qty>1){ qty--; qtyValue.textContent=qty; } });
    if(qtyPlus)  qtyPlus.addEventListener('click',  ()=>{ qty++; qtyValue.textContent=qty; });

    // Add to cart
    cartBtn.addEventListener('click', function(){
      if(!selectedSize){ hint.style.display = 'block'; return; }
      feedback.style.display = 'flex';
      setTimeout(() => feedback.style.display = 'none', 3000);
      const badge = document.querySelector('.cart-badge');
      if(badge) badge.textContent = parseInt(badge.textContent||0) + qty;
    });

    updateCartBtn();
  })();
