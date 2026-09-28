/** Listas compartidas entre el esquema de Sanity y el panel de autos. */

export const FUELS = ["Bencina", "Diésel", "Híbrido", "Eléctrico"] as const;
export const TRANSMISSIONS = ["Automática", "Manual"] as const;
export const TRACTIONS = ["4x2", "4x4", "AWD"] as const;
export const BODY_TYPES = [
  "SUV",
  "Sedán",
  "Camioneta",
  "Camión",
  "Hatchback",
  "Van",
  "Furgón",
] as const;

export const STATUSES = [
  { title: "Destacado", value: "destacado" },
  { title: "Nuevo ingreso", value: "nuevo-ingreso" },
  { title: "Disponible", value: "disponible" },
  { title: "Oportunidad", value: "oportunidad" },
  { title: "Precio rebajado", value: "precio-rebajado" },
  { title: "Reservado", value: "reservado" },
  { title: "Vendido", value: "vendido" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];

/** Etiquetas que significan que el auto sigue a la venta. */
export const FOR_SALE_STATUSES: StatusValue[] = [
  "destacado",
  "nuevo-ingreso",
  "disponible",
  "oportunidad",
  "precio-rebajado",
];

export function statusLabel(value?: string) {
  return STATUSES.find((s) => s.value === value)?.title ?? "Sin etiqueta";
}
