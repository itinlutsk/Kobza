import { useState } from "react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const schema = z.object({
  name: z.string().min(2, "Введіть ваше ім'я"),
  phone: z.string().min(10, "Введіть коректний номер телефону"),
  email: z.string().email("Введіть коректний email").or(z.literal("")),
  message: z.string().optional(),
  consultation: z.boolean().optional(),
  objectType: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const objectTypes = ["Ресторан", "Церква", "Зал", "Інше"];

const inputClass = "w-full bg-white border-2 border-[#e8e8e8] px-4 py-3 text-sm text-[#1e1d1c] placeholder-[#bbb] focus:outline-none focus:border-[#f23030] transition-colors";

export default function Contacts() {
  usePageMeta(
    "Контакти — Волинська аудіо-компанія",
    "Зв'яжіться з нами: вул. Ковельська 15, Луцьк. Телефон +380 (97) 123-45-67. Пишіть на info@volynaudio.ua або заповніть форму заявки онлайн."
  );
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", message: "", consultation: false, objectType: "" },
  });

  const onSubmit = (_data: FormData) => {
    toast({
      title: "Дякуємо!",
      description: "Ми зв'яжемося з вами найближчим часом.",
    });
    reset();
    setSelectedType("");
  };

  const handleTypeSelect = (type: string) => {
    const newType = selectedType === type ? "" : type;
    setSelectedType(newType);
    setValue("objectType", newType);
  };

  return (
    <div>
      <div className="pt-24 pb-12 bg-[#1e1d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#f23030] mb-3">Безкоштовна консультація</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Зв'яжіться з нами
          </h1>
          <p className="text-[#aaa] max-w-2xl mx-auto">
            Безкоштовна консультація та виїзд на об'єкт. Відповідаємо протягом 1 години.
          </p>
        </div>
      </div>

      <section className="py-20 section-light" data-testid="section-contacts">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-2 space-y-6"
            >
              <motion.div variants={fadeIn}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f23030]">Контакти</span>
                <h2 className="text-2xl font-extrabold text-[#1e1d1c] mt-2 mb-6">
                  Контактна інформація
                </h2>
              </motion.div>

              {[
                { icon: Phone, label: "Телефон", value: "+380 (97) 123-45-67", href: "tel:+380971234567" },
                { icon: Mail, label: "Email", value: "info@volynaudio.ua", href: "mailto:info@volynaudio.ua" },
                { icon: MapPin, label: "Адреса", value: "м. Луцьк, вул. Ковельська 15, Волинська область", href: null },
                { icon: Clock, label: "Графік роботи", value: "Пн-Пт: 9:00 — 18:00\nСб: 10:00 — 15:00", href: null },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeIn} className="flex items-start gap-4" data-testid={`contact-${item.label}`}>
                  <div className="w-10 h-10 bg-[rgba(242,48,48,0.08)] flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#f23030]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#999] mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-[#1e1d1c] hover:text-[#f23030] transition-colors font-medium">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-[#444] whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.div variants={fadeIn} className="mt-8 p-5 bg-[#f5f5f5] border border-[#e8e8e8]">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare size={18} className="text-[#f23030]" />
                  <span className="font-bold text-sm text-[#1e1d1c]">Месенджери</span>
                </div>
                <div className="flex gap-3">
                  {[
                    { label: "Viber", href: "viber://chat?number=%2B380971234567" },
                    { label: "Telegram", href: "https://t.me/volynaudio" },
                    { label: "WhatsApp", href: "https://wa.me/380971234567" },
                  ].map((m) => (
                    <a key={m.label} href={m.href} className="flex-1 text-center text-xs py-2.5 border-2 border-[#e8e8e8] text-[#666] hover:border-[#f23030] hover:text-[#f23030] transition-colors font-bold" data-testid={`link-${m.label.toLowerCase()}`}>
                      {m.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-3 bg-white border border-[#e8e8e8] shadow-md p-8"
            >
              <motion.div variants={fadeIn} className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f23030]">Форма</span>
                <h2 className="text-2xl font-extrabold text-[#1e1d1c] mt-2">Надіслати запит</h2>
              </motion.div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" data-testid="form-contacts" noValidate>
                <motion.div variants={fadeIn} className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Ваше ім'я</label>
                    <input
                      {...register("name")}
                      placeholder="Іван Петренко"
                      className={inputClass}
                      data-testid="input-name"
                    />
                    {errors.name && <p className="text-[#f23030] text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Телефон <span className="text-[#f23030]">*</span></label>
                    <input
                      {...register("phone")}
                      placeholder="+380 (__)  ___-__-__"
                      type="tel"
                      className={inputClass}
                      data-testid="input-phone"
                    />
                    {errors.phone && <p className="text-[#f23030] text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    {...register("email")}
                    placeholder="your@email.com"
                    type="email"
                    className={inputClass}
                    data-testid="input-email"
                  />
                  {errors.email && <p className="text-[#f23030] text-xs mt-1">{errors.email.message}</p>}
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wide">Тип об'єкта</label>
                  <div className="flex flex-wrap gap-2" data-testid="quick-select-type">
                    {objectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleTypeSelect(type)}
                        className={`px-4 py-2 text-sm font-bold transition-all duration-200 cursor-pointer border-2 ${
                          selectedType === type
                            ? "bg-[#f23030] border-[#f23030] text-white"
                            : "border-[#e8e8e8] text-[#666] hover:border-[#f23030] hover:text-[#f23030]"
                        }`}
                        data-testid={`button-type-${type}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-xs font-bold text-[#666] mb-1.5 uppercase tracking-wide">Повідомлення</label>
                  <textarea
                    {...register("message")}
                    placeholder="Опишіть ваш об'єкт та завдання..."
                    rows={4}
                    className={`${inputClass} resize-none`}
                    data-testid="input-message"
                  />
                </motion.div>

                <motion.div variants={fadeIn} className="flex items-center gap-3">
                  <input
                    {...register("consultation")}
                    type="checkbox"
                    id="consultation"
                    className="w-4 h-4 border-2 border-[#e8e8e8] accent-[#f23030] cursor-pointer"
                    data-testid="checkbox-consultation"
                  />
                  <label htmlFor="consultation" className="text-sm text-[#444] cursor-pointer">
                    Потрібна безкоштовна консультація
                  </label>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <button
                    type="submit"
                    className="w-full btn-red text-sm font-bold py-4 cursor-pointer"
                    data-testid="button-submit-contacts"
                  >
                    Надіслати запит
                  </button>
                  <p className="text-xs text-[#999] text-center mt-3">
                    Відповідаємо протягом 1 робочого дня. Конфіденційність гарантована.
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <div className="w-full h-64 bg-[#f5f5f5] border-t border-[#e8e8e8] flex items-center justify-center" data-testid="map-placeholder">
        <div className="text-center">
          <MapPin size={32} className="text-[#f23030] mx-auto mb-3" />
          <p className="text-sm text-[#666]">м. Луцьк, вул. Ковельська 15</p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#f23030] hover:underline mt-1 inline-block font-bold" data-testid="link-map">
            Відкрити в Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
