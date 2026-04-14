import { Link } from "wouter";
import { motion } from "framer-motion";
import { Pencil, Package, Truck, Wrench, Plug, Settings, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const services = [
  {
    icon: Pencil,
    title: "Проєктування AV-систем",
    desc: "Розробляємо детальну технічну документацію, акустичний проєкт та специфікацію обладнання відповідно до особливостей вашого об'єкта.",
    features: ["Акустичний розрахунок", "3D-візуалізація розміщення", "Технічна документація", "Кошторис та ТЗ"],
  },
  {
    icon: Package,
    title: "Підбір обладнання",
    desc: "Підбираємо оптимальне обладнання від перевірених виробників під ваш бюджет та технічні вимоги.",
    features: ["Порівняльний аналіз", "Офіційні постачальники", "Демонстрація обладнання", "Гарантія відповідності"],
  },
  {
    icon: Truck,
    title: "Постачання",
    desc: "Офіційне постачання обладнання від провідних світових брендів з усіма документами та гарантією виробника.",
    features: ["Офіційна поставка", "Митне оформлення", "Страхування вантажу", "Контроль якості"],
  },
  {
    icon: Wrench,
    title: "Монтаж",
    desc: "Професійний монтаж обладнання власною бригадою без залучення субпідрядників. Акуратно, точно, у строк.",
    features: ["Власна монтажна бригада", "Прокладання кабелів", "Монтаж кріплень", "Збирання стійок"],
  },
  {
    icon: Plug,
    title: "Інсталяція систем",
    desc: "Підключення та інтеграція всіх компонентів системи в єдину мережу керування та автоматизації.",
    features: ["Підключення компонентів", "Мережева інтеграція", "Протоколи управління", "IP-конфігурація"],
  },
  {
    icon: Settings,
    title: "Налаштування",
    desc: "Точне налаштування аудіо та відео параметрів, тестування в реальних умовах експлуатації.",
    features: ["DSP-обробка сигналу", "Вимірювання та корекція", "Навчання персоналу", "Технічна здача"],
  },
  {
    icon: HeartHandshake,
    title: "Сервіс та обслуговування",
    desc: "Технічний супровід після здачі об'єкта: планове обслуговування, оперативний ремонт, модернізація.",
    features: ["Гарантійне обслуговування", "Планові ТО", "Аварійний виїзд", "Модернізація"],
  },
];

export default function Services() {
  usePageMeta(
    "Послуги — Волинська аудіо-компанія",
    "Повний цикл AV-інтеграції: звукові та мовні системи, конференц-обладнання, digital signage, сцена та освітлення, відеоспостереження. Луцьк та Волинська область."
  );

  return (
    <div>
      <div className="pt-24 pb-12 bg-[#1e1d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">Що ми пропонуємо</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Наші послуги
          </h1>
          <p className="text-[#aaa] max-w-2xl mx-auto">
            Повний цикл AV-інтеграції — від проєкту до технічного обслуговування
          </p>
        </div>
      </div>

      <section className="py-20 section-light" data-testid="section-services-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeIn}
                className="bg-white border border-[#e8e8e8] p-8 flex flex-col lg:flex-row gap-8 hover:border-[#f23030] hover:shadow-md transition-all duration-300"
                data-testid={`card-service-${i}`}
              >
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[rgba(242,48,48,0.08)] flex items-center justify-center shrink-0">
                      <service.icon size={26} className="text-[#f23030]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1e1d1c]">{service.title}</h2>
                  </div>
                  <p className="text-sm text-[#666] leading-relaxed">{service.desc}</p>
                </div>
                <div className="lg:w-2/3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-4">Що включено</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-[#1e1d1c]">
                        <CheckCircle2 size={15} className="text-[#f23030] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-14">
            <Link href="/contacts" data-testid="button-services-order">
              <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer inline-flex items-center gap-2">
                Замовити послугу <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
