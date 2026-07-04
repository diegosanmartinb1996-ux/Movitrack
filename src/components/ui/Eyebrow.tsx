import { cn } from "@/lib/utils";

export default function Eyebrow({
  index,
  children,
  className,
  light,
}: {
  index?: string;
  children: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-data text-[11px] uppercase tracking-[0.28em]",
        light ? "text-ink/50" : "text-white/45",
        className
      )}
    >
      <span className="h-px w-8 bg-signal" aria-hidden />
      {index && <span className="text-signal">{index}</span>}
      <span>{children}</span>
    </div>
  );
}
