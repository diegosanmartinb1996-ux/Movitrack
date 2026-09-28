"use client";

import { formatCLP, formatKm } from "@/lib/utils";
import { statusLabel } from "@/sanity/vehicleOptions";
import { groupOf, imageUrl, vehicleName, type PanelVehicle } from "./data";
import { PhotoIcon } from "./icons";
import { GROUP_PILL, StatusMenu } from "./StatusMenu";
import s from "./panel.module.css";

export function StatusPill({ vehicle, className }: { vehicle: PanelVehicle; className?: string }) {
  if (vehicle.onlyDraft) {
    return <span className={`${s.pill} ${s.pillBorrador} ${className ?? ""}`}>Borrador</span>;
  }
  return (
    <span className={`${s.pill} ${GROUP_PILL[groupOf(vehicle)]} ${className ?? ""}`}>
      {statusLabel(vehicle.status)}
    </span>
  );
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
  onChangeStatus,
  layout = "grid",
  coverOverride,
}: {
  vehicle: PanelVehicle;
  selected?: boolean;
  /** Sin onSelect la tarjeta es solo una vista previa (paso Revisar). */
  onSelect?: () => void;
  /** Si viene, la etiqueta se puede cambiar desde la misma tarjeta. */
  onChangeStatus?: (status: string) => void;
  layout?: "grid" | "row";
  coverOverride?: string;
}) {
  const meta = [vehicle.year, vehicle.km !== undefined ? formatKm(vehicle.km) : null, vehicle.fuel]
    .filter(Boolean)
    .join(" · ");
  const price = typeof vehicle.price === "number" ? formatCLP(vehicle.price) : "Sin precio";
  const name = vehicleName(vehicle);

  const status = (extra?: string) =>
    onChangeStatus && !vehicle.onlyDraft ? (
      <StatusMenu vehicle={vehicle} onChange={onChangeStatus} className={extra} />
    ) : (
      <StatusPill vehicle={vehicle} className={extra} />
    );

  return (
    <div
      className={`${s.card} ${onSelect ? s.cardClickable : ""} ${layout === "row" ? s.row : ""} ${selected ? s.cardSel : ""}`}
    >
      {layout === "row" ? (
        <>
          <VehiclePhoto vehicle={vehicle} width={240} height={150} className={s.rowPhoto} />
          <div className={s.cardInfo}>
            <span className={s.cardName}>
              {name} {vehicle.version}
            </span>
            <span className={s.cardMeta}>{meta}</span>
          </div>
          <span className={s.cardPrice}>{price}</span>
          {status(s.rowPill)}
        </>
      ) : (
        <>
          <VehiclePhoto vehicle={vehicle} width={640} height={400} coverOverride={coverOverride}>
            {status(s.photoPill)}
          </VehiclePhoto>
          <div className={s.cardInfo}>
            <span className={s.cardName}>{name}</span>
            <span className={s.cardMeta}>{meta}</span>
            <span className={s.cardPrice}>{price}</span>
          </div>
        </>
      )}
      {onSelect && (
        // Cubre toda la tarjeta para abrir el detalle; la etiqueta queda por encima.
        <button
          type="button"
          className={s.cardHit}
          aria-label={`Ver ${name}`}
          aria-pressed={selected}
          onClick={onSelect}
        />
      )}
    </div>
  );
}
