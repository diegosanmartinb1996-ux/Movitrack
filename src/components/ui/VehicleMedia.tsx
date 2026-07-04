import { cn } from "@/lib/utils";

/**
 * Neutral placeholder shown until real vehicle photography is loaded.
 * Tone-mapped per vehicle so the catalog still reads as cohesive.
 */
export default function VehicleMedia({
  tone,
  label,
  className,
}: {
  tone: string;
  label: string;
  className?: string;
  /** kept for API compatibility; no longer rendered */
  index?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        tone,
        className
      )}
    >
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
      <svg
        viewBox="0 0 200 80"
        className="absolute inset-0 m-auto h-1/2 w-2/3 text-white/[0.07]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M15 55 L28 30 Q40 20 65 20 L130 20 Q150 20 160 35 L185 42 Q192 44 192 52 L192 58 L15 58 Z" />
        <circle cx="50" cy="60" r="12" />
        <circle cx="150" cy="60" r="12" />
        <line x1="70" y1="20" x2="70" y2="40" />
        <line x1="130" y1="20" x2="130" y2="40" />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <span className="font-display text-xl font-semibold uppercase tracking-tight text-white/85 md:text-2xl">
          {label}
        </span>
        <span className="font-data text-[10px] uppercase tracking-[0.2em] text-white/55">
          Foto próximamente
        </span>
      </div>
    </div>
  );
}
