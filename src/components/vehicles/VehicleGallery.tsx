"use client";

import { useState } from "react";
import Image from "next/image";
import VehicleMedia from "@/components/ui/VehicleMedia";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/data/vehicles";

const ANGLES = ["Frontal 3/4", "Lateral", "Interior", "Trasera"];

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const images = vehicle.images ?? [];
  const hasPhotos = images.length > 0;

  if (hasPhotos) {
    return (
      <div>
        <div className="bracket-frame relative aspect-[16/10] overflow-hidden bg-ink-soft">
          <Image
            src={images[active]}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {images.slice(0, 16).map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-[4/3] w-20 shrink-0 overflow-hidden border transition-colors sm:w-24",
                  i === active ? "border-signal" : "border-white/10 hover:border-white/30"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="bracket-frame relative aspect-[16/10] overflow-hidden">
        <VehicleMedia
          tone={vehicle.tone}
          label={ANGLES[active]}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {ANGLES.map((angle, i) => (
          <button
            key={angle}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden border transition-colors",
              i === active ? "border-signal" : "border-white/10 hover:border-white/30"
            )}
          >
            <VehicleMedia
              tone={vehicle.tone}
              label={angle}
              className="absolute inset-0 h-full w-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
