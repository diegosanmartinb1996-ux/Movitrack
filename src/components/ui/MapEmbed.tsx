import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";

/**
 * Mapa embebido de Google Maps (sin API key) centrado en la dirección real.
 */
export default function MapEmbed({ className }: { className?: string }) {
  const query = encodeURIComponent(CONTACT.address);
  const src = `https://www.google.com/maps?q=${query}&z=16&output=embed`;

  return (
    <div className={cn("relative overflow-hidden border border-white/10", className)}>
      <iframe
        title={`Ubicación de MOVITRACK — ${CONTACT.address}`}
        src={src}
        className="h-full w-full grayscale-[0.3] contrast-[1.05]"
        style={{ border: 0, minHeight: 320 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
