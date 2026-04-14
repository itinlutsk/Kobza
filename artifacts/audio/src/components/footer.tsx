import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/stages", label: "Етапи роботи" },
  { href: "/portfolio", label: "Об'єкти / Кейси" },
  { href: "/about", label: "Про компанію" },
  { href: "/contacts", label: "Контакти" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1e1d1c] pt-14 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="text-2xl font-extrabold text-white mb-1 uppercase leading-none">
              Волин
            </div>
            <div className="text-base font-bold text-[#f23030] uppercase mb-4">Аудіо</div>
            <p className="text-[#888] text-sm leading-relaxed mb-5">
              Професійна інтеграція звукового, світлового та конференційного обладнання на Волині з 2004 року.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/volynaudio" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#333] flex items-center justify-center text-[#888] hover:border-[#f23030] hover:text-[#f23030] transition-colors" data-testid="link-facebook" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com/volynaudio" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#333] flex items-center justify-center text-[#888] hover:border-[#f23030] hover:text-[#f23030] transition-colors" data-testid="link-instagram" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com/@volynaudio" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#333] flex items-center justify-center text-[#888] hover:border-[#f23030] hover:text-[#f23030] transition-colors" data-testid="link-youtube" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-5">Навігація</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} data-testid={`link-footer-${link.href.replace("/", "") || "home"}`}>
                    <span className="text-sm text-[#888] hover:text-[#f23030] transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-5">Послуги</h3>
            <ul className="space-y-2.5">
              {["Проєктування систем", "Монтаж обладнання", "Інсталяція", "Налаштування", "Сервіс та обслуговування", "Постачання"].map((s) => (
                <li key={s}>
                  <span className="text-sm text-[#888] hover:text-[#f23030] transition-colors cursor-pointer">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-5">Контакти</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#888]">
                <MapPin size={15} className="text-[#f23030] mt-0.5 shrink-0" />
                <span>м. Луцьк, вул. Ковельська 15, Волинська область</span>
              </li>
              <li>
                <a href="tel:+380971234567" className="flex items-center gap-3 text-sm text-[#888] hover:text-[#f23030] transition-colors" data-testid="link-footer-phone">
                  <Phone size={15} className="text-[#f23030] shrink-0" />
                  +380 (97) 123-45-67
                </a>
              </li>
              <li>
                <a href="mailto:info@volynaudio.ua" className="flex items-center gap-3 text-sm text-[#888] hover:text-[#f23030] transition-colors" data-testid="link-footer-email">
                  <Mail size={15} className="text-[#f23030] shrink-0" />
                  info@volynaudio.ua
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555]">
          <span>© {new Date().getFullYear()} Волинська аудіо-компанія. Усі права захищені.</span>
          <span>Розробка та монтаж AV-систем у Луцьку та на Волині</span>
        </div>
      </div>
    </footer>
  );
}
