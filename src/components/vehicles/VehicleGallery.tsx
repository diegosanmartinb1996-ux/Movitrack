"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import VehicleMedia from "@/components/ui/VehicleMedia";
import { cn, vehicleTitle } from "@/lib/utils";
import type { Vehicle } from "@/data/vehicles";

const ANGLES = ["Frontal 3/4", "Lateral", "Interior", "Trasera"];
const VISIBLE_THUMBS = 8;
const MAX_PHOTOS = 16;

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = vehicle.images ?? [];
  const hasPhotos = images.length > 0;
  const gallery = images.slice(0, MAX_PHOTOS);
  const extraCount = gallery.length - VISIBLE_THUMBS;

  const goPrev = () => setActive((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const goNext = () => setActive((i) => (i === gallery.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!showAll && !lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowAll(false);
        setLightboxOpen(false);
      }
      if (lightboxOpen && e.key === "ArrowLeft") goPrev();
      if (lightboxOpen && e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showAll, lightboxOpen, gallery.length]);

  if (hasPhotos) {
    return (
      <div>
        <div className="bracket-frame group relative aspect-[16/10] w-full overflow-hidden bg-ink-soft">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ver foto en grande"
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              src={gallery[active]}
              alt={vehicleTitle(vehicle)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/30">
              <ZoomIn
                size={32}
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goPrev()}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-signal"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                type="button"
                onClick={() => goNext()}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-signal"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
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

        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 text-white/70 transition-colors hover:text-white"
              aria-label="Cerrar foto"
            >
              <X size={28} />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-signal sm:left-6"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white transition-colors hover:bg-signal sm:right-6"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <div
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={gallery[active]}
                alt={vehicleTitle(vehicle)}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-data text-xs text-white/70">
                {active + 1} / {gallery.length}
              </div>
            )}
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
