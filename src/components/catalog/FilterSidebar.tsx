"use client";

import { cn } from "@/lib/utils";
import type { CatalogFilters } from "@/components/catalog/CatalogClient";

const BODY_TYPES = ["SUV", "Sedán", "Camioneta", "Hatchback", "Van", "Furgón"];
const FUELS = ["Bencina", "Diésel", "Híbrido", "Eléctrico"];
const TRANSMISSIONS = ["Automática", "Manual"];
const PRICE_CEILINGS = [10000000, 15000000, 20000000, 25000000, 30000000];
const YEAR_FLOORS = [2023, 2022, 2021, 2020, 2019, 2018];

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 py-6 first:pt-0">
      <h3 className="font-data text-[11px] uppercase tracking-[0.2em] text-white/65">{title}</h3>
      <div className="mt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70 hover:text-white">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          checked ? "border-signal bg-signal" : "border-white/25 bg-transparent"
        )}
      >
        {checked && <span className="h-1.5 w-1.5 bg-white" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

export default function FilterSidebar({
  brands,
  filters,
  setFilters,
  onClear,
}: {
  brands: string[];
  filters: CatalogFilters;
  setFilters: (f: CatalogFilters) => void;
  onClear: () => void;
}) {
  const toggle = (key: "brands" | "bodyTypes" | "fuels" | "transmissions", value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: next });
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.bodyTypes.length > 0 ||
    filters.fuels.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.maxPrice !== null ||
    filters.minYear !== null;

  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <h2 className="font-display text-lg font-semibold tracking-tight">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="font-data text-[11px] uppercase tracking-[0.14em] text-signal hover:text-signal-glow"
          >
            Limpiar
          </button>
        )}
      </div>

      <FilterGroup title="Tipo de vehículo">
        {BODY_TYPES.map((type) => (
          <Checkbox
            key={type}
            label={type}
            checked={filters.bodyTypes.includes(type)}
            onChange={() => toggle("bodyTypes", type)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Marca">
        {brands.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => toggle("brands", brand)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Precio máximo">
        <select
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })
          }
          className="w-full border border-white/20 bg-ink px-3 py-2.5 text-sm text-white focus:border-signal focus:outline-none"
        >
          <option value="">Sin límite</option>
          {PRICE_CEILINGS.map((price) => (
            <option key={price} value={price}>
              Hasta ${price.toLocaleString("es-CL")}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Año desde">
        <select
          value={filters.minYear ?? ""}
          onChange={(e) =>
            setFilters({ ...filters, minYear: e.target.value ? Number(e.target.value) : null })
          }
          className="w-full border border-white/20 bg-ink px-3 py-2.5 text-sm text-white focus:border-signal focus:outline-none"
        >
          <option value="">Cualquier año</option>
          {YEAR_FLOORS.map((year) => (
            <option key={year} value={year}>
              Desde {year}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Transmisión">
        {TRANSMISSIONS.map((t) => (
          <Checkbox
            key={t}
            label={t}
            checked={filters.transmissions.includes(t)}
            onChange={() => toggle("transmissions", t)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Combustible">
        {FUELS.map((fuel) => (
          <Checkbox
            key={fuel}
            label={fuel}
            checked={filters.fuels.includes(fuel)}
            onChange={() => toggle("fuels", fuel)}
          />
        ))}
      </FilterGroup>
    </div>
  );
}
