import { cn } from "@/lib/utils";

export type VehicleStatus =
  | "destacado"
  | "nuevo-ingreso"
  | "oportunidad"
  | "precio-rebajado"
  | "reservado"
  | "vendido";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  destacado: "Destacado",
  "nuevo-ingreso": "Nuevo ingreso",
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
        "inline-flex items-center bg-white px-2.5 py-1 font-data text-[10px] font-semibold uppercase tracking-[0.16em] text-ink",
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
