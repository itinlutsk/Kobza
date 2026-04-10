import { useEffect, useRef, useState } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Award, Users, Shield, Clock } from "lucide-react";

import teamImg from "@assets/generated_images/audio_about_team.png";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

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
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function About() {
  usePageMeta(
    "Про компанію — Волинська аудіо-компанія",
    "Ми — команда AV-інтеграторів з Луцька з 20-річним досвідом. Сертифіковані фахівці, власний склад обладнання, гарантійний та постгарантійний сервіс."
  );

  return (
    <div>
      <div className="pt-24 pb-12 bg-[#1e1d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">З 2004 року</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Про компанію
          </h1>
          <p className="text-[#aaa] max-w-2xl mx-auto">
            20 років досвіду в AV-інтеграції на Волині та по всій Україні
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 section-light" data-testid="section-story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeIn} className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f23030]">Наша історія</span>
                <h2 className="text-3xl font-extrabold text-[#1e1d1c] mt-2">Понад 20 років<br />якісного звуку</h2>
              </motion.div>
              <div className="space-y-5 text-[#666] text-sm leading-relaxed">
                <motion.p variants={fadeIn}>
                  Волинська аудіо-компанія заснована в 2004 році в Луцьку Сергієм Мельниченком — інженером-акустиком з вищою профільною освітою та пристрастю до якісного звуку. Розпочавши з невеликих проєктів для місцевих кафе, вже через 5 років компанія виросла до повноцінного AV-інтегратора з власною монтажною бригадою.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Сьогодні в нашій команді — 18 спеціалістів: інженери-проєктувальники, монтажники, DSP-налаштовувачі та технічна підтримка. Ми реалізували понад 500 проєктів різної складності — від невеликих переговорних кімнат до великих концертних залів та культових споруд.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Наш принцип: кожен об'єкт унікальний, і стандартних рішень не буває. Ми проєктуємо під конкретні завдання — акустику приміщення, стиль роботи персоналу, побажання власника. Це займає більше часу, але результат завжди перевершує очікування.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Є авторизованими партнерами Yamaha, Sennheiser, Shure, Bose, JBL, Crown, Extron, Crestron та ряду інших провідних виробників.
                </motion.p>
              </div>
              <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-3">
                {["Yamaha Partner", "Sennheiser Pro", "Bose Certified", "Crestron Dealer"].map((badge) => (
                  <span key={badge} className="text-xs bg-[rgba(242,48,48,0.06)] border border-[rgba(242,48,48,0.25)] text-[#f23030] px-3 py-1.5 font-bold">
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden border border-[#e8e8e8] shadow-lg"
              data-testid="img-team"
            >
              <img src={teamImg} alt="Команда Волинської аудіо-компанії" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 section-dark" data-testid="section-about-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Clock, label: "Років досвіду", target: 20, suffix: "+" },
              { icon: CheckCircle2, label: "Реалізованих об'єктів", target: 500, suffix: "+" },
              { icon: Award, label: "Брендів-партнерів", target: 50, suffix: "+" },
              { icon: Users, label: "Спеціалістів у команді", target: 18, suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-about-${stat.label}`}>
                <div className="w-12 h-12 bg-[rgba(242,48,48,0.15)] flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={22} className="text-[#f23030]" />
                </div>
                <div className="text-4xl font-extrabold text-[#f23030] mb-1">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#aaa]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 section-gray" data-testid="section-values">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="musix-heading">
            <span className="label">Цінності</span>
            <h2>Наші принципи</h2>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: "Якість без компромісів", desc: "Використовуємо тільки сертифіковане обладнання від перевірених виробників. Жодних «аналогів» та «дешевих замін»." },
              { icon: Users, title: "Власна бригада", desc: "Монтаж виконує наша постійна бригада — без субпідрядників. Ми відповідаємо за кожен етап роботи." },
              { icon: Clock, title: "Дотримання строків", desc: "Здаємо об'єкти у обумовлені строки. Якщо затримка неминуча — попереджаємо заздалегідь." },
              { icon: Award, title: "Офіційна гарантія", desc: "Гарантія 12 місяців на виконані роботи та гарантія виробника на обладнання. Документально підтверджено." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeIn}
                className="bg-white border border-[#e8e8e8] p-6 flex gap-5 hover:border-[#f23030] hover:shadow-md transition-all duration-200"
                data-testid={`card-value-${item.title}`}
              >
                <div className="w-12 h-12 bg-[rgba(242,48,48,0.08)] flex items-center justify-center shrink-0">
                  <item.icon size={22} className="text-[#f23030]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1e1d1c] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="py-12 section-dark text-center">
        <p className="text-[#aaa] mb-6 text-sm">Готові поговорити про ваш проєкт?</p>
        <Link href="/contacts" data-testid="button-about-contact">
          <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer">
            Зв'язатися з нами
          </button>
        </Link>
      </div>
    </div>
  );
}
