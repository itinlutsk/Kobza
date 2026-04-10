import { useState } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Phone, MessageCircle, FileText, ShoppingCart, Wrench, Settings, CheckSquare } from "lucide-react";
import stagesProcessImg from "@assets/generated_images/audio_stages_process.png";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const stages = [
  {
    num: "01",
    icon: Phone,
    title: "Консультація",
    desc: "Безкоштовна консультація телефоном або особиста зустріч. Обговорюємо ваш об'єкт, цілі та побажання. Відповідаємо на всі питання щодо технологій та вартості.",
    duration: "1-2 дні",
    result: "Розуміння завдання та попередня оцінка вартості",
  },
  {
    num: "02",
    icon: FileText,
    title: "Обстеження об'єкта",
    desc: "Виїзд технічного спеціаліста на ваш об'єкт. Замірювання приміщень, оцінка акустики, вивчення електричної мережі та архітектурних особливостей.",
    duration: "1 день",
    result: "Технічне завдання та обмірювальне креслення",
  },
  {
    num: "03",
    icon: FileText,
    title: "Проєктування",
    desc: "Розробка детального технічного проєкту: розміщення обладнання, схеми підключення, акустичний розрахунок, 3D-візуалізація. Погодження проєкту з замовником.",
    duration: "5-14 днів",
    result: "Затверджений технічний проєкт та специфікація",
  },
  {
    num: "04",
    icon: ShoppingCart,
    title: "Підбір та постачання обладнання",
    desc: "Підбір оптимального обладнання відповідно до проєкту та бюджету. Офіційне замовлення у авторизованих дистриб'юторів, контроль якості при отриманні.",
    duration: "7-21 день",
    result: "Обладнання з гарантією виробника на складі",
  },
  {
    num: "05",
    icon: Wrench,
    title: "Монтаж",
    desc: "Виконання монтажних робіт власною бригадою: прокладання кабелів, встановлення кріплень, монтаж обладнання. Суворе дотримання проєктної документації.",
    duration: "3-14 днів",
    result: "Встановлене та підключене обладнання",
  },
  {
    num: "06",
    icon: Settings,
    title: "Інсталяція та налаштування",
    desc: "Конфігурація DSP-процесорів, налаштування підсилювачів, балансування рівнів, усунення шумів та зворотнього зв'язку. Вимірювання акустичних параметрів.",
    duration: "1-5 днів",
    result: "Відкалібрована та налаштована система",
  },
  {
    num: "07",
    icon: CheckSquare,
    title: "Здача та гарантія",
    desc: "Технічна здача об'єкта з підписанням актів виконаних робіт. Навчання вашого персоналу. Гарантійне обслуговування протягом 12 місяців після здачі.",
    duration: "1 день",
    result: "Підписані акти, гарантійний талон, навчений персонал",
  },
];

const faq = [
  {
    q: "Скільки часу займає весь процес?",
    a: "Залежно від складності об'єкта — від 2 тижнів до 3 місяців. Невелике кафе — 2-3 тижні, великий концертний зал — 2-3 місяці. Після обстеження ви отримаєте точний графік.",
  },
  {
    q: "Чи потрібно нам щось робити самостійно?",
    a: "Мінімум. Ви надаєте доступ до об'єкта та затверджуєте проєкт. Все інше — наша відповідальність. Ми зберегли час сотень клієнтів.",
  },
  {
    q: "Що входить у гарантію?",
    a: "Гарантія 12 місяців на всі виконані роботи та замінені компоненти. Гарантія виробника на обладнання — від 1 до 3 років залежно від бренду. Безкоштовний виїзд у разі гарантійного випадку.",
  },
  {
    q: "Чи є мінімальна сума замовлення?",
    a: "Мінімальний бюджет проєкту — від 30 000 грн. Ми підбираємо рішення під різні бюджети без втрати якості.",
  },
  {
    q: "Чи працюєте ви по всій Волині?",
    a: "Так. Основний регіон роботи — Луцьк та Волинська область. За домовленістю виїжджаємо в інші регіони.",
  },
];

export default function Stages() {
  usePageMeta(
    "Етапи роботи — Волинська аудіо-компанія",
    "Дізнайтесь, як ми реалізуємо AV-проєкти: від консультації та обстеження об'єкта до монтажу, налаштування та сервісного обслуговування. Прозорий процес без сюрпризів."
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <div className="pt-24 pb-12 bg-[#1e1d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">Прозорий процес</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Етапи роботи
          </h1>
          <p className="text-[#aaa] max-w-2xl mx-auto">
            Прозорий процес від першого дзвінка до здачі готового об'єкта з гарантією
          </p>
        </div>
      </div>

      {/* Process photo banner */}
      <div className="relative h-56 lg:h-72 overflow-hidden" data-testid="section-stages-image">
        <img src={stagesProcessImg} alt="Монтаж AV-системи на об'єкті" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(30,29,28,0.75)] to-[rgba(242,48,48,0.25)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-xl lg:text-3xl font-extrabold uppercase tracking-[0.1em] text-center drop-shadow-lg">
            Від ідеї — до готового об'єкта
          </p>
        </div>
      </div>

      <section className="py-20 section-light" data-testid="section-stages-detail">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-5">
            {stages.map((stage) => (
              <motion.div
                key={stage.num}
                variants={fadeIn}
                className="bg-white border border-[#e8e8e8] p-6 lg:p-8 flex gap-6 hover:border-[#f23030] hover:shadow-md transition-all duration-200"
                data-testid={`stage-detail-${stage.num}`}
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 bg-[#f23030] flex items-center justify-center">
                    <span className="text-xl font-extrabold text-white">{stage.num}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-bold text-[#1e1d1c]">{stage.title}</h2>
                    <span className="shrink-0 text-xs text-[#f23030] bg-[rgba(242,48,48,0.08)] border border-[rgba(242,48,48,0.2)] px-2.5 py-1 font-bold">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="text-sm text-[#666] leading-relaxed mb-4">{stage.desc}</p>
                  <div className="flex items-start gap-2 bg-[#f5f5f5] border border-[#e8e8e8] p-3">
                    <stage.icon size={15} className="text-[#f23030] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#444]"><span className="font-bold text-[#1e1d1c]">Результат:</span> {stage.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 section-gray" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="musix-heading">
            <span className="label">FAQ</span>
            <h2>Часті запитання</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e8e8] overflow-hidden"
                data-testid={`faq-item-${i}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <span className="font-semibold text-sm text-[#1e1d1c]">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-[#f23030] shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-[#999] shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-[#f0f0f0]">
                    <p className="text-sm text-[#666] leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-16 section-dark text-center">
        <p className="text-[#aaa] mb-6 text-sm">Готові розпочати?</p>
        <Link href="/contacts" data-testid="button-stages-order">
          <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer">
            Почати співпрацю
          </button>
        </Link>
      </div>
    </div>
  );
}
