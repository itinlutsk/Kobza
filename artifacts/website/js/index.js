!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

(function(){
  const section = document.getElementById('whyUs');
  if(!section) return;
  const heading   = section.querySelector('.why-heading');
  const stat      = section.querySelector('.why-stat');
  const line      = section.querySelector('.why-header-line');
  const items     = section.querySelectorAll('.why-item');
  const counter   = document.getElementById('whyCounter');
  let counted = false;

  function animateCount(el, target, dur){
    let start = null;
    function step(ts){
      if(!start) start = ts;
      const p = Math.min((ts-start)/dur, 1);
      const ease = 1 - Math.pow(1-p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString('uk-UA');
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('uk-UA');
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        heading && heading.classList.add('wh-visible');
        stat    && stat.classList.add('wh-visible');
        line    && line.classList.add('wh-visible');
        items.forEach(it => it.classList.add('wh-visible'));
        if(!counted && counter){ counted=true; animateCount(counter, 15000, 1800); }
        obs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  obs.observe(section);
})();

/* ── Seasonal Hero Slider ── */
  (function() {
    const m = new Date().getMonth(); // 0-11
    const season = (m >= 2 && m <= 4) ? 'spring'
                 : (m >= 5 && m <= 7) ? 'summer'
                 : (m >= 8 && m <= 10) ? 'autumn'
                 : 'winter';

    const data = {
      spring: [
        { img:'images/slider/spring-01.png', eyebrow:'Весняна колекція 2026', title:'Свіжість,<br>що <span>пробуджує</span>', desc:'Перше тепло — час оновити гардероб. Легкі тканини, жіночні силуети.', btn:'Переглянути колекцію' },
        { img:'images/slider/spring-02.png', eyebrow:'Нові надходження', title:'Весна<br><span>у кожній деталі</span>', desc:'Квіткові мотиви та ніжні відтінки для вашого найкращого образу.', btn:'Дивитись каталог' },
        { img:'images/slider/spring-03.png', eyebrow:'Ексклюзивно від SKINZ', title:'Прокидайтесь<br><span>красивими</span>', desc:'Одяг, що підкреслює природну красу: зручний крій та якісні матеріали.', btn:'Обрати образ' },
        { img:'images/slider/spring-04.png', eyebrow:'Весна 2026', title:'Жіночність<br><span>у кожному кроці</span>', desc:'Відчуйте легкість та комфорт нової сезонної колекції SKINZ.', btn:'Переглянути новинки' },
        { img:'images/slider/spring-05.png', eyebrow:'Тільки у SKINZ', title:'Ваш весняний<br><span>образ</span>', desc:'Від легкої сукні до стильного боді — все для вашого гардеробу.', btn:'До каталогу' }
      ],
      summer: [
        { img:'images/slider/summer-01.png', eyebrow:'Літня колекція 2026', title:'Літо,<br>що <span>надихає</span>', desc:'Лінія для активних, впевнених та стильних. Дихаючі тканини на кожен день.', btn:'Переглянути колекцію' },
        { img:'images/slider/summer-02.png', eyebrow:'Нові надходження', title:'Сонце<br><span>у кожній деталі</span>', desc:'Яскраві кольори та легкі силуети для найтеплішого сезону.', btn:'Дивитись каталог' },
        { img:'images/slider/summer-03.png', eyebrow:'Ексклюзивно від SKINZ', title:'Свобода<br><span>і стиль</span>', desc:'Колекція, що поєднує комфорт і елегантність у спекотні дні.', btn:'Обрати образ' },
        { img:'images/slider/summer-04.png', eyebrow:'Літо 2026', title:'Легкість<br><span>у кожному образі</span>', desc:'Натуральні тканини та вільний крій — формула ідеального літа.', btn:'Переглянути новинки' },
        { img:'images/slider/summer-05.png', eyebrow:'Тільки у SKINZ', title:'Ваш літній<br><span>образ</span>', desc:'Зустрічайте нові враження у стильному вбранні від SKINZ.', btn:'До каталогу' }
      ],
      autumn: [
        { img:'images/slider/autumn-01.png', eyebrow:'Колекція осінь–зима 2025', title:'Стиль, що<br>говорить <span>без слів</span>', desc:'Одяг для жінки, яка знає собі ціну. Природні тканини, бездоганний крій.', btn:'Переглянути колекцію' },
        { img:'images/slider/autumn-02.png', eyebrow:'Нові надходження', title:'Осінь<br><span>з новим поглядом</span>', desc:'Глибокі відтінки та лаконічні форми для впевненого жіночого образу.', btn:'Дивитись каталог' },
        { img:'images/slider/autumn-03.png', eyebrow:'Ексклюзивно від SKINZ', title:'Тепло<br><span>у кожній деталі</span>', desc:'М\'яка вовна та преміальні тканини — для комфорту в прохолодні дні.', btn:'Обрати образ' },
        { img:'images/slider/autumn-04.png', eyebrow:'Осінь 2025', title:'Елегантність<br><span>без зусиль</span>', desc:'Лаконічні силуети та нейтральна палітра — основа осіннього гардеробу.', btn:'Переглянути новинки' },
        { img:'images/slider/autumn-05.png', eyebrow:'Тільки у SKINZ', title:'Ваш осінній<br><span>образ</span>', desc:'Від класичного пальта до стильного кардигану — все в одному місці.', btn:'До каталогу' }
      ],
      winter: [
        { img:'images/slider/winter-01.png', eyebrow:'Зимова колекція 2025', title:'Витонченість<br><span>у кожній деталі</span>', desc:'Преміальний жіночий одяг для тих, хто цінує якість та бездоганний крій.', btn:'Переглянути колекцію' },
        { img:'images/slider/winter-02.png', eyebrow:'Нові надходження', title:'Зима<br><span>у стильному вбранні</span>', desc:'Казкові образи та тепло — зимова колекція SKINZ для кожного дня.', btn:'Дивитись каталог' },
        { img:'images/slider/winter-03.png', eyebrow:'Ексклюзивно від SKINZ', title:'Тепло<br><span>і краса поруч</span>', desc:'Якісні тканини та перевірений крій для найхолоднішого сезону.', btn:'Обрати образ' },
        { img:'images/slider/winter-04.png', eyebrow:'Зима 2025', title:'Елегантна<br><span>зима з SKINZ</span>', desc:'Пальта, светри та кардигани — тепло та стиль у кожній моделі.', btn:'Переглянути новинки' },
        { img:'images/slider/winter-05.png', eyebrow:'Тільки у SKINZ', title:'Ваш зимовий<br><span>образ</span>', desc:'Зберіть ідеальний зимовий гардероб з новою колекцією SKINZ.', btn:'До каталогу' }
      ]
    };

    const wrapper = document.getElementById('heroSwiperWrapper');
    data[season].forEach(function(s) {
      wrapper.innerHTML +=
        '<div class="swiper-slide hero-slide" style="background-image:url(\'' + s.img + '\')">' +
          '<div class="hero-slide-overlay"></div>' +
          '<div class="container-xl h-100">' +
            '<div class="hero-slide-inner">' +
              '<div class="hero-eyebrow">' + s.eyebrow + '</div>' +
              '<h1 class="hero-title">' + s.title + '</h1>' +
              '<p class="hero-desc">' + s.desc + '</p>' +
              '<div class="hero-btns">' +
                '<a href="pages/catalog.html" class="btn-accent btn-lg-custom">' + s.btn + ' <i class="bi bi-arrow-right"></i></a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });
  })();

  /* ── Swiper init (after slides are injected) ── */
  new Swiper('#heroSwiper', {
    loop: true,
    speed: 800,
    autoplay: { delay: 5000, disableOnInteraction: false },
    navigation: { nextEl: '.hero-swiper-next', prevEl: '.hero-swiper-prev' },
    pagination: { el: '.hero-swiper-pagination', clickable: true },
    effect: 'fade',
    fadeEffect: { crossFade: true }
  });