import { useState } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import portfolioRestaurant from "@assets/generated_images/audio_portfolio_restaurant.png";
import portfolioChurch from "@assets/generated_images/audio_portfolio_church.png";
import portfolioConference from "@assets/generated_images/audio_portfolio_conference.png";
import portfolioConcert from "@assets/generated_images/audio_portfolio_concert.png";
import portfolioMuseum from "@assets/generated_images/audio_portfolio_museum.png";
import portfolioSchool from "@assets/generated_images/audio_portfolio_school.png";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const allProjects = [
  { img: portfolioRestaurant, title: "Ресторан «Волинська кухня»", desc: "Система фонового звуку та рівномірного озвучення для ресторану на 120 місць. Приховані стельові динаміки Bose, DSP-контролер, зонування по залах.", tag: "Ресторан", budget: "від 85 000 грн", year: "2023" },
  { img: portfolioChurch, title: "Свято-Троїцький собор", desc: "Повна система звукопідсилення для великого православного собору. Система дозволяє рівно озвучити всіх парафіян, уникнувши ехо.", tag: "Церква", budget: "від 150 000 грн", year: "2023" },
  { img: portfolioConference, title: "Бізнес-центр «Луцьк Плаза»", desc: "AV-система для конференц-залу: проєктор, екран, мікрофони (провідні та бездротові), матричний комутатор, відеоконференцзв'язок.", tag: "Конференц-зал", budget: "від 200 000 грн", year: "2022" },
  { img: portfolioConcert, title: "Концертний зал «Промінь»", desc: "Профійна концертна аудіосистема лінійного масиву для залу 800 глядачів. Цифровий мікшерний пульт Yamaha CL5, мікрофонні стійки, моніторний гук.", tag: "Концертний майданчик", budget: "від 500 000 грн", year: "2022" },
  { img: portfolioMuseum, title: "Волинський краєзнавчий музей", desc: "Система аудіогіду та фонового озвучення для 8 залів музею. Інтеграція з мультимедійними стендами, кнопки запуску аудіо у кожній залі.", tag: "Музей", budget: "від 120 000 грн", year: "2021" },
  { img: portfolioSchool, title: "Луцька гімназія №4", desc: "AV-система актової зали: бездротові мікрофони Sennheiser, підсилювач, акустична система, проєктор для презентацій та шкільних заходів.", tag: "Навчальний заклад", budget: "від 95 000 грн", year: "2021" },
  { img: portfolioRestaurant, title: "Кафе-бар «Золоті ворота»", desc: "Зональна система звуку для бару та тераси. Вологозахищені динаміки для зовнішньої тераси, різні рівні гучності у кожній зоні.", tag: "Ресторан", budget: "від 65 000 грн", year: "2024" },
  { img: portfolioConference, title: "Офіс компанії «Агробізнес Волинь»", desc: "Переговорна кімната з системою відеоконференцзв'язку: PTZ-камера, мікрофонна антена, великий дисплей 86 дюймів, Zoom/Teams інтеграція.", tag: "Конференц-зал", budget: "від 110 000 грн", year: "2024" },
];

const tags = ["Усі", "Ресторан", "Церква", "Конференц-зал", "Концертний майданчик", "Музей", "Навчальний заклад"];

export default function Portfolio() {
  usePageMeta(
    "Кейси та об'єкти — Волинська аудіо-компанія",
    "Реалізовані AV-проєкти: ресторани, церкви, конференц-зали, концертні майданчики, музеї та школи. Більше 500 успішних інсталяцій по всій Волині."
  );
  const [activeTag, setActiveTag] = useState("Усі");

  const filtered = activeTag === "Усі" ? allProjects : allProjects.filter((p) => p.tag === activeTag);

  return (
    <div>
      <div className="pt-24 pb-12 bg-[#1e1d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">Наші роботи</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Портфоліо
          </h1>
          <p className="text-[#aaa] max-w-2xl mx-auto">
            Реалізовані проєкти на Волині та по всій Україні
          </p>
        </div>
      </div>

      <section className="py-16 section-gray" data-testid="section-portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-10" data-testid="filter-tags">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer border-2 ${
                  activeTag === tag
                    ? "bg-[#f23030] border-[#f23030] text-white"
                    : "border-[#ddd] text-[#666] hover:border-[#f23030] hover:text-[#f23030]"
                }`}
                data-testid={`filter-tag-${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <motion.div
            layout
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeIn}
                layout
                whileHover={{ y: -6 }}
                className="bg-white border border-[#e8e8e8] overflow-hidden group hover:border-[#f23030] hover:shadow-lg transition-all duration-300"
                data-testid={`card-portfolio-${item.title}`}
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#f23030] text-white text-xs font-bold px-2.5 py-0.5">
                      {item.tag}
                    </span>
                    <span className="bg-[rgba(0,0,0,0.7)] text-white text-xs px-2 py-0.5">
                      {item.year}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1e1d1c] text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-[#666] leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#f23030] font-bold">{item.budget}</span>
                    <span className="text-xs text-[#999] flex items-center gap-0.5 group-hover:text-[#f23030] transition-colors">
                      Детальніше <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="py-12 section-dark text-center">
        <p className="text-[#aaa] mb-6 text-sm">Маєте подібний проєкт?</p>
        <Link href="/contacts" data-testid="button-portfolio-order">
          <button className="btn-red text-sm font-bold px-10 py-4 cursor-pointer">
            Обговорити проєкт
          </button>
        </Link>
      </div>
    </div>
  );
}
