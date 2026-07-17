import { cn } from "@/lib/utils";

export type VehicleStatus =
  | "destacado"
  | "nuevo-ingreso"
  | "oportunidad"
  | "precio-rebajado"
  | "reservado"
  | "vendido";

const STATUS_MAP: Record<VehicleStatus, { label: string; className: string }> = {
  destacado: {
    label: "Destacado",
    className: "bg-signal text-white",
  },
  "nuevo-ingreso": {
    label: "Nuevo ingreso",
    className: "bg-white text-ink",
  },
  oportunidad: {
    label: "Oportunidad",
    className: "border border-signal text-signal bg-ink/60",
  },
  "precio-rebajado": {
    label: "Precio rebajado",
    className: "bg-signal-glow text-white",
  },
  reservado: {
    label: "Reservado",
    className: "bg-white/10 text-white border border-white/25",
  },
  vendido: {
    label: "Vendido",
    className: "bg-ink text-white/70 border border-white/10",
  },
};

export default function StatusTag({
  status,
  className,
}: {
  status: VehicleStatus;
  className?: string;
}) {
  const config = STATUS_MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 font-data text-[10px] uppercase tracking-[0.16em]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
