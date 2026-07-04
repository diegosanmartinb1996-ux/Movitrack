"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import VehicleMedia from "@/components/ui/VehicleMedia";
import StatusTag from "@/components/ui/StatusTag";
import { cn, formatCLP, formatKm } from "@/lib/utils";
import { useFavorites } from "@/lib/useFavorites";

export default function VehicleCard({
  vehicle,
  index = "01",
}: {
  vehicle: Vehicle;
  index?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const sold = vehicle.status === "vendido";
  const favorite = isFavorite(vehicle.id);

  return (
    <Link href={`/vehiculos/${vehicle.slug}`} className="group block">
      <div className="bracket-frame relative aspect-[4/3] overflow-hidden">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
              sold && "grayscale"
            )}
          />
        ) : (
          <VehicleMedia
            tone={vehicle.tone}
            label={`${vehicle.brand} ${vehicle.model}`}
            index={index}
            className={cn(
              "h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]",
              sold && "grayscale"
            )}
          />
        )}
        {sold && <div className="absolute inset-0 z-[5] bg-ink/55" aria-hidden />}

        <div className="absolute left-4 bottom-4 z-10 flex gap-2">
          <StatusTag status={vehicle.status} />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(vehicle.id);
          }}
          aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:bg-ink/90"
        >
          <Heart size={15} className={cn(favorite && "fill-signal text-signal")} />
        </button>

        <div className="absolute right-4 bottom-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-data text-[11px] uppercase tracking-[0.16em] text-white/40">
            {vehicle.brand}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
            {vehicle.model} <span className="text-white/50">{vehicle.version}</span>
          </h3>
          <p className="mt-2 font-data text-xs uppercase tracking-[0.1em] text-white/40">
            {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.transmission}
          </p>
          <p className="mt-1 text-xs text-white/35">{vehicle.featureTag}</p>
        </div>
        <p className="whitespace-nowrap font-display text-lg font-semibold text-signal">
          {formatCLP(vehicle.price)}
        </p>
      </div>
    </Link>
  );
}
