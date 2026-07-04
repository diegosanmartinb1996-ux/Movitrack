"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import VehicleCard from "@/components/vehicles/VehicleCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import Pagination from "@/components/catalog/Pagination";

export type CatalogFilters = {
  brands: string[];
  bodyTypes: string[];
  fuels: string[];
  transmissions: string[];
  maxPrice: number | null;
  minYear: number | null;
};

const EMPTY_FILTERS: CatalogFilters = {
  brands: [],
  bodyTypes: [],
  fuels: [],
  transmissions: [],
  maxPrice: null,
  minYear: null,
};

const SORT_OPTIONS = [
  { value: "destacados", label: "Destacados" },
  { value: "recientes", label: "Más recientes" },
  { value: "vistos", label: "Más vistos" },
  { value: "km-asc", label: "Menor kilometraje" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

const PAGE_SIZE = 8;

export default function CatalogClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("destacados");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
    [vehicles]
  );

  const filtered = useMemo(() => {
    let result = vehicles.filter((v) => {
      if (filters.brands.length && !filters.brands.includes(v.brand)) return false;
      if (filters.bodyTypes.length && !filters.bodyTypes.includes(v.bodyType)) return false;
      if (filters.fuels.length && !filters.fuels.includes(v.fuel)) return false;
      if (filters.transmissions.length && !filters.transmissions.includes(v.transmission))
        return false;
      if (filters.maxPrice !== null && v.price > filters.maxPrice) return false;
      if (filters.minYear !== null && v.year < filters.minYear) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "recientes":
          return a.daysListed - b.daysListed;
        case "vistos":
          return b.views - a.views;
        case "km-asc":
          return a.km - b.km;
        case "precio-asc":
          return a.price - b.price;
        case "precio-desc":
          return b.price - a.price;
        default: {
          const rank: Record<string, number> = {
            destacado: 0,
            "nuevo-ingreso": 1,
            oportunidad: 2,
            reservado: 3,
            vendido: 4,
          };
          return rank[a.status] - rank[b.status];
        }
      }
    });

    return result;
  }, [vehicles, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilters = (next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
  };

  const updateSort = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <FilterSidebar
          brands={brands}
          filters={filters}
          setFilters={updateFilters}
          onClear={() => updateFilters(EMPTY_FILTERS)}
        />
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <p className="font-data text-xs uppercase tracking-[0.14em] text-white/45">
            {filtered.length} vehículo{filtered.length !== 1 && "s"} en venta
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-white/20 px-3 py-2 font-data text-[11px] uppercase tracking-[0.14em] text-white/70 lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filtros
            </button>

            <select
              value={sortBy}
              onChange={(e) => updateSort(e.target.value)}
              className="border border-white/20 bg-ink px-3 py-2 font-data text-[11px] uppercase tracking-[0.14em] text-white focus:border-signal focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
            {vehicles.length === 0 ? (
              <>
                <p className="font-display text-2xl font-semibold">
                  Pronto, nuevo stock
                </p>
                <p className="max-w-sm text-sm text-white/50">
                  Estamos preparando nuestros vehículos. Escríbenos por WhatsApp y
                  te contamos qué tenemos disponible.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-semibold">Sin resultados</p>
                <p className="max-w-sm text-sm text-white/50">
                  No hay vehículos que coincidan con estos filtros. Prueba ajustando
                  el precio, año o marca.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={String(i + 1).padStart(2, "0")} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs overflow-y-auto bg-ink px-6 py-6">
            <div className="flex items-center justify-between pb-4">
              <span className="font-data text-xs uppercase tracking-[0.2em] text-white/50">
                Filtros
              </span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Cerrar filtros">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              brands={brands}
              filters={filters}
              setFilters={updateFilters}
              onClear={() => updateFilters(EMPTY_FILTERS)}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full bg-signal py-3 font-data text-xs uppercase tracking-[0.14em] text-white"
            >
              Ver {filtered.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
