import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Nombre del auto sin espacios dobles cuando falta la versión u otro dato. */
export function vehicleTitle(
  v: { brand: string; model: string; version?: string; year?: number },
  withYear = false
) {
  return [v.brand, v.model, v.version, withYear ? v.year : null].filter(Boolean).join(" ");
}

export function formatKm(value: number) {
  return `${new Intl.NumberFormat("es-CL").format(value)} km`;
}
