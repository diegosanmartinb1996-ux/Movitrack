"use client";

import { Phone, MessageCircle } from "lucide-react";
import { CONTACT, whatsappLink } from "@/lib/contact";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 md:flex">
      <a
        href={`tel:${CONTACT.phoneNumber}`}
        className="group flex h-12 items-center gap-0 overflow-hidden rounded-full border border-white/15 bg-ink/90 pl-0 text-white shadow-lg backdrop-blur transition-all hover:pl-4"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-data text-[11px] uppercase tracking-[0.14em] opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
          Llamar ahora
        </span>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center">
          <Phone size={18} />
        </span>
      </a>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25D366] pl-0 text-white shadow-lg shadow-black/40 transition-all hover:pl-5"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-data text-[11px] uppercase tracking-[0.14em] opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:opacity-100">
          WhatsApp
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <MessageCircle size={22} />
        </span>
      </a>
    </div>
  );
}
