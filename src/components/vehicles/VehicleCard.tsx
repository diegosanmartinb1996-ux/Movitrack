"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Cog, Gauge, Heart } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import VehicleMedia from "@/components/ui/VehicleMedia";
import StatusTag from "@/components/ui/StatusTag";
import { cn, formatCLP, formatKm, vehicleTitle } from "@/lib/utils";
import { useFavorites } from "@/lib/useFavorites";

/** Estados que se muestran como banda diagonal en la esquina, no como etiqueta. */
const RIBBON_STATUS: Partial<Record<Vehicle["status"], string>> = {
  vendido: "Vendido",
  reservado: "Reservado",
};

export default function VehicleCard({
  vehicle,
  index = "01",
}: {
  vehicle: Vehicle;
  index?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(vehicle.id);
  const ribbon = RIBBON_STATUS[vehicle.status];

  return (
    <Link
      href={`/vehiculos/${vehicle.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-soft transition-all duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicleTitle(vehicle)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <VehicleMedia
            tone={vehicle.tone}
            label={`${vehicle.brand} ${vehicle.model}`}
            index={index}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        )}

        {/* Velo inferior: asienta la foto sobre el cuerpo de la tarjeta */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-soft/90 to-transparent"
          aria-hidden
        />

        {ribbon ? (
          <div className="corner-ribbon" aria-hidden>
            <span className="bg-signal font-data text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              {ribbon}
            </span>
          </div>
        ) : (
          <div className="absolute left-3 top-3 z-10">
            <StatusTag status={vehicle.status} />
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(vehicle.id);
          }}
          aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          className={cn(
            "absolute z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur transition-colors hover:bg-ink",
            ribbon ? "left-3 top-3" : "right-3 top-3"
          )}
        >
          <Heart size={15} className={cn(favorite && "fill-signal text-signal")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-data text-xs uppercase tracking-[0.16em] text-white/75">
          {vehicle.brand}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-xl font-semibold leading-snug tracking-tight text-white">
          {vehicle.model} <span className="text-white/85">{vehicle.version}</span>
        </h3>
        {vehicle.featureTag && (
          <p className="mt-1.5 line-clamp-1 text-sm text-white/70">
            {vehicle.featureTag}
          </p>
        )}

        {/* Ficha rápida y precio se anclan al fondo de la tarjeta: quedan a la
            misma altura en toda la fila sin reservar espacio vacío arriba. */}
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {[
            { icon: CalendarDays, label: String(vehicle.year) },
            { icon: Gauge, label: formatKm(vehicle.km) },
            { icon: Cog, label: vehicle.transmission },
          ].map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.07] px-2.5 py-1.5 font-data text-xs uppercase tracking-[0.06em] text-white/95"
            >
              <Icon size={13} className="shrink-0 text-white/65" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="font-data text-[11px] uppercase tracking-[0.16em] text-white/60">
              Precio
            </p>
            <p className="mt-1 font-display text-2xl font-semibold leading-none text-white">
              {formatCLP(vehicle.price)}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-white">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
