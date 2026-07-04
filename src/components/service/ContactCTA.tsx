import { MessageCircle, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import { CONTACT, whatsappLink } from "@/lib/contact";

export default function ContactCTA({
  title,
  description,
  whatsappMessage,
}: {
  title: string;
  description: string;
  whatsappMessage: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
      <Container className="relative flex flex-col items-center text-center">
        <h2 className="max-w-xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-md text-white/55">{description}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] px-6 py-3.5 font-data text-xs uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={16} />
            Escribir por WhatsApp
          </a>
          <a
            href={`tel:${CONTACT.phoneNumber}`}
            className="flex items-center gap-2 border border-white/25 px-6 py-3.5 font-data text-xs uppercase tracking-[0.14em] text-white/80 hover:border-white"
          >
            <Phone size={15} />
            {CONTACT.phoneDisplay}
          </a>
        </div>
      </Container>
    </section>
  );
}
