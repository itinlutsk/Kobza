import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Phone, ChevronRight, Star, ChevronLeft, Award, Users, Shield,
  Utensils, Building2, Church, Landmark, GraduationCap, Presentation, Music, Home as HomeIcon,
  Pencil, Package, Truck, Wrench, Plug, Settings, HeartHandshake,
  CheckCircle2, ArrowRight, MessageCircle
} from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

import heroImg from "@assets/generated_images/audio_hero.png";
import heroSlide2 from "@assets/generated_images/audio_hero_slide2.png";
import heroSlide3 from "@assets/generated_images/audio_hero_slide3.png";
import portfolioRestaurant from "@assets/generated_images/audio_portfolio_restaurant.png";
import portfolioChurch from "@assets/generated_images/audio_portfolio_church.png";
import portfolioConference from "@assets/generated_images/audio_portfolio_conference.png";
import portfolioConcert from "@assets/generated_images/audio_portfolio_concert.png";
import portfolioMuseum from "@assets/generated_images/audio_portfolio_museum.png";
import portfolioSchool from "@assets/generated_images/audio_portfolio_school.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const heroSlides = [
  { img: heroImg,    pos: "center" },
  { img: heroSlide2, pos: "center" },
  { img: heroSlide3, pos: "center" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const categories = [
  { icon: Utensils, label: "Ресторани" },
  { icon: Building2, label: "Бізнес-центри" },
  { icon: Church, label: "Церкви та храми" },
  { icon: Landmark, label: "Музеї" },
  { icon: GraduationCap, label: "Навчальні заклади" },
  { icon: Presentation, label: "Конференц-зали" },
  { icon: Music, label: "Концертні майданчики" },
  { icon: HomeIcon, label: "Домашні кінотеатри" },
];

const services = [
  { icon: Pencil, label: "Проєктування" },
  { icon: Package, label: "Підбір обладнання" },
  { icon: Truck, label: "Постачання" },
  { icon: Wrench, label: "Монтаж" },
  { icon: Plug, label: "Інсталяція" },
  { icon: Settings, label: "Налаштування" },
  { icon: HeartHandshake, label: "Сервіс та обслуговування" },
];

const stages = [
  { num: "01", label: "Консультація" },
  { num: "02", label: "Обстеження об'єкта" },
  { num: "03", label: "Проєктування" },
  { num: "04", label: "Підбір обладнання" },
  { num: "05", label: "Монтаж" },
  { num: "06", label: "Налаштування" },
  { num: "07", label: "Здача та гарантія" },
];

const stats = [
  { label: "Років досвіду", target: 20, suffix: "+" },
  { label: "Реалізованих об'єктів", target: 500, suffix: "+" },
  { label: "Брендів-партнерів", target: 50, suffix: "+" },
  { label: "Задоволених клієнтів", target: 98, suffix: "%" },
];

const portfolio = [
  { img: portfolioRestaurant, title: "Ресторан «Волинська кухня»", desc: "Система звуку та фонової музики для ресторану на 120 місць", tag: "Ресторан" },
  { img: portfolioChurch, title: "Свято-Троїцький собор", desc: "Повна система звукопідсилення для великого православного собору", tag: "Церква" },
  { img: portfolioConference, title: "Бізнес-центр «Луцьк Плаза»", desc: "Конференційна AV-система з відеопрезентацією та мікрофонами", tag: "Конференц-зал" },
  { img: portfolioConcert, title: "Концертний зал «Промінь»", desc: "Профісійна концертна звукова система для 800 глядачів", tag: "Концертний майданчик" },
  { img: portfolioMuseum, title: "Волинський краєзнавчий музей", desc: "Система аудіогіду та фонового озвучення для музейних залів", tag: "Музей" },
  { img: portfolioSchool, title: "Луцька гімназія №4", desc: "Шкільна AV-система: актова зала, мікрофони, проєктор", tag: "Навчальний заклад" },
];

const brands = ["Yamaha", "Sennheiser", "Shure", "Crown", "Bose", "JBL", "Extron", "Crestron", "Sony", "Panasonic", "QSC", "Biamp"];

const reviews = [
  {
    text: "Волинська аудіо-компанія встановила систему звуку в нашому ресторані. Все зроблено акуратно та якісно — клієнти часто питають, звідки така хороша музика. Повністю задоволені роботою!",
    name: "Олена Савченко",
    role: "Власниця ресторану «Смачна хата»",
    stars: 5,
  },
  {
    text: "Замовляли монтаж конференційної системи в нашому офісі. Команда провела повне обстеження, запропонувала оптимальне рішення та встановила все точно у строк. Рекомендуємо!",
    name: "Ігор Мельниченко",
    role: "Директор ТОВ «Технологічні рішення»",
    stars: 5,
  },
  {
    text: "Нашій парафії потрібна була якісна система для богослужінь. Хлопці чудово справились — звук рівний, без відлуння, система проста у використанні для наших волонтерів.",
    name: "о. Василь Романчук",
    role: "Свято-Миколаївська церква, м. Луцьк",
    stars: 5,
  },
];

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="musix-heading">
      <span className="label">{label}</span>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default function Home() {
  const [currentReview, setCurrentReview] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  usePageMeta(
    "Волинська аудіо-компанія — Професійний звук, світло та AV-системи",
    "Проєктуємо, монтуємо та обслуговуємо AV-системи для ресторанів, церков, бізнес-центрів, концертних залів та навчальних закладів у Луцьку та на Волині. 20+ років досвіду, 500+ об'єктів."
  );

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
        data-testid="section-hero"
      >
        {/* Background slider */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide].img})`,
              backgroundSize: "cover",
              backgroundPosition: heroSlides[currentSlide].pos,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(18,17,17,0.82) 0%, rgba(18,17,17,0.72) 60%, rgba(18,17,17,0.88) 100%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-28 pb-16">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p
              variants={fadeIn}
              className="text-[#f23030] text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-5"
            >
              Луцьк · Волинська область · з 2004 року
            </motion.p>
            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              Професійний звук{" "}
              <span className="text-[#f23030]">·</span> Світло{" "}
              <span className="text-[#f23030]">·</span>{" "}
              <span className="text-[#f23030]">AV-системи</span>
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="text-base sm:text-lg text-[rgba(255,255,255,0.8)] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Проєктуємо, монтуємо та обслуговуємо AV-системи для ресторанів, церков, бізнес-центрів, концертних залів та навчальних закладів.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/contacts" data-testid="button-hero-order">
                <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer">
                  Замовити послугу
                </button>
              </Link>
              <a href="tel:+380971234567" data-testid="button-hero-call">
                <button className="btn-outline-white text-sm font-semibold px-10 py-4 cursor-pointer flex items-center gap-2 justify-center">
                  <Phone size={18} />
                  Замовити дзвінок
                </button>
              </a>
            </motion.div>
            {/* Messenger links */}
            <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
              <span className="text-[rgba(255,255,255,0.4)] text-[10px] sm:text-xs uppercase tracking-widest mr-1">Також у</span>
              {[
                { label: "Viber", href: "viber://chat?number=%2B380971234567", testId: "link-hero-viber" },
                { label: "Telegram", href: "https://t.me/volynaudio", testId: "link-hero-telegram" },
                { label: "WhatsApp", href: "https://wa.me/380971234567", testId: "link-hero-whatsapp" },
              ].map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  data-testid={m.testId}
                  className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[rgba(255,255,255,0.7)] hover:text-white border border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.6)] px-2.5 sm:px-3 py-1.5 transition-all whitespace-nowrap"
                >
                  <MessageCircle size={11} />
                  {m.label}
                </a>
              ))}
            </motion.div>
            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Award, label: "Досвід 20+ років" },
                { icon: CheckCircle2, label: "500+ об'єктів" },
                { icon: Shield, label: "Гарантія якості" },
                { icon: Users, label: "Власна команда" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.75)]">
                  <Icon size={16} className="text-[#f23030]" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        {/* Slide dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? "w-8 bg-[#f23030]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-20 section-gray" data-testid="section-for-whom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <SectionHeading
                label="Об'єкти"
                title="Для кого ми працюємо"
                subtitle="Реалізуємо AV-проєкти будь-якої складності для комерційних та громадських об'єктів"
              />
            </motion.div>
            <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(({ icon: Icon, label }) => (
                <motion.div key={label} variants={fadeIn} whileHover={{ y: -4 }}>
                  <Link href="/portfolio" data-testid={`card-category-${label}`}>
                    <div className="bg-white border border-[#e8e8e8] p-6 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-[#f23030] hover:shadow-md transition-all duration-200 h-full">
                      <div className="w-12 h-12 flex items-center justify-center bg-[rgba(242,48,48,0.08)]">
                        <Icon size={22} className="text-[#f23030]" />
                      </div>
                      <span className="text-sm font-semibold text-[#1e1d1c]">{label}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 section-light" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading
                label="Послуги"
                title="Що ми робимо"
                subtitle="Повний цикл — від консультації до технічного обслуговування"
              />
            </motion.div>
            <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {services.map(({ icon: Icon, label }) => (
                <motion.div key={label} variants={fadeIn} whileHover={{ y: -4 }}>
                  <Link href="/services" data-testid={`card-service-${label}`}>
                    <div className="bg-white border border-[#e8e8e8] p-6 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-[#f23030] hover:shadow-md transition-all duration-200 h-full">
                      <Icon size={28} className="text-[#f23030]" />
                      <span className="text-sm font-semibold text-[#1e1d1c]">{label}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={fadeIn}>
                <Link href="/services" data-testid="link-all-services">
                  <div className="border-2 border-dashed border-[#f23030] p-6 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-[rgba(242,48,48,0.04)] transition-all h-full min-h-[110px]">
                    <ArrowRight size={22} className="text-[#f23030]" />
                    <span className="text-sm font-bold text-[#f23030]">Усі послуги</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stages */}
      <section className="py-20 section-gray" data-testid="section-stages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading
                label="Процес"
                title="Етапи робіт"
                subtitle="Прозорий процес від першого дзвінка до здачі об'єкта"
              />
            </motion.div>
            <div className="relative">
              <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-[#e8e8e8]" />
              <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative">
                {stages.map((stage) => (
                  <motion.div key={stage.num} variants={fadeIn} className="flex flex-col items-center text-center gap-2" data-testid={`stage-${stage.num}`}>
                    <div className="w-14 h-14 bg-[#f23030] flex items-center justify-center relative z-10 mb-1">
                      <span className="text-lg font-extrabold text-white">{stage.num}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#1e1d1c] leading-tight">{stage.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <motion.div variants={fadeIn} className="text-center mt-10">
              <Link href="/stages" data-testid="link-stages-more">
                <button className="btn-outline-red text-sm font-bold px-8 py-3 cursor-pointer inline-flex items-center gap-2">
                  Детальніше про етапи <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Us — stats */}
      <section className="py-20 section-dark" data-testid="section-why-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn} className="text-center mb-14">
              <span className="block text-xs font-bold tracking-[0.2em] uppercase text-[#f23030] mb-2">Про нас</span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Чому ми?</h2>
              <p className="text-[#aaa] mt-3">Понад 20 років будуємо репутацію якістю та надійністю</p>
            </motion.div>
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeIn} className="text-center" data-testid={`stat-${stat.label}`}>
                  <div className="text-4xl lg:text-5xl font-extrabold text-[#f23030] mb-2">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-[#aaa] font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                "Власна монтажна бригада без субпідрядників",
                "Офіційні партнери провідних світових брендів",
                "Гарантія на обладнання та роботи",
                "Безкоштовна консультація та виїзд на об'єкт",
                "Проєктна документація включена у вартість",
                "Технічна підтримка після здачі об'єкта",
              ].map((item) => (
                <motion.div key={item} variants={fadeIn} className="flex items-start gap-3 bg-[#252525] border border-[#333] p-4">
                  <CheckCircle2 size={18} className="text-[#f23030] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#ccc]">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20 section-gray" data-testid="section-portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading
                label="Портфоліо"
                title="Наші роботи"
                subtitle="Реалізовані проєкти на Волині та за її межами"
              />
            </motion.div>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {portfolio.map((item) => (
                <motion.div key={item.title} variants={fadeIn} whileHover={{ y: -6 }}>
                  <Link href="/portfolio" data-testid={`card-portfolio-${item.title}`}>
                    <div className="bg-white border border-[#e8e8e8] overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#f23030] text-white text-xs font-bold px-3 py-1">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-[#1e1d1c] mb-2 text-sm">{item.title}</h3>
                        <p className="text-xs text-[#666] leading-relaxed mb-3">{item.desc}</p>
                        <span className="text-xs text-[#f23030] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Переглянути кейс <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeIn} className="text-center">
              <Link href="/portfolio" data-testid="link-all-portfolio">
                <button className="btn-outline-red text-sm font-bold px-10 py-3 cursor-pointer">
                  Переглянути всі проєкти
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-14 section-light border-y border-[#e8e8e8]" data-testid="section-brands">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#999] mb-8">
            Офіційні партнери та постачальники
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-base lg:text-lg font-extrabold text-[#bbb] hover:text-[#f23030] transition-colors cursor-default select-none tracking-wide"
                data-testid={`brand-${brand}`}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 section-gray" data-testid="section-reviews">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.div variants={fadeIn}>
              <SectionHeading
                label="Відгуки"
                title="Відгуки клієнтів"
                subtitle="Що кажуть ті, хто вже скористався нашими послугами"
              />
            </motion.div>
            <motion.div variants={fadeIn} className="relative bg-white border border-[#e8e8e8] p-8 lg:p-10 shadow-md" data-testid="carousel-reviews">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: reviews[currentReview].stars }).map((_, i) => (
                  <Star key={i} size={18} className="text-[#f23030] fill-[#f23030]" />
                ))}
              </div>
              <blockquote className="text-base lg:text-lg text-[#444] leading-relaxed mb-8 italic">
                "{reviews[currentReview].text}"
              </blockquote>
              <div>
                <p className="font-bold text-[#1e1d1c]">{reviews[currentReview].name}</p>
                <p className="text-sm text-[#666]">{reviews[currentReview].role}</p>
              </div>
              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={() => setCurrentReview((c) => (c - 1 + reviews.length) % reviews.length)}
                  className="w-10 h-10 border-2 border-[#e8e8e8] flex items-center justify-center text-[#666] hover:border-[#f23030] hover:text-[#f23030] transition-colors cursor-pointer"
                  data-testid="button-review-prev"
                  aria-label="Попередній відгук"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentReview(i)}
                      className={`h-2 transition-all duration-200 cursor-pointer ${i === currentReview ? "bg-[#f23030] w-6" : "bg-[#ddd] w-2"}`}
                      data-testid={`button-review-dot-${i}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentReview((c) => (c + 1) % reviews.length)}
                  className="w-10 h-10 border-2 border-[#e8e8e8] flex items-center justify-center text-[#666] hover:border-[#f23030] hover:text-[#f23030] transition-colors cursor-pointer"
                  data-testid="button-review-next"
                  aria-label="Наступний відгук"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 section-dark"
        data-testid="section-cta-banner"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <motion.p variants={fadeIn} className="text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">Звʼяжіться з нами</motion.p>
            <motion.h2 variants={fadeIn} className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Найкраще рішення під ваш об'єкт
            </motion.h2>
            <motion.p variants={fadeIn} className="text-[#aaa] mb-10 max-w-xl mx-auto">
              Безкоштовна консультація та виїзд на об'єкт. Розробимо проєкт та підберемо оптимальне обладнання у вашому бюджеті.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacts" data-testid="button-cta-banner-order">
                <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer">
                  Замовити послугу
                </button>
              </Link>
              <a href="tel:+380971234567" data-testid="button-cta-banner-call">
                <button className="btn-outline-white text-sm font-semibold px-10 py-4 cursor-pointer flex items-center gap-2 justify-center">
                  <Phone size={18} />
                  +380 (97) 123-45-67
                </button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
