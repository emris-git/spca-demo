"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimalCard } from "@/components/AnimalCard";
import { Icon } from "@/components/Icon";
import { LocationPicker } from "@/components/LocationPicker";
import { Sheet } from "@/components/Sheet";
import { useFavourites } from "@/lib/favourites";
import { ENERGY_LABEL, SIZE_LABEL, SPECIES_LABEL, type AgeGroup, type Energy, type Size, type Species } from "@/lib/mocks/animals";
import type { Listing } from "@/lib/services/adoption";
import { Analytics } from "@/lib/services/analytics";
import { LocationService } from "@/lib/services/location";
import { btn } from "@/lib/ui";
import {
  EMPTY_FILTERS,
  applyFilters,
  countActive,
  filtersToParams,
  parseFilters,
  sortAnimals,
  type ExperienceLevel,
  type Filters,
  type SortKey,
} from "./filters";

const AGE_LABEL: Record<AgeGroup, string> = { young: "Puppy / kitten / young", adult: "Adult", senior: "Senior" };
const EXP_LABEL: Record<ExperienceLevel, string> = {
  any: "Show all",
  "first-time": "I'm a first-timer",
  some: "I've had pets before",
  experienced: "I'm very experienced",
};

type Props = {
  animals: Listing[];
  initialQuery: string;
  hasLocation: boolean;
  centreId: string | null;
};

export function AdoptBrowser({ animals, initialQuery, hasLocation, centreId }: Props) {
  const [filters, setFilters] = useState<Filters>(() => parseFilters(new URLSearchParams(initialQuery)));
  const [sheetOpen, setSheetOpen] = useState(false);
  const favourites = useFavourites();
  const first = useRef(true);

  const sort: SortKey = filters.sort ?? (hasLocation ? "nearest" : "newest");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const qs = filtersToParams(filters).toString();
    window.history.replaceState(null, "", qs ? `/adopt?${qs}` : "/adopt");
  }, [filters]);

  const results = useMemo(
    () => sortAnimals(applyFilters(animals, filters, favourites), sort),
    [animals, filters, favourites, sort],
  );
  const newestIds = useMemo(
    () => new Set([...animals].sort((a, b) => a.daysInCare - b.daysInCare).slice(0, 4).map((a) => a.id)),
    [animals],
  );

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    Analytics.track("adopt_filter", Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, String(v)])));
  };
  const toggle = <T extends string>(key: "species" | "age" | "size" | "energy", value: T) =>
    setFilters((f) => {
      const current = f[key] as T[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      Analytics.track("adopt_filter", { [key]: next.join(",") || "none" });
      return { ...f, [key]: next };
    });

  const active = countActive(filters);
  const chips = activeChips(filters);

  const panel = (idPrefix: string) => (
    <FilterPanel idPrefix={idPrefix} filters={filters} toggle={toggle} update={update} />
  );

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-16 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-3xl border border-line bg-paper p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Filters</h2>
            {active ? (
              <button type="button" className="text-sm font-bold text-blue underline" onClick={() => setFilters({ ...EMPTY_FILTERS, sort: filters.sort })}>
                Clear all
              </button>
            ) : null}
          </div>
          {panel("side")}
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setSheetOpen(true)} className={`${btn.dark} min-h-11 px-4 lg:hidden`}>
            <Icon name="sliders" />
            Filters{active ? ` (${active})` : ""}
          </button>
          <button
            type="button"
            onClick={() => update({ saved: !filters.saved })}
            aria-pressed={filters.saved}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-extrabold ${filters.saved ? "border-danger bg-danger-soft text-danger" : "border-line bg-paper text-navy"}`}
          >
            <Icon name="heart" filled={filters.saved} className="size-4" />
            Saved ({favourites.length})
          </button>
          <label className="ml-auto flex items-center gap-2 text-sm font-bold text-navy">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="min-h-11 rounded-full border-2 border-line bg-paper px-3 text-[15px] font-bold text-navy"
            >
              <option value="nearest">Nearest first</option>
              <option value="newest">Newest first</option>
              <option value="long-stay">Waiting longest</option>
            </select>
          </label>
        </div>

        {chips.length ? (
          <ul className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.key} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setFilters((f) => c.remove(f))}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full bg-sky px-3 text-sm font-bold text-blue"
                  aria-label={`Remove filter: ${c.label}`}
                >
                  {c.label}
                  <Icon name="x" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {sort === "nearest" && !hasLocation ? (
          <div className="mt-4 rounded-3xl border border-line bg-paper p-4">
            <p className="font-extrabold text-navy">Sort by distance from you</p>
            <p className="mb-3 text-sm text-muted">Set your location and we&apos;ll put the closest animals first.</p>
            <LocationPicker currentId={centreId} compact />
          </div>
        ) : null}

        <p className="mt-4 text-sm font-bold text-muted" aria-live="polite">
          {results.length === animals.length
            ? `Showing all ${results.length} animals`
            : `${results.length} of ${animals.length} animals match`}
          {sort === "nearest" && hasLocation ? " · nearest first" : ""}
        </p>

        <h2 className="sr-only">Results</h2>
        {results.length ? (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((a, i) => (
              <li key={a.id}>
                <AnimalCard animal={a} priority={i === 0} isNew={newestIds.has(a.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-paper p-8 text-center">
            <p className="font-serif text-xl font-bold text-navy">
              {filters.saved && favourites.length === 0 ? "No favourites yet" : "No perfect match — yet"}
            </p>
            <p className="mt-2 text-muted">
              {filters.saved && favourites.length === 0
                ? "Tap the heart on any animal to keep them here."
                : "Try removing a filter. New animals arrive every day."}
            </p>
            <button type="button" className={`${btn.primary} mt-4`} onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-8 rounded-3xl bg-sky p-5 text-navy">
          <p className="font-extrabold">Not sure where to start?</p>
          <p className="text-sm">Answer five quick questions and we&apos;ll set the filters for you.</p>
          <Link href="/adopt/match" className={`${btn.primary} mt-3`}>
            Take the 60-second quiz
          </Link>
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters" description={`${results.length} animals match`}>
        {panel("sheet")}
        <div className="sticky bottom-0 -mx-5 mt-4 flex gap-3 border-t border-line bg-paper px-5 pt-3">
          <button type="button" className={`${btn.secondary} flex-1`} onClick={() => setFilters({ ...EMPTY_FILTERS, sort: filters.sort })}>
            Clear all
          </button>
          <button type="button" className={`${btn.primary} flex-1`} onClick={() => setSheetOpen(false)}>
            Show {results.length}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function activeChips(f: Filters) {
  const chips: { key: string; label: string; remove: (f: Filters) => Filters }[] = [];
  f.species.forEach((s) => chips.push({ key: `s-${s}`, label: SPECIES_LABEL[s], remove: (x) => ({ ...x, species: x.species.filter((v) => v !== s) }) }));
  if (f.kids) chips.push({ key: "kids", label: "Good with children", remove: (x) => ({ ...x, kids: false }) });
  if (f.pets) chips.push({ key: "pets", label: "Good with other animals", remove: (x) => ({ ...x, pets: false }) });
  f.energy.forEach((e) => chips.push({ key: `e-${e}`, label: ENERGY_LABEL[e], remove: (x) => ({ ...x, energy: x.energy.filter((v) => v !== e) }) }));
  if (f.exp !== "any") chips.push({ key: "exp", label: EXP_LABEL[f.exp], remove: (x) => ({ ...x, exp: "any" }) });
  f.age.forEach((a) => chips.push({ key: `a-${a}`, label: AGE_LABEL[a], remove: (x) => ({ ...x, age: x.age.filter((v) => v !== a) }) }));
  f.size.forEach((s) => chips.push({ key: `z-${s}`, label: `${SIZE_LABEL[s]} size`, remove: (x) => ({ ...x, size: x.size.filter((v) => v !== s) }) }));
  if (f.centre) {
    const c = LocationService.getCentre(f.centre);
    chips.push({ key: "centre", label: c ? c.name : f.centre, remove: (x) => ({ ...x, centre: null }) });
  }
  return chips;
}

function FilterPanel({
  idPrefix,
  filters,
  toggle,
  update,
}: {
  idPrefix: string;
  filters: Filters;
  toggle: <T extends string>(key: "species" | "age" | "size" | "energy", value: T) => void;
  update: (patch: Partial<Filters>) => void;
}) {
  return (
    <div className="mt-3 space-y-5">
      <ChipGroup
        legend="Species"
        options={(["dog", "cat", "rabbit", "small"] as Species[]).map((s) => ({ value: s, label: SPECIES_LABEL[s] }))}
        selected={filters.species}
        onToggle={(v) => toggle("species", v)}
      />
      <fieldset>
        <legend className="mb-2 font-extrabold text-navy">Your household</legend>
        <div className="space-y-2">
          <Switch id={`${idPrefix}-kids`} label="Good with children" checked={filters.kids} onChange={(v) => update({ kids: v })} />
          <Switch id={`${idPrefix}-pets`} label="Good with other animals" checked={filters.pets} onChange={(v) => update({ pets: v })} />
        </div>
      </fieldset>
      <ChipGroup
        legend="Energy level"
        hint="New: from ‘couch potato’ to ‘marathon buddy’"
        options={(["low", "medium", "high"] as Energy[]).map((e) => ({ value: e, label: ENERGY_LABEL[e].replace(" energy", "") }))}
        selected={filters.energy}
        onToggle={(v) => toggle("energy", v)}
      />
      <fieldset>
        <legend className="font-extrabold text-navy">Experience needed</legend>
        <p className="mb-2 text-sm text-muted">New: we only show animals that suit your experience.</p>
        <div className="space-y-2">
          {(["any", "first-time", "some", "experienced"] as ExperienceLevel[]).map((level) => (
            <label key={level} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 border-line bg-white px-3 has-[:checked]:border-blue has-[:checked]:bg-sky">
              <input
                type="radio"
                name={`${idPrefix}-exp`}
                value={level}
                checked={filters.exp === level}
                onChange={() => update({ exp: level })}
                className="size-4 accent-blue"
              />
              <span className="text-[15px] font-bold text-navy">{EXP_LABEL[level]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <ChipGroup
        legend="Age"
        options={(["young", "adult", "senior"] as AgeGroup[]).map((a) => ({ value: a, label: AGE_LABEL[a] }))}
        selected={filters.age}
        onToggle={(v) => toggle("age", v)}
      />
      <ChipGroup
        legend="Size"
        options={(["small", "medium", "large"] as Size[]).map((s) => ({ value: s, label: SIZE_LABEL[s] }))}
        selected={filters.size}
        onToggle={(v) => toggle("size", v)}
      />
      <div>
        <label htmlFor={`${idPrefix}-centre`} className="mb-2 block font-extrabold text-navy">
          Centre
        </label>
        <select
          id={`${idPrefix}-centre`}
          value={filters.centre ?? ""}
          onChange={(e) => update({ centre: e.target.value || null })}
          className="min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px] text-navy"
        >
          <option value="">All centres</option>
          {LocationService.centres().map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ChipGroup<T extends string>({
  legend,
  hint,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  hint?: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-extrabold text-navy">{legend}</legend>
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.value)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-[15px] font-bold ${on ? "border-blue bg-blue text-white" : "border-line bg-white text-navy hover:border-navy/40"}`}
            >
              {on ? <Icon name="check" className="size-4" /> : null}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Switch({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-line bg-white px-3">
      <span className="text-[15px] font-bold text-navy">{label}</span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue peer-checked:after:translate-x-5 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue"
      />
    </label>
  );
}
