"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import VehicleMedia from "@/components/ui/VehicleMedia";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/data/vehicles";

const ANGLES = ["Frontal 3/4", "Lateral", "Interior", "Trasera"];
const VISIBLE_THUMBS = 8;
const MAX_PHOTOS = 16;

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const images = vehicle.images ?? [];
  const hasPhotos = images.length > 0;
  const gallery = images.slice(0, MAX_PHOTOS);
  const extraCount = gallery.length - VISIBLE_THUMBS;

  useEffect(() => {
    if (!showAll) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowAll(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showAll]);

  if (hasPhotos) {
    return (
      <div>
        <div className="bracket-frame relative aspect-[16/10] overflow-hidden bg-ink-soft">
          <Image
            src={gallery[active]}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.slice(0, VISIBLE_THUMBS).map((src, i) => {
              const isLastVisible = i === VISIBLE_THUMBS - 1 && extraCount > 0;
              return (
                <button
                  key={src}
                  onClick={() => (isLastVisible ? setShowAll(true) : setActive(i))}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden border transition-colors",
                    i === active ? "border-signal" : "border-white/10 hover:border-white/30"
                  )}
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  {isLastVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/70 font-data text-sm text-white">
                      +{extraCount} fotos
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {showAll && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            onClick={() => setShowAll(false)}
          >
            <button
              onClick={() => setShowAll(false)}
              className="absolute right-4 top-4 text-white/70 transition-colors hover:text-white"
              aria-label="Cerrar galería"
            >
              <X size={28} />
            </button>
            <div
              className="grid max-h-[85vh] w-full max-w-4xl grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => {
                    setActive(i);
                    setShowAll(false);
                  }}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden border transition-colors",
                    i === active ? "border-signal" : "border-white/10 hover:border-white/30"
                  )}
                >
                  <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                </button>
              ))}
            </div>
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
