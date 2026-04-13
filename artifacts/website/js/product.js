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

  // Color + Size selection with cart enable logic
  (function(){
    let selectedColor = null;
    let selectedSize  = null;

    const colorLabel  = document.getElementById('selectedColor');
    const sizeLabel   = document.getElementById('selectedSize');
    const cartBtn     = document.getElementById('addToCartBtn');
    const hint        = document.getElementById('selectionHint');
    const feedback    = document.getElementById('cartFeedback');

    function updateCartBtn(){
      const ready = selectedColor && selectedSize;
      cartBtn.disabled = !ready;
      cartBtn.style.opacity  = ready ? '1'   : '0.45';
      cartBtn.style.cursor   = ready ? 'pointer' : 'not-allowed';
      if(ready) hint.style.display = 'none';
    }

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(btn => {
      btn.addEventListener('click', function(){
        document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedColor = this.dataset.color || this.getAttribute('title');
        colorLabel.textContent = selectedColor;
        colorLabel.style.color = '';
        updateCartBtn();
      });
    });

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

    // Add to cart
    cartBtn.addEventListener('click', function(){
      if(!selectedColor || !selectedSize){
        hint.style.display = 'block';
        return;
      }
      feedback.style.display = 'flex';
      setTimeout(() => feedback.style.display = 'none', 3000);
      // Update cart badge
      const badge = document.querySelector('.cart-badge');
      if(badge) badge.textContent = parseInt(badge.textContent||0) + 1;
    });

    updateCartBtn();
  })();