"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import VehicleMedia from "@/components/ui/VehicleMedia";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/data/vehicles";

const ANGLES = ["Frontal 3/4", "Lateral", "Interior", "Trasera"];

export default function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [active, setActive] = useState(0);
  const images = vehicle.images ?? [];
  const hasPhotos = images.length > 0;

  const stripRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  function onPointerDown(e: React.PointerEvent) {
    if (!stripRef.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: stripRef.current.scrollLeft,
      moved: false,
    };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active || !stripRef.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    stripRef.current.scrollLeft = drag.current.startScroll - dx;
  }
  function onPointerUp() {
    drag.current.active = false;
  }

  if (hasPhotos) {
    return (
      <div>
        <div className="bracket-frame relative aspect-[16/9] overflow-hidden bg-ink-soft">
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
          <div
            ref={stripRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="mt-3 flex cursor-grab gap-3 overflow-x-auto pb-1 active:cursor-grabbing"
          >
            {images.slice(0, 16).map((src, i) => (
              <button
                key={src}
                onClick={() => {
                  if (!drag.current.moved) setActive(i);
                }}
                className={cn(
                  "relative aspect-[4/3] h-20 shrink-0 select-none overflow-hidden border transition-colors sm:h-24",
                  i === active ? "border-signal" : "border-white/10 hover:border-white/30"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  draggable={false}
                  sizes="120px"
                  className="pointer-events-none object-cover"
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
