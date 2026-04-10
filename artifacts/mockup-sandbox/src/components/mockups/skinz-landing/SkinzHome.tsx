import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, ChevronDown, X, Menu } from "lucide-react";

const products = [
  { id: 1, name: "Сет Бра Baby & Стрінги Baby 2.1", price: "₴5,600", badges: ["Limited", "NEW"], img1: "linear-gradient(135deg, #f5e6d3 0%, #e8c9a8 100%)", img2: "linear-gradient(135deg, #e8c9a8 0%, #d4a574 100%)" },
  { id: 2, name: "Комплект EX", price: "₴13,460", badges: ["NEW"], img1: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)", img2: "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)" },
  { id: 3, name: "Комплект: Топ EX & Легінси Batis", price: "₴9,700", badges: ["NEW"], img1: "linear-gradient(135deg, #d4c5b0 0%, #c2b09a 100%)", img2: "linear-gradient(135deg, #c2b09a 0%, #b09880 100%)" },
  { id: 4, name: "Сет Бра Baby & Стрінги Baby 2.1 Candy", price: "₴5,600", badges: ["Limited", "NEW"], img1: "linear-gradient(135deg, #f8d7da 0%, #f0b8be 100%)", img2: "linear-gradient(135deg, #f0b8be 0%, #e89aa0 100%)" },
  { id: 5, name: "Топ AI", price: "₴5,500", badges: ["NEW"], img1: "linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%)", img2: "linear-gradient(135deg, #d4d4d4 0%, #c0c0c0 100%)" },
  { id: 6, name: "Топ Snap 2.0", price: "₴5,500", badges: ["NEW"], img1: "linear-gradient(135deg, #c8d8e8 0%, #b0c4d8 100%)", img2: "linear-gradient(135deg, #b0c4d8 0%, #98b0c8 100%)" },
  { id: 7, name: "Комплект: Топ Bri & Лосини Base 3.0", price: "₴8,500", badges: ["NEW"], img1: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", img2: "linear-gradient(135deg, #16213e 0%, #0f3460 100%)" },
  { id: 8, name: "Комбінезон SAVAYA", price: "₴6,700", badges: ["NEW"], img1: "linear-gradient(135deg, #3d2314 0%, #5c3520 100%)", img2: "linear-gradient(135deg, #5c3520 0%, #7a4830 100%)" },
  { id: 9, name: "Комбінезон ZN 3.0", price: "Від ₴7,500", badges: [], img1: "linear-gradient(135deg, #2d4a22 0%, #3d6330 100%)", img2: "linear-gradient(135deg, #3d6330 0%, #4e7c3e 100%)" },
  { id: 10, name: "Сет Бра Baby & Стрінги Baby 2.1", price: "₴5,600", badges: ["Limited"], img1: "linear-gradient(135deg, #f5d5c8 0%, #edbeae 100%)", img2: "linear-gradient(135deg, #edbeae 0%, #e5a898 100%)" },
  { id: 11, name: "Комбінезон-сукня Appi", price: "₴6,300", badges: [], img1: "linear-gradient(135deg, #e8d5e8 0%, #d4b8d4 100%)", img2: "linear-gradient(135deg, #d4b8d4 0%, #c09bc0 100%)" },
  { id: 12, name: "Купальник XX", price: "₴4,500", badges: [], img1: "linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 100%)", img2: "linear-gradient(135deg, #2d2d2d 0%, #3e3e3e 100%)" },
  { id: 13, name: "Парфум Skinz", price: "₴4,500", badges: [], img1: "linear-gradient(135deg, #f0e6d0 0%, #e4d4b8 100%)", img2: "linear-gradient(135deg, #e4d4b8 0%, #d8c2a0 100%)" },
  { id: 14, name: "Комбінезон GS 2.0", price: "₴7,100", badges: [], img1: "linear-gradient(135deg, #4a3728 0%, #5e4835 100%)", img2: "linear-gradient(135deg, #5e4835 0%, #725944 100%)" },
  { id: 15, name: "Комбінезон Kitty", price: "₴5,900", badges: [], img1: "linear-gradient(135deg, #c8c0d8 0%, #b4aac8 100%)", img2: "linear-gradient(135deg, #b4aac8 0%, #a094b8 100%)" },
  { id: 16, name: "Боді Anse", price: "₴5,600", badges: [], img1: "linear-gradient(135deg, #e0d8c8 0%, #cdc4b0 100%)", img2: "linear-gradient(135deg, #cdc4b0 0%, #bab098 100%)" },
];

const lookbook = [
  { caption: "Anastasia Burlaka in Arzani Top & Skirt Asit & Gloves Skinz", img: "linear-gradient(180deg, #c8b89a 0%, #a89070 100%)" },
  { caption: "Anastasia Burlaka in Arzani Top & Skirt Asit & Gloves Skinz", img: "linear-gradient(180deg, #b89880 0%, #987860 100%)" },
  { caption: "Anna Trincher in dress Noir & sleeves Yansy", img: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)" },
  { caption: "Anna Trincher in swimsuit XX", img: "linear-gradient(180deg, #2a2a2a 0%, #3d3d3d 100%)" },
  { caption: "Daria Kvitkova in Anse bodysuit & Anse skirt", img: "linear-gradient(180deg, #d0c8b8 0%, #b8b0a0 100%)" },
  { caption: "Mari Ferrari in jumpsuit Damemaz", img: "linear-gradient(180deg, #3a2820 0%, #4d3828 100%)" },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      style={{ background: "#fff", cursor: "pointer", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: hovered ? product.img2 : product.img1,
            transition: "background 0.5s ease",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          {product.badges.map((b) => (
            <span
              key={b}
              style={{
                display: "inline-block",
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                padding: "3px 8px",
                fontWeight: 500,
                background: b === "Limited" ? "#1a1a1a" : "transparent",
                color: b === "Limited" ? "#fff" : "#1a1a1a",
                border: b === "NEW" ? "1px solid #1a1a1a" : "none",
              }}
            >
              {b}
            </span>
          ))}
        </div>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <Heart size={18} fill={wishlisted ? "#e74c3c" : "none"} stroke={wishlisted ? "#e74c3c" : "#333"} />
        </button>
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(255,255,255,0.95)", padding: "12px",
            textAlign: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
          }}
        >
          <button style={{ background: "none", border: "none", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer", color: "#1a1a1a", fontWeight: 500 }}>
            Швидко додати
          </button>
        </div>
      </div>
      <div style={{ padding: "14px 12px 20px" }}>
        <p style={{ fontSize: 13, fontWeight: 400, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.4 }}>{product.name}</p>
        <p style={{ fontSize: 13, color: "#1a1a1a" }}>{product.price}</p>
      </div>
    </div>
  );
}

export function SkinzHome() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    document.head.appendChild(link);
    return () => { link.remove(); };
  }, []);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: "#fff", color: "#1a1a1a", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link-custom {
          font-size: 13px;
          letter-spacing: 0.05em;
          color: #1a1a1a;
          text-decoration: none;
          text-transform: uppercase;
          font-weight: 400;
          padding-bottom: 2px;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .nav-link-custom:hover { border-bottom-color: #1a1a1a; }

        .lookbook-item { position: relative; overflow: hidden; cursor: pointer; }
        .lookbook-item:hover .lookbook-inner { transform: scale(1.04); }
        .lookbook-inner { transition: transform 0.5s ease; }
        .lookbook-caption { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.55)); padding: 40px 14px 14px; color: #fff; font-size: 11px; letter-spacing: 0.04em; opacity: 0; transition: opacity 0.3s; }
        .lookbook-item:hover .lookbook-caption { opacity: 1; }

        .icon-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; color: #1a1a1a; }
        .icon-btn:hover { opacity: 0.6; }

        .hero-cta-btn {
          background: #fff; color: #1a1a1a; border: none;
          padding: 14px 36px; font-size: 12px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer; font-weight: 500;
          transition: background 0.2s, color 0.2s;
        }
        .hero-cta-btn:hover { background: #1a1a1a; color: #fff; }

        .hero-cta-outline {
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.5);
          padding: 14px 36px; font-size: 12px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          transition: background 0.2s;
        }
        .hero-cta-outline:hover { background: rgba(255,255,255,0.15); }

        .footer-link { font-size: 12px; color: #888; text-decoration: none; letter-spacing: 0.04em; display: block; margin-bottom: 10px; }
        .footer-link:hover { color: #fff; }
        .social-link { font-size: 11px; color: #666; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; }
        .social-link:hover { color: #fff; }

        .newsletter-input:focus { outline: none; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.03em", position: "relative" }}>
        <div style={{ flex: 1 }} />
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "#888", letterSpacing: "0.04em" }}>
          Безкоштовна доставка від ₴2,000
        </div>
        <div
          style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1a1a1a" }}
          onClick={() => setLangOpen(!langOpen)}
        >
          Українська <ChevronDown size={11} />
          {langOpen && (
            <div style={{ position: "absolute", top: "100%", right: 0, background: "#fff", border: "1px solid #e0e0e0", minWidth: 120, zIndex: 999, marginTop: 4 }}>
              <div style={{ padding: "10px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Українська</div>
              <div style={{ padding: "10px 16px", fontSize: 12, cursor: "pointer" }}>English</div>
            </div>
          )}
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <a href="#" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#1a1a1a" }}>SKINZ</a>
        <div style={{ display: "flex", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
          {["Каталог", "Нове", "Комплекти", "Розпродаж", "Про нас"].map((l) => (
            <a key={l} href="#" className="nav-link-custom">{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="icon-btn" onClick={() => setSearchOpen(true)}><Search size={20} /></button>
          <button className="icon-btn"><Heart size={20} /></button>
          <button className="icon-btn"><ShoppingBag size={20} /></button>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.98)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 600 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 32, color: "#888", textAlign: "center" }}>пошук...</p>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #1a1a1a", paddingBottom: 8 }}>
              <Search size={18} style={{ marginRight: 12, color: "#888" }} />
              <input
                style={{ flex: 1, border: "none", outline: "none", fontSize: 20, background: "transparent" }}
                placeholder="Пошук товарів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="icon-btn" onClick={() => setSearchOpen(false)}><X size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* HERO BANNER 1 */}
      <div style={{ width: "100%", background: "#f0ebe4", overflow: "hidden" }}>
        <div style={{
          width: "100%", height: 540,
          background: "linear-gradient(135deg, #e8ddd0 0%, #d4c5b2 30%, #c2b09a 60%, #b09882 100%)",
          display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 80
        }}>
          <div style={{ textAlign: "right", color: "#fff" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 12, color: "rgba(255,255,255,0.7)" }}>Нова Колекція 2025</p>
            <h1 style={{ fontSize: 52, fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: 16, fontStyle: "italic" }}>Колекція<br />весна — літо</h1>
            <button className="hero-cta-btn">Переглянути</button>
          </div>
        </div>
      </div>

      {/* HERO BANNER 2 */}
      <div style={{ width: "100%" }}>
        <div style={{
          width: "100%", height: 320,
          background: "linear-gradient(120deg, #1a1a1a 0%, #2d2d2d 40%, #3d3d3d 70%, #1a1a1a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: 12, color: "rgba(255,255,255,0.55)" }}>Exclusive Drop</p>
            <h2 style={{ fontSize: 36, fontWeight: 300, letterSpacing: "0.08em", marginBottom: 24 }}>Limited Edition</h2>
            <button className="hero-cta-outline">Дивитися</button>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div style={{ padding: "48px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 400, color: "#1a1a1a", marginBottom: 32, textAlign: "center" }}>Всі товари</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#e8e8e8" }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* LOOKBOOK */}
      <div style={{ padding: "0 0 48px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, fontWeight: 400, color: "#1a1a1a", marginBottom: 32, textAlign: "center" }}>Lookbook</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e8e8e8" }}>
          {lookbook.map((item, i) => (
            <div key={i} className="lookbook-item">
              <div className="lookbook-inner" style={{ width: "100%", aspectRatio: "2/3", background: item.img }} />
              <div className="lookbook-caption">{item.caption}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES BAR */}
      <div style={{ borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8", padding: "28px 24px", display: "flex", justifyContent: "center", gap: 60 }}>
        {[
          { title: "Безкоштовна доставка", desc: "від ₴2,000" },
          { title: "Легке повернення", desc: "протягом 14 днів" },
          { title: "Оригінальний товар", desc: "власне виробництво" },
          { title: "Підтримка 24/7", desc: "в Instagram та Telegram" },
        ].map((f, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, fontWeight: 500, marginBottom: 4 }}>{f.title}</p>
            <p style={{ fontSize: 11, color: "#888", letterSpacing: "0.04em" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* NEWSLETTER */}
      <div style={{ padding: "56px 24px", textAlign: "center", background: "#f8f6f3" }}>
        <h3 style={{ fontSize: 22, fontWeight: 300, letterSpacing: "0.05em", marginBottom: 8 }}>Будьте першими</h3>
        <p style={{ fontSize: 12, color: "#888", letterSpacing: "0.05em", marginBottom: 28 }}>Підписуйтесь і отримуйте -10% на перше замовлення</p>
        <div style={{ display: "flex", justifyContent: "center", maxWidth: 440, margin: "0 auto" }}>
          <input
            className="newsletter-input"
            placeholder="Ваш email"
            style={{ flex: 1, border: "1px solid #d4d4d4", borderRight: "none", padding: "12px 16px", fontSize: 12, letterSpacing: "0.04em", background: "#fff" }}
          />
          <button style={{ background: "#1a1a1a", color: "#fff", border: "none", padding: "12px 24px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer", whiteSpace: "nowrap" }}>
            Підписатися
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a1a", color: "#fff", padding: "48px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 16 }}>SKINZ</div>
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.8, maxWidth: 260 }}>Український бренд жіночого одягу. Ми створюємо речі, які підкреслюють вашу індивідуальність та красу.</p>
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 500 }}>Магазин</p>
            {["Каталог", "Нові надходження", "Розпродаж", "Комплекти", "Lookbook"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 500 }}>Інформація</p>
            {["Про нас", "Доставка та оплата", "Повернення", "Розмірна сітка", "Блог"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: 16, fontWeight: 500 }}>Підтримка</p>
            {["Instagram", "Telegram", "TikTok", "Email нам", "FAQ"].map((l) => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.04em" }}>© 2025 SKINZ. Всі права захищені.</p>
          <div style={{ display: "flex", gap: 16 }}>
            {["Instagram", "Telegram", "TikTok"].map((s) => (
              <a key={s} href="#" className="social-link">{s}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["VISA", "MC", "APPLE PAY", "GOOGLE PAY"].map((p) => (
              <span key={p} style={{ background: "#333", color: "#aaa", fontSize: 9, padding: "3px 8px", letterSpacing: "0.06em", borderRadius: 2 }}>{p}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
