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
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <VehicleMedia
            tone={vehicle.tone}
            label={`${vehicle.brand} ${vehicle.model}`}
            index={index}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

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
      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-data text-[11px] uppercase tracking-[0.16em] text-white/80">
              {vehicle.brand}
            </p>
            <h3 className="mt-1 line-clamp-2 min-h-[2.5em] font-display text-xl font-semibold leading-tight tracking-tight">
              {vehicle.model} <span className="text-white/85">{vehicle.version}</span>
            </h3>
          </div>
          <p className="whitespace-nowrap font-display text-xl font-semibold text-white">
            {formatCLP(vehicle.price)}
          </p>
        </div>
        <p className="mt-3 font-data text-[13px] uppercase tracking-[0.08em] text-white/90">
          {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.transmission}
        </p>
        {vehicle.featureTag && (
          <p className="mt-1.5 text-[13px] text-white/75">{vehicle.featureTag}</p>
        )}
      </div>
    </Link>
  );
}
