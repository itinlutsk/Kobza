import { Link } from "wouter";
import { PhoneCall } from "lucide-react";

export default function MobileCTA() {
  return (
    <Link href="/contacts" data-testid="button-mobile-cta">
      <button className="fixed bottom-5 right-5 z-40 md:hidden flex items-center gap-2 bg-[#f23030] text-white font-bold text-sm px-5 py-3 shadow-lg hover:bg-[#d41f1f] transition-all duration-200 cursor-pointer">
        <PhoneCall size={16} />
        Замовити
      </button>
    </Link>
  );
}
