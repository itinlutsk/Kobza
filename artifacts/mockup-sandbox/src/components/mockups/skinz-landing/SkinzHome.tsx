import React, { useEffect } from 'react';
import { ShoppingCart, Search, Menu, Star, ShieldCheck, Zap, TrendingUp, Award, ChevronRight, User } from 'lucide-react';

export function SkinzHome() {
  return (
    <div className="skinz-theme text-light font-sans" style={{ minHeight: '100vh', backgroundColor: '#0a0a12' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        .skinz-theme {
          font-family: 'Montserrat', sans-serif;
          color: #f8f9fa;
        }

        .skinz-theme h1, .skinz-theme h2, .skinz-theme h3, .skinz-theme h4, .skinz-theme h5 {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Custom Colors */
        .bg-dark-1 { background-color: #0a0a12 !important; }
        .bg-dark-2 { background-color: #12121e !important; }
        .bg-dark-3 { background-color: #1a1a2e !important; }
        
        .text-neon-cyan { color: #00d4ff !important; }
        .text-neon-purple { color: #b148ff !important; }
        
        .border-neon-cyan { border-color: #00d4ff !important; }
        
        /* Buttons */
        .btn-neon-cyan {
          background: linear-gradient(45deg, #00d4ff, #0088ff);
          color: #fff;
          font-weight: 700;
          border: none;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .btn-neon-cyan:hover {
          background: linear-gradient(45deg, #00e5ff, #0099ff);
          box-shadow: 0 0 25px rgba(0, 212, 255, 0.6);
          color: #fff;
          transform: translateY(-2px);
        }

        .btn-outline-neon {
          border: 2px solid #00d4ff;
          color: #00d4ff;
          background: transparent;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-outline-neon:hover {
          background: rgba(0, 212, 255, 0.1);
          color: #fff;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
        }

        /* Navigation */
        .skinz-navbar {
          background-color: rgba(10, 10, 18, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .skinz-nav-link {
          color: #adb5bd;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .skinz-nav-link:hover, .skinz-nav-link.active {
          color: #00d4ff;
        }

        /* Hero */
        .hero-section {
          background: radial-gradient(circle at 70% 50%, rgba(124, 58, 237, 0.15) 0%, rgba(10, 10, 18, 1) 60%),
                      url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-blend-mode: overlay;
          padding: 120px 0 80px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Search */
        .search-input {
          background-color: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .search-input:focus {
          background-color: #1a1a2e;
          border-color: #00d4ff;
          box-shadow: 0 0 0 0.25rem rgba(0, 212, 255, 0.25);
          color: #fff;
        }

        /* Cards */
        .skinz-card {
          background-color: #12121e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .skinz-card:hover {
          transform: translateY(-5px);
          border-color: #00d4ff;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
        }

        /* Rarity Gradients */
        .rarity-covert { background: radial-gradient(circle, rgba(235,75,75,0.8) 0%, #12121e 70%); } /* Red */
        .rarity-classified { background: radial-gradient(circle, rgba(211,44,230,0.8) 0%, #12121e 70%); } /* Pink/Purple */
        .rarity-restricted { background: radial-gradient(circle, rgba(136,71,255,0.8) 0%, #12121e 70%); } /* Purple */
        .rarity-milspec { background: radial-gradient(circle, rgba(75,105,255,0.8) 0%, #12121e 70%); } /* Blue */
        .rarity-contraband { background: radial-gradient(circle, rgba(228,174,57,0.8) 0%, #12121e 70%); } /* Gold/Orange */

        .rarity-text-covert { color: #eb4b4b; }
        .rarity-text-classified { color: #d32ce6; }
        .rarity-text-restricted { color: #8847ff; }
        .rarity-text-milspec { color: #4b69ff; }
        .rarity-text-contraband { color: #e4ae39; }

        .skin-img-placeholder {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          position: relative;
        }

        /* Marquee */
        .marquee-container {
          overflow: hidden;
          background-color: #0a0a12;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          white-space: nowrap;
          padding: 10px 0;
        }
        .marquee-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Categories */
        .category-card {
          background-color: #1a1a2e;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          min-width: 160px;
        }
        .category-card:hover {
          border-color: #00d4ff;
          background-color: #12121e;
          color: #00d4ff;
        }

        /* Utilities */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .footer {
          background-color: #050508;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg skinz-navbar fixed-top py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <Zap className="text-neon-cyan" size={28} />
            <span className="fs-3 fw-bold text-white tracking-widest">SKIN<span className="text-neon-cyan">Z</span></span>
          </a>
          
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <Menu className="text-white" />
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
              <li className="nav-item">
                <a className="nav-link skinz-nav-link active" href="#">Каталог</a>
              </li>
              <li className="nav-item">
                <a className="nav-link skinz-nav-link" href="#">CS2</a>
              </li>
              <li className="nav-item">
                <a className="nav-link skinz-nav-link text-neon-cyan" href="#">Акції <Award size={14} className="ms-1" /></a>
              </li>
              <li className="nav-item">
                <a className="nav-link skinz-nav-link" href="#">Депозит</a>
              </li>
              <li className="nav-item">
                <a className="nav-link skinz-nav-link" href="#">Виведення</a>
              </li>
            </ul>
            
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative d-none d-lg-block">
                <input type="text" className="form-control search-input rounded-pill ps-4 pe-5 py-2" placeholder="Пошук скінів..." />
                <Search className="position-absolute top-50 end-0 translate-middle-y me-3 text-secondary" size={18} />
              </div>
              
              <button className="btn position-relative p-2 text-white border-0 shadow-none">
                <ShoppingCart size={22} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  2
                </span>
              </button>
              
              <button className="btn btn-outline-neon rounded-pill px-4 py-2 d-none d-sm-block">Увійти</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-center text-lg-start">
        <div className="container">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-6 py-5">
              <div className="badge border border-neon-cyan text-neon-cyan rounded-pill px-3 py-2 mb-4 bg-dark bg-opacity-50">
                <ShieldCheck size={16} className="me-2 d-inline" />
                Гарантія безпечних угод
              </div>
              <h1 className="display-3 fw-black text-white mb-4 lh-1">
                НАЙКРАЩІ СКІНИ <br />
                <span className="text-neon-cyan text-gradient">ДЛЯ CS2</span>
              </h1>
              <p className="lead text-secondary mb-5 fs-5">
                Купуй, продавай та обмінюй ігрові предмети миттєво. Найнижчі комісії та миттєве виведення коштів на українські картки.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <button className="btn btn-neon-cyan btn-lg rounded-pill px-5 py-3 fs-6">
                  ПЕРЕЙТИ ДО КАТАЛОГУ <ChevronRight size={18} className="ms-1" />
                </button>
                <button className="btn btn-dark btn-lg border border-secondary rounded-pill px-5 py-3 fs-6 text-white">
                  ПРОДАТИ СКІНИ
                </button>
              </div>
              
              <div className="d-flex gap-4 mt-5 pt-3 justify-content-center justify-content-lg-start">
                <div>
                  <h3 className="fw-bold mb-0">1.2M+</h3>
                  <span className="text-secondary small">Успішних угод</span>
                </div>
                <div className="vr bg-secondary opacity-25"></div>
                <div>
                  <h3 className="fw-bold mb-0">50K+</h3>
                  <span className="text-secondary small">Активних користувачів</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block position-relative">
              {/* Decorative Hero Elements */}
              <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-neon-cyan opacity-10 blur-3xl rounded-circle" style={{ filter: 'blur(100px)' }}></div>
              <div className="position-relative text-center">
                <div className="skin-img-placeholder rarity-covert mx-auto" style={{ width: '400px', height: '300px', borderRadius: '20px', transform: 'rotate(15deg) scale(1.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(235,75,75,0.3)' }}>
                  <div className="d-flex flex-column align-items-center">
                    <span className="fs-1">AWP</span>
                    <span className="fs-4 fw-normal text-white-50">Dragon Lore</span>
                  </div>
                </div>
                <div className="skin-img-placeholder rarity-restricted position-absolute top-50 start-0" style={{ width: '250px', height: '180px', borderRadius: '15px', transform: 'rotate(-20deg) translateY(-50%) translateX(-20%)', zIndex: -1, opacity: 0.8 }}>
                  <div className="d-flex flex-column align-items-center">
                    <span className="fs-3">Glock-18</span>
                    <span className="fs-6 fw-normal text-white-50">Fade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="marquee-container">
        <div className="marquee-content d-flex gap-5 align-items-center">
          {Array(3).fill([
            { name: "AK-47 | Redline", price: "₴ 850", time: "1 хв тому" },
            { name: "M4A4 | Howl", price: "₴ 125,000", time: "3 хв тому" },
            { name: "Karambit | Fade", price: "₴ 45,200", time: "5 хв тому" },
            { name: "AWP | Asiimov", price: "₴ 3,100", time: "8 хв тому" },
            { name: "USP-S | Kill Confirmed", price: "₴ 2,400", time: "12 хв тому" }
          ]).flat().map((item, i) => (
            <div key={i} className="d-flex align-items-center gap-2">
              <span className="text-secondary small">{item.time}</span>
              <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-2">Куплено</span>
              <span className="fw-bold">{item.name}</span>
              <span className="text-neon-cyan">{item.price}</span>
              <span className="mx-3 text-secondary">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-5 bg-dark-1 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h2 className="mb-0 fs-3">Категорії</h2>
            <a href="#" className="text-neon-cyan text-decoration-none small fw-bold text-uppercase">Всі категорії <ChevronRight size={14} /></a>
          </div>
          
          <div className="d-flex gap-3 overflow-auto pb-3 hide-scrollbar">
            {['Ножі', 'Рукавички', 'Гвинтівки', 'Пістолети', 'SMG', 'Важка зброя', 'Агенти', 'Кейси'].map((cat, i) => (
              <div key={i} className="category-card flex-shrink-0">
                <div className="fs-5 fw-bold mb-1">{cat}</div>
                <div className="text-secondary small">{Math.floor(Math.random() * 5000) + 100} предметів</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-5 bg-dark-2">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="mb-2 fs-2 d-flex align-items-center gap-2">
                <TrendingUp className="text-neon-cyan" /> Популярні скіни
              </h2>
              <p className="text-secondary mb-0">Найбільш затребувані предмети на ринку зараз</p>
            </div>
            <div className="d-none d-md-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 active">Всі</button>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Ножі</button>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Гвинтівки</button>
            </div>
          </div>

          <div className="row g-4">
            {[
              { name: "AK-47", skin: "Redline", rarity: "covert", rarityName: "Таємне", wear: "Field-Tested", price: "850", rating: 4.8 },
              { name: "AWP", skin: "Dragon Lore", rarity: "contraband", rarityName: "Контрабанда", wear: "Factory New", price: "245,000", rating: 5.0 },
              { name: "Butterfly Knife", skin: "Doppler", rarity: "covert", rarityName: "Таємне", wear: "Factory New", price: "52,400", rating: 4.9 },
              { name: "M4A1-S", skin: "Hot Rod", rarity: "classified", rarityName: "Засекречене", wear: "Minimal Wear", price: "12,300", rating: 4.7 },
              { name: "Desert Eagle", skin: "Blaze", rarity: "restricted", rarityName: "Заборонене", wear: "Factory New", price: "18,500", rating: 4.9 },
              { name: "Glock-18", skin: "Fade", rarity: "restricted", rarityName: "Заборонене", wear: "Factory New", price: "45,000", rating: 4.8 },
              { name: "Karambit", skin: "Fade", rarity: "covert", rarityName: "Таємне", wear: "Factory New", price: "68,200", rating: 5.0 },
              { name: "USP-S", skin: "Kill Confirmed", rarity: "covert", rarityName: "Таємне", wear: "Field-Tested", price: "2,450", rating: 4.6 }
            ].map((item, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="skinz-card h-100 d-flex flex-column position-relative">
                  <div className="position-absolute top-0 end-0 p-2 z-1">
                    <div className="badge bg-dark bg-opacity-75 border border-secondary rounded-pill d-flex align-items-center gap-1">
                      <Star size={10} className="text-warning fill-warning" /> {item.rating}
                    </div>
                  </div>
                  
                  <div className={`skin-img-placeholder rarity-${item.rarity}`}>
                    <div className="d-flex flex-column align-items-center text-center px-3">
                      <span className="fs-4 lh-1">{item.name}</span>
                      <span className="fs-6 fw-normal text-white-75 mt-1">{item.skin}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className={`small fw-bold rarity-text-${item.rarity}`}>{item.rarityName}</div>
                      <div className="small text-secondary">{item.wear}</div>
                    </div>
                    
                    <h5 className="mb-0 fs-6 text-truncate">{item.name} | {item.skin}</h5>
                    
                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                      <div className="fs-5 fw-bold text-white">₴ {item.price}</div>
                      <button className="btn btn-sm btn-outline-neon rounded-pill px-3">Купити</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <button className="btn btn-outline-secondary btn-lg rounded-pill px-5">Показати більше</button>
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-5 position-relative overflow-hidden" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, #7c3aed 0%, transparent 100%)', opacity: 0.1 }}></div>
        <div className="container position-relative py-4">
          <div className="row align-items-center bg-dark-2 rounded-4 border border-neon-cyan p-4 p-md-5 box-shadow-neon">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <div className="badge bg-neon-cyan text-dark rounded-pill px-3 py-2 mb-3 fw-bold">🔥 ФЛЕШ-РОЗПРОДАЖ</div>
              <h2 className="display-5 fw-black mb-3 text-white">ЗНИЖКИ ДО <span className="text-neon-cyan">40%</span> НА НОЖІ</h2>
              <p className="lead text-secondary mb-4">Тільки наступні 24 години. Отримай додатковий бонус 5% при поповненні балансу криптою.</p>
              
              <div className="d-flex gap-3 mb-4">
                <div className="bg-dark rounded p-2 text-center" style={{ minWidth: '60px' }}>
                  <div className="fs-3 fw-bold text-neon-cyan">12</div>
                  <div className="small text-secondary text-uppercase">Годин</div>
                </div>
                <div className="fs-3 fw-bold text-secondary mt-2">:</div>
                <div className="bg-dark rounded p-2 text-center" style={{ minWidth: '60px' }}>
                  <div className="fs-3 fw-bold text-neon-cyan">45</div>
                  <div className="small text-secondary text-uppercase">Хвилин</div>
                </div>
                <div className="fs-3 fw-bold text-secondary mt-2">:</div>
                <div className="bg-dark rounded p-2 text-center" style={{ minWidth: '60px' }}>
                  <div className="fs-3 fw-bold text-neon-cyan">30</div>
                  <div className="small text-secondary text-uppercase">Секунд</div>
                </div>
              </div>
              
              <button className="btn btn-neon-cyan btn-lg rounded-pill px-5">ПЕРЕГЛЯНУТИ ПРОПОЗИЦІЇ</button>
            </div>
            <div className="col-lg-5 text-center">
              <div className="skin-img-placeholder rarity-covert mx-auto rounded-circle" style={{ width: '300px', height: '300px', boxShadow: '0 0 50px rgba(235,75,75,0.4)' }}>
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-2">Karambit</span>
                  <span className="fs-5 fw-normal text-white-50 mt-2">Doppler</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-dark-1">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fs-2 mb-3">Чому обирають <span className="text-neon-cyan">SKINZ</span></h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>Ми забезпечуємо найкращий досвід торгівлі ігровими предметами в Україні з максимальним рівнем безпеки та комфорту.</p>
          </div>
          
          <div className="row g-4">
            {[
              { icon: <ShieldCheck size={32} />, title: "Безпечно", desc: "Всі угоди захищені нашою системою P2P трейду. Нульовий ризик скаму." },
              { icon: <Zap size={32} />, title: "Швидко", desc: "Миттєве зарахування предметів та автоматичне виведення коштів 24/7." },
              { icon: <TrendingUp size={32} />, title: "Вигідно", desc: "Найнижча комісія на ринку - всього від 3% на продаж предметів." },
              { icon: <Award size={32} />, title: "Гарантія", desc: "100% гарантія отримання товару або повернення коштів." }
            ].map((feature, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="p-4 bg-dark-2 rounded-4 h-100 border text-center transition-all" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="d-inline-flex p-3 bg-dark-3 rounded-circle text-neon-cyan mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="fs-5 mb-3">{feature.title}</h4>
                  <p className="text-secondary small mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer pt-5 pb-4">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-4">
              <a className="navbar-brand d-flex align-items-center gap-2 mb-3" href="#">
                <Zap className="text-neon-cyan" size={28} />
                <span className="fs-3 fw-bold text-white tracking-widest">SKIN<span className="text-neon-cyan">Z</span></span>
              </a>
              <p className="text-secondary small pe-lg-5 mb-4">
                SKINZ.COM.UA — найбільший український маркетплейс ігрових предметів CS2. Купуй, продавай та обмінюй скіни швидко та безпечно.
              </p>
              <div className="d-flex gap-3">
                <div className="bg-dark-2 p-2 rounded text-secondary hover-text-white cursor-pointer"><span className="fw-bold px-2">TG</span></div>
                <div className="bg-dark-2 p-2 rounded text-secondary hover-text-white cursor-pointer"><span className="fw-bold px-2">IG</span></div>
                <div className="bg-dark-2 p-2 rounded text-secondary hover-text-white cursor-pointer"><span className="fw-bold px-2">TT</span></div>
                <div className="bg-dark-2 p-2 rounded text-secondary hover-text-white cursor-pointer"><span className="fw-bold px-2">YT</span></div>
              </div>
            </div>
            
            <div className="col-6 col-md-3 col-lg-2">
              <h5 className="fs-6 mb-4">Маркетплейс</h5>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Каталог</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Продати скіни</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Купити скіни</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Акції</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">VIP Статус</a></li>
              </ul>
            </div>
            
            <div className="col-6 col-md-3 col-lg-2">
              <h5 className="fs-6 mb-4">Інформація</h5>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Про нас</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">FAQ</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Відгуки</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Комісії</a></li>
                <li><a href="#" className="text-secondary text-decoration-none hover-text-neon">Блог</a></li>
              </ul>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <h5 className="fs-6 mb-4">Підписка на новини</h5>
              <p className="text-secondary small mb-3">Отримуй ексклюзивні промокоди та сповіщення про знижки першим.</p>
              <div className="input-group mb-3">
                <input type="email" className="form-control bg-dark-2 border-secondary text-white shadow-none" placeholder="Ваш Email" />
                <button className="btn btn-neon-cyan px-3" type="button">Підписатись</button>
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
            <p className="text-secondary small mb-3 mb-md-0">
              &copy; {new Date().getFullYear()} SKINZ.COM.UA. Всі права захищені. Не пов'язано з Valve Corp.
            </p>
            <div className="d-flex gap-3 text-secondary small">
              <a href="#" className="text-secondary text-decoration-none">Умови використання</a>
              <span>•</span>
              <a href="#" className="text-secondary text-decoration-none">Політика приватності</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
