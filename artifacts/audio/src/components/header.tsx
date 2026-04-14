import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/stages", label: "Етапи роботи" },
  { href: "/portfolio", label: "Об'єкти / Кейси" },
  { href: "/about", label: "Про компанію" },
  { href: "/contacts", label: "Контакти" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-lg" data-testid="header">
      <div className="flex items-stretch min-h-[72px]">
        {/* Red logo panel */}
        <div className="bg-[#f23030] flex items-center px-5 lg:px-8 shrink-0">
          <Link href="/" data-testid="link-logo">
            <span className="text-white text-xl lg:text-2xl font-extrabold tracking-tight cursor-pointer select-none uppercase leading-none">
              Волин<br />
              <span className="text-[rgba(255,255,255,0.85)] font-bold text-base lg:text-lg">Аудіо</span>
            </span>
          </Link>
        </div>

        {/* Dark nav panel */}
        <div className="bg-[#1e1d1c] flex-1 flex items-center justify-between px-4 lg:px-8">
          <nav className="hidden lg:flex items-center gap-0" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.href.replace("/", "") || "home"}`}
              >
                <span
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-200 cursor-pointer border-b-2 ${
                    location === link.href
                      ? "text-[#f23030] border-[#f23030]"
                      : "text-[#ddd] border-transparent hover:text-[#f23030] hover:border-[#f23030]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            <a
              href="tel:+380971234567"
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#aaa] hover:text-[#f23030] transition-colors whitespace-nowrap"
              data-testid="link-phone"
            >
              <Phone size={13} />
              <span>+380 (97) 123-45-67</span>
            </a>

            <Link href="/contacts" data-testid="button-order-header">
              <button className="hidden lg:block btn-red text-xs font-bold px-4 py-2.5 cursor-pointer whitespace-nowrap">
                Замовити послугу
              </button>
            </Link>

            <button
              className="lg:hidden p-2 text-[#aaa] hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="button-menu-toggle"
              aria-label="Меню"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div
          className="lg:hidden bg-[#252525] border-t border-[#333] px-4 py-4"
          data-testid="nav-mobile"
        >
          <nav className="flex flex-col gap-0.5 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-mobile-nav-${link.href.replace("/", "") || "home"}`}
              >
                <span
                  className={`block px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer border-l-4 ${
                    location === link.href
                      ? "border-[#f23030] text-[#f23030] bg-[#1e1d1c]"
                      : "border-transparent text-[#ccc] hover:border-[#f23030] hover:text-[#f23030]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-3 border-t border-[#333]">
            <a
              href="tel:+380971234567"
              className="flex items-center gap-2 text-sm text-[#aaa]"
              data-testid="link-phone-mobile"
            >
              <Phone size={15} />
              +380 (97) 123-45-67
            </a>
            <Link href="/contacts" data-testid="button-order-mobile">
              <button className="w-full btn-red text-sm font-bold px-4 py-3 cursor-pointer">
                Замовити послугу
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
