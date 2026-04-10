import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, Menu, ArrowRight, Star, Truck, RefreshCcw, ShieldCheck, HeadphonesIcon, Facebook, Instagram, Twitter } from 'lucide-react';

export function SkinzHome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="oksamyt-theme font-sans" style={{ minHeight: '100vh', backgroundColor: '#faf8f5', color: '#2c2c2c' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap');

        :root {
          --cream: #faf8f5;
          --blush: #f2d5d5;
          --terracotta: #c17754;
          --warm-sand: #e8d5b7;
          --charcoal: #2c2c2c;
          --light-gray: #f0f0f0;
        }

        .oksamyt-theme {
          font-family: 'Montserrat', sans-serif;
          background-color: var(--cream);
          color: var(--charcoal);
        }

        .font-serif {
          font-family: 'Playfair Display', serif;
        }

        h1, h2, h3, h4, h5, h6, .brand-logo {
          font-family: 'Playfair Display', serif;
        }

        /* Navbar */
        .custom-navbar {
          transition: all 0.3s ease;
          background-color: transparent;
          padding: 1.5rem 0;
        }
        .custom-navbar.scrolled {
          background-color: rgba(250, 248, 245, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.8rem 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .nav-link {
          color: var(--charcoal) !important;
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0.5rem;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--terracotta);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: var(--terracotta) !important;
        }

        /* Buttons */
        .btn-terracotta {
          background-color: var(--terracotta);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }
        .btn-terracotta:hover {
          background-color: #a66242;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(193, 119, 84, 0.3);
        }

        .btn-outline-charcoal {
          border: 1px solid var(--charcoal);
          color: var(--charcoal);
          padding: 0.75rem 2rem;
          border-radius: 0;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          background: transparent;
        }
        .btn-outline-charcoal:hover {
          background-color: var(--charcoal);
          color: var(--cream);
        }

        /* Hero */
        .hero-section {
          height: 100vh;
          min-height: 600px;
          background: linear-gradient(135deg, var(--warm-sand) 0%, var(--blush) 100%);
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-shape {
          position: absolute;
          right: -10%;
          top: -10%;
          width: 60%;
          height: 120%;
          background: linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
          border-radius: 50% 0 0 50%;
          backdrop-filter: blur(5px);
        }

        /* Product Cards */
        .product-card {
          border: none;
          background: transparent;
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .product-img-wrapper {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          background-color: var(--light-gray);
          margin-bottom: 1rem;
        }
        .product-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-img-placeholder {
          transform: scale(1.05);
        }
        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 2;
          transition: all 0.2s;
        }
        .wishlist-btn:hover {
          transform: scale(1.1);
        }
        .badge-new {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: var(--charcoal);
          color: white;
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 2;
        }
        .size-pill {
          display: inline-block;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 50%;
          font-size: 0.7rem;
          margin-right: 4px;
          color: #777;
        }
        .add-to-cart-btn {
          position: absolute;
          bottom: -50px;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.9);
          border: none;
          padding: 10px 0;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          transition: all 0.3s;
          opacity: 0;
        }
        .product-card:hover .add-to-cart-btn {
          bottom: 0;
          opacity: 1;
        }
        .add-to-cart-btn:hover {
          background: var(--terracotta);
          color: white;
        }

        /* Categories */
        .category-card {
          position: relative;
          height: 400px;
          overflow: hidden;
          cursor: pointer;
        }
        .category-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s ease;
        }
        .category-card:hover .category-bg {
          transform: scale(1.08);
        }
        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        .category-card:hover .category-overlay {
          background: rgba(0,0,0,0.4);
        }
        .category-title {
          color: white;
          font-size: 2rem;
          letter-spacing: 2px;
          position: relative;
          padding-bottom: 10px;
        }
        .category-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background-color: white;
          transition: width 0.3s ease;
        }
        .category-card:hover .category-title::after {
          width: 100%;
        }

        /* Sale Banner */
        .sale-banner {
          background: linear-gradient(rgba(193, 119, 84, 0.9), rgba(193, 119, 84, 0.9)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop') center/cover;
          color: white;
          padding: 100px 0;
          text-align: center;
        }

        /* Brands */
        .brands-strip {
          background-color: white;
          padding: 40px 0;
          border-top: 1px solid var(--light-gray);
          border-bottom: 1px solid var(--light-gray);
        }
        .brand-item {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #999;
          transition: color 0.3s;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .brand-item:hover {
          color: var(--charcoal);
        }

        /* Reviews */
        .review-card {
          background: white;
          padding: 2rem;
          height: 100%;
          border: 1px solid var(--light-gray);
          position: relative;
        }
        .quote-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          color: var(--blush);
          opacity: 0.3;
          font-size: 4rem;
          font-family: serif;
          line-height: 1;
        }

        /* Footer */
        .footer {
          background-color: var(--charcoal);
          color: var(--cream);
          padding: 80px 0 30px;
        }
        .footer-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          color: var(--warm-sand);
        }
        .footer-link {
          color: #bbb;
          text-decoration: none;
          display: block;
          margin-bottom: 0.8rem;
          transition: color 0.3s;
          font-size: 0.9rem;
        }
        .footer-link:hover {
          color: white;
        }
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.1);
          color: white;
          margin-right: 10px;
          transition: all 0.3s;
        }
        .social-icon:hover {
          background-color: var(--terracotta);
          transform: translateY(-3px);
        }
        .newsletter-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--charcoal);
          border-radius: 0;
          padding: 10px 0;
          box-shadow: none !important;
          color: var(--charcoal);
        }
        .newsletter-input:focus {
          border-bottom-color: var(--terracotta);
          background: transparent;
        }
        .newsletter-input::placeholder {
          color: #999;
        }
      `}} />

      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg fixed-top custom-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container px-4">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="brand-logo fs-3 fw-bold tracking-widest" style={{ letterSpacing: '4px' }}>ОКСАМИТ</span>
          </a>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <Menu size={28} />
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="#">Каталог</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Нове</a></li>
              <li className="nav-item"><a className="nav-link text-danger" href="#">Розпродаж</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Бренди</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Блог</a></li>
            </ul>
            
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <button className="btn btn-link text-dark p-1 shadow-none"><Search size={20} /></button>
              <button className="btn btn-link text-dark p-1 shadow-none"><Heart size={20} /></button>
              <button className="btn btn-link text-dark p-1 position-relative shadow-none" onClick={addToCart}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '0.6rem', transform: 'translate(-30%, 10%)' }}>
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="btn btn-link text-dark text-decoration-none text-uppercase fs-6 fw-medium ms-2 d-none d-sm-block shadow-none" style={{ letterSpacing: '1px' }}>Увійти</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-shape d-none d-lg-block"></div>
        <div className="container position-relative z-1 px-4">
          <div className="row align-items-center">
            <div className="col-lg-7 py-5">
              <span className="d-block mb-3 text-uppercase fw-semibold" style={{ letterSpacing: '3px', color: '#8c523a' }}>Весна 2025</span>
              <h1 className="display-2 font-serif fw-bold mb-4 lh-sm">
                НОВА КОЛЕКЦІЯ <br />
                <span style={{ color: 'var(--terracotta)' }}>ЕЛЕГАНТНОСТІ</span>
              </h1>
              <p className="lead mb-5 fs-5" style={{ maxWidth: '500px', color: '#555' }}>
                Стиль для кожної жінки. Відкрийте для себе речі, які стануть основою вашого гардеробу на роки.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <button className="btn btn-terracotta">
                  Дивитись колекцію <ArrowRight size={18} className="ms-2" />
                </button>
                <button className="btn btn-outline-charcoal">
                  Переглянути відео
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Strip */}
      <section className="py-5 bg-white border-bottom">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <Truck size={32} className="mb-3" style={{ color: 'var(--terracotta)' }} />
              <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Безкоштовна доставка</h6>
              <p className="text-muted small mb-0">Від 2000 грн</p>
            </div>
            <div className="col-6 col-md-3">
              <RefreshCcw size={32} className="mb-3" style={{ color: 'var(--terracotta)' }} />
              <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Легкий повернення</h6>
              <p className="text-muted small mb-0">Протягом 14 днів</p>
            </div>
            <div className="col-6 col-md-3">
              <ShieldCheck size={32} className="mb-3" style={{ color: 'var(--terracotta)' }} />
              <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Оригінальний товар</h6>
              <p className="text-muted small mb-0">Гарантія якості</p>
            </div>
            <div className="col-6 col-md-3">
              <HeadphonesIcon size={32} className="mb-3" style={{ color: 'var(--terracotta)' }} />
              <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Онлайн-підтримка</h6>
              <p className="text-muted small mb-0">24/7 консультації</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-serif fw-bold mb-3">Нові Надходження</h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--terracotta)', margin: '0 auto' }}></div>
          </div>

          <div className="row g-4">
            {[
              { id: 1, name: 'Сукня Florentine', price: '3 450', color: 'linear-gradient(135deg, #e8d5b7, #d4c2a4)', isNew: true },
              { id: 2, name: 'Блуза Ivory Silk', price: '1 890', color: 'linear-gradient(135deg, #faf8f5, #e6e4e1)', isNew: true },
              { id: 3, name: 'Джинси Straight Cut', price: '2 150', color: 'linear-gradient(135deg, #8ba3b5, #6c869a)', isNew: false },
              { id: 4, name: 'Пальто Cashmere Blend', price: '4 850', color: 'linear-gradient(135deg, #c17754, #a66242)', isNew: true },
              { id: 5, name: 'Костюм двійка', price: '3 900', color: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)', isNew: false },
              { id: 6, name: 'Плаття з вирізом', price: '2 750', color: 'linear-gradient(135deg, #7a2b38, #5c1f28)', isNew: true },
              { id: 7, name: 'Кардиган Soft Touch', price: '1 650', color: 'linear-gradient(135deg, #9baf93, #7f9378)', isNew: false },
              { id: 8, name: 'Тренч класичний', price: '4 200', color: 'linear-gradient(135deg, #d2b48c, #ba9c76)', isNew: false },
            ].map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <div className="product-card">
                  <div className="product-img-wrapper">
                    {product.isNew && <div className="badge-new">Новинка</div>}
                    <button 
                      className="wishlist-btn" 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    >
                      <Heart size={18} fill={wishlist[product.id] ? "var(--terracotta)" : "none"} color={wishlist[product.id] ? "var(--terracotta)" : "currentColor"} />
                    </button>
                    <div className="product-img-placeholder" style={{ background: product.color }}>
                    </div>
                    <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(); }}>
                      В кошик
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="fs-6 fw-semibold mb-1">{product.name}</h3>
                    <div className="mb-2">
                      <span className="size-pill">XS</span>
                      <span className="size-pill">S</span>
                      <span className="size-pill">M</span>
                      <span className="size-pill">L</span>
                    </div>
                    <p className="fw-bold mb-0" style={{ color: 'var(--terracotta)' }}>₴ {product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <button className="btn btn-outline-charcoal">Переглянути всі</button>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-2">
        <div className="container-fluid px-2">
          <div className="row g-2">
            {[
              { title: 'Плаття', color: '#b5938d' },
              { title: 'Верхній одяг', color: '#8a7d72' },
              { title: 'Аксесуари', color: '#c4a77d' },
              { title: 'Спортивний стиль', color: '#6b7a85' },
            ].map((cat, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="category-card">
                  <div className="category-bg" style={{ backgroundColor: cat.color, backgroundImage: `linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))` }}></div>
                  <div className="category-overlay">
                    <h3 className="category-title font-serif">{cat.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="sale-banner my-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h4 className="text-uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>Спеціальна пропозиція</h4>
              <h2 className="display-4 font-serif fw-bold mb-4">ВЕСНЯНИЙ РОЗПРОДАЖ — ДО -40%</h2>
              <p className="lead mb-5 opacity-75">Оновіть свій гардероб зі знижками на вибрані моделі з минулих колекцій.</p>
              <button className="btn btn-outline-light btn-lg px-5 rounded-0 text-uppercase tracking-widest border-2" style={{ letterSpacing: '2px' }}>
                Переглянути акції
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="brands-strip text-center">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-4">
            {['Zara', 'Mango', 'Massimo Dutti', 'Reserved', 'H&M', 'Boss'].map((brand, i) => (
              <div key={i} className="brand-item fw-bold px-3">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-5 my-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 font-serif fw-bold mb-3">Відгуки Клієнтів</h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--terracotta)', margin: '0 auto' }}></div>
          </div>

          <div className="row g-4">
            {[
              { name: 'Олена М.', text: 'Чудова якість! Замовляла пальто, сіло ідеально. Дуже приємне обслуговування та швидка доставка. Обов\'язково повернуся ще.', rating: 5 },
              { name: 'Марія К.', text: 'Сукня просто неймовірна, матеріал дуже приємний до тіла. Розмірна сітка повністю відповідає дійсності. Дякую!', rating: 5 },
              { name: 'Ірина В.', text: 'Мій улюблений магазин. Завжди знаходжу тут щось особливе для себе. Базові речі служать роками і не втрачають вигляд.', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="col-md-4">
                <div className="review-card shadow-sm">
                  <div className="quote-icon">"</div>
                  <div className="d-flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#c17754" color="#c17754" className="me-1" />
                    ))}
                  </div>
                  <p className="fst-italic mb-4" style={{ color: '#666', lineHeight: 1.6 }}>"{review.text}"</p>
                  <h6 className="fw-bold text-uppercase mb-0" style={{ letterSpacing: '1px' }}>{review.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5" style={{ backgroundColor: 'var(--blush)' }}>
        <div className="container py-4">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h2 className="font-serif fw-bold mb-3">Приєднуйтесь до нашого клубу</h2>
              <p className="mb-4 text-dark opacity-75">Дізнавайтесь першими про нові колекції, закриті розпродажі та модні поради.</p>
              <form className="d-flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input type="email" className="form-control newsletter-input flex-grow-1" placeholder="Ваш email..." required />
                <button type="submit" className="btn btn-dark rounded-0 px-4 text-uppercase tracking-widest" style={{ letterSpacing: '1px' }}>Підписатися</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-4 pe-lg-5">
              <h3 className="brand-logo fs-3 fw-bold mb-4" style={{ letterSpacing: '4px', color: 'var(--cream)' }}>ОКСАМИТ</h3>
              <p className="mb-4 opacity-75" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                ОКСАМИТ — це більше ніж просто магазин одягу. Це простір, де стиль зустрічається з комфортом, а якість стає доступною кожній жінці.
              </p>
              <div className="d-flex">
                <a href="#" className="social-icon"><Instagram size={18} /></a>
                <a href="#" className="social-icon"><Facebook size={18} /></a>
                <a href="#" className="social-icon"><Twitter size={18} /></a>
              </div>
            </div>
            
            <div className="col-6 col-md-4 col-lg-2 offset-lg-1">
              <h5 className="footer-title">Магазин</h5>
              <a href="#" className="footer-link">Новинки</a>
              <a href="#" className="footer-link">Одяг</a>
              <a href="#" className="footer-link">Взуття</a>
              <a href="#" className="footer-link">Аксесуари</a>
              <a href="#" className="footer-link" style={{ color: 'var(--terracotta)' }}>Розпродаж</a>
            </div>
            
            <div className="col-6 col-md-4 col-lg-2">
              <h5 className="footer-title">Інформація</h5>
              <a href="#" className="footer-link">Про нас</a>
              <a href="#" className="footer-link">Блог</a>
              <a href="#" className="footer-link">Відгуки</a>
              <a href="#" className="footer-link">Контакти</a>
            </div>
            
            <div className="col-md-4 col-lg-3">
              <h5 className="footer-title">Підтримка</h5>
              <a href="#" className="footer-link">Доставка та оплата</a>
              <a href="#" className="footer-link">Обмін та повернення</a>
              <a href="#" className="footer-link">Таблиця розмірів</a>
              <a href="#" className="footer-link">FAQ</a>
            </div>
          </div>
          
          <div className="border-top pt-4 text-center text-md-start d-md-flex justify-content-between align-items-center opacity-50" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
            <p className="mb-0 small">© 2025 ОКСАМИТ. Всі права захищені.</p>
            <div className="mt-3 mt-md-0 small">
              <a href="#" className="text-white text-decoration-none me-3">Політика конфіденційності</a>
              <a href="#" className="text-white text-decoration-none">Умови використання</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
