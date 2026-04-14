import { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Введіть ім'я"),
  phone: z.string().min(10, "Введіть номер телефону"),
});
type FormData = z.infer<typeof schema>;

const SESSION_KEY = "volynAudioPopupShown";

export default function ExitPopup() {
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timerShown = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 15000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(SESSION_KEY)) {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        clearTimeout(timerShown);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      clearTimeout(timerShown);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const onSubmit = (_data: FormData) => {
    toast({ title: "Дякуємо!", description: "Ми передзвонимо вам найближчим часом." });
    reset();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setVisible(false); }}
      data-testid="exit-popup-overlay"
    >
      <div className="relative bg-white p-0 w-full max-w-md shadow-2xl overflow-hidden" data-testid="exit-popup">
        {/* Red header */}
        <div className="bg-[#f23030] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-white" />
            <div>
              <h2 className="text-base font-extrabold text-white">
                Залиште номер — ми передзвонимо
              </h2>
              <p className="text-xs text-[rgba(255,255,255,0.75)]">Безкоштовна консультація</p>
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-white/70 hover:text-white transition-colors"
            data-testid="button-close-popup"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="form-exit-popup">
            <div>
              <input
                {...register("name")}
                placeholder="Ваше ім'я"
                className="w-full bg-white border-2 border-[#e8e8e8] px-4 py-3 text-sm text-[#1e1d1c] placeholder-[#bbb] focus:outline-none focus:border-[#f23030] transition-colors"
                data-testid="input-popup-name"
              />
              {errors.name && <p className="text-[#f23030] text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("phone")}
                placeholder="+380 (__)  ___-__-__"
                type="tel"
                className="w-full bg-white border-2 border-[#e8e8e8] px-4 py-3 text-sm text-[#1e1d1c] placeholder-[#bbb] focus:outline-none focus:border-[#f23030] transition-colors"
                data-testid="input-popup-phone"
              />
              {errors.phone && <p className="text-[#f23030] text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full btn-red text-sm font-bold py-3.5 cursor-pointer"
              data-testid="button-submit-popup"
            >
              Передзвоніть мені
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
