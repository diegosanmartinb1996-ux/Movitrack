import { cn } from "@/lib/utils";

export type VehicleStatus =
  | "destacado"
  | "nuevo-ingreso"
  | "disponible"
  | "oportunidad"
  | "precio-rebajado"
  | "reservado"
  | "vendido";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  destacado: "Destacado",
  "nuevo-ingreso": "Nuevo ingreso",
  disponible: "Disponible",
  oportunidad: "Oportunidad",
  "precio-rebajado": "Precio rebajado",
  reservado: "Reservado",
  vendido: "Vendido",
};

export default function StatusTag({
  status,
  className,
}: {
  status: VehicleStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-white px-2.5 py-1.5 font-data text-[11px] font-semibold uppercase tracking-[0.14em] text-ink",
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
