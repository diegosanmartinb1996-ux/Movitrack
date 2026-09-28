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
        "flex items-center gap-3 font-display text-[16px] font-semibold uppercase tracking-[0.1em]",
        light ? "text-ink/50" : "text-white/65",
        className
      )}
    >
      {index && <span className="text-signal">{index}</span>}
      <span>{children}</span>
    </div>
  );
}
