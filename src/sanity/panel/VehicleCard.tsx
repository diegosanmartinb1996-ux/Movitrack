"use client";

import { groupOf, imageUrl, vehicleName, type PanelVehicle } from "./data";
import { formatCLP, formatKm } from "@/lib/utils";
import { PhotoIcon } from "./icons";
import s from "./panel.module.css";

const PILLS = {
  venta: [s.pillVenta, "En venta"],
  reservado: [s.pillReservado, "Reservado"],
  vendido: [s.pillVendido, "Vendido"],
} as const;

export function StatusPill({ vehicle, className }: { vehicle: PanelVehicle; className?: string }) {
  if (vehicle.onlyDraft) {
    return <span className={`${s.pill} ${s.pillBorrador} ${className ?? ""}`}>Borrador</span>;
  }
  const [cls, label] = PILLS[groupOf(vehicle)];
  return <span className={`${s.pill} ${cls} ${className ?? ""}`}>{label}</span>;
}

export function VehiclePhoto({
  vehicle,
  width,
  height,
  className,
  coverOverride,
  children,
}: {
  vehicle: PanelVehicle;
  width: number;
  height: number;
  className?: string;
  coverOverride?: string;
  children?: React.ReactNode;
}) {
  const cover = coverOverride ?? (vehicle.images[0] ? imageUrl(vehicle.images[0], width, height) : null);
  return (
    <div className={`${s.photo} ${className ?? ""}`}>
      {cover ? (
        // Las fotos ya vienen optimizadas desde el CDN de Sanity.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" loading="lazy" />
      ) : (
        <span className={s.noPhoto}>
          <PhotoIcon />
          Sin fotos
        </span>
      )}
      {children}
    </div>
  );
}

export function VehicleCard({
  vehicle,
  selected,
  onSelect,
  layout = "grid",
  coverOverride,
  as = "button",
}: {
  vehicle: PanelVehicle;
  selected?: boolean;
  onSelect?: () => void;
  layout?: "grid" | "row";
  coverOverride?: string;
  as?: "button" | "div";
}) {
  const meta = [vehicle.year, vehicle.km !== undefined ? formatKm(vehicle.km) : null, vehicle.fuel]
    .filter(Boolean)
    .join(" · ");
  const className = `${s.card} ${layout === "row" ? s.row : ""} ${selected ? s.cardSel : ""}`;
  const price = typeof vehicle.price === "number" ? formatCLP(vehicle.price) : "Sin precio";

  const content =
    layout === "row" ? (
      <>
        <VehiclePhoto vehicle={vehicle} width={240} height={150} className={s.rowPhoto} />
        <div className={s.cardInfo}>
          <span className={s.cardName}>
            {vehicleName(vehicle)} {vehicle.version}
          </span>
          <span className={s.cardMeta}>{meta}</span>
        </div>
        <span className={s.cardPrice}>{price}</span>
        <StatusPill vehicle={vehicle} />
      </>
    ) : (
      <>
        <VehiclePhoto vehicle={vehicle} width={640} height={400} coverOverride={coverOverride}>
          <StatusPill vehicle={vehicle} className={s.photoPill} />
        </VehiclePhoto>
        <div className={s.cardInfo}>
          <span className={s.cardName}>{vehicleName(vehicle)}</span>
          <span className={s.cardMeta}>{meta}</span>
          <span className={s.cardPrice}>{price}</span>
        </div>
      </>
    );

  if (as === "div") return <div className={className}>{content}</div>;
  return (
    <button type="button" className={className} onClick={onSelect} aria-pressed={selected}>
      {content}
    </button>
  );
}
