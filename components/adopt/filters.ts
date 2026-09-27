import type { AgeGroup, Energy, Experience, Size, Species } from "@/lib/mocks/animals";
import { ageGroup } from "@/lib/mocks/animals";
import type { Listing } from "@/lib/services/adoption";

export type SortKey = "nearest" | "newest" | "long-stay";
export type ExperienceLevel = "any" | Experience;

export type Filters = {
  species: Species[];
  kids: boolean;
  pets: boolean;
  age: AgeGroup[];
  size: Size[];
  energy: Energy[];
  exp: ExperienceLevel;
  centre: string | null;
  saved: boolean;
  sort: SortKey | null;
};

export const EMPTY_FILTERS: Filters = {
  species: [],
  kids: false,
  pets: false,
  age: [],
  size: [],
  energy: [],
  exp: "any",
  centre: null,
  saved: false,
  sort: null,
};

const SPECIES: Species[] = ["dog", "cat", "rabbit", "small"];
const AGES: AgeGroup[] = ["young", "adult", "senior"];
const SIZES: Size[] = ["small", "medium", "large"];
const ENERGIES: Energy[] = ["low", "medium", "high"];
const EXPERIENCE_RANK: Record<Experience, number> = { "first-time": 0, some: 1, experienced: 2 };

function list<T extends string>(value: string | null, allowed: T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((v): v is T => (allowed as string[]).includes(v));
}

export function parseFilters(params: URLSearchParams): Filters {
  const exp = params.get("exp");
  const sort = params.get("sort");
  return {
    species: list(params.get("species"), SPECIES),
    kids: params.get("kids") === "1",
    pets: params.get("pets") === "1",
    age: list(params.get("age"), AGES),
    size: list(params.get("size"), SIZES),
    energy: list(params.get("energy"), ENERGIES),
    exp: exp === "first-time" || exp === "some" || exp === "experienced" ? exp : "any",
    centre: params.get("centre"),
    saved: params.get("saved") === "1",
    sort: sort === "nearest" || sort === "newest" || sort === "long-stay" ? sort : null,
  };
}

export function filtersToParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.species.length) p.set("species", f.species.join(","));
  if (f.kids) p.set("kids", "1");
  if (f.pets) p.set("pets", "1");
  if (f.age.length) p.set("age", f.age.join(","));
  if (f.size.length) p.set("size", f.size.join(","));
  if (f.energy.length) p.set("energy", f.energy.join(","));
  if (f.exp !== "any") p.set("exp", f.exp);
  if (f.centre) p.set("centre", f.centre);
  if (f.saved) p.set("saved", "1");
  if (f.sort) p.set("sort", f.sort);
  return p;
}

export function applyFilters(animals: Listing[], f: Filters, favourites: string[]) {
  return animals.filter((a) => {
    if (f.species.length && !f.species.includes(a.species)) return false;
    if (f.kids && a.goodWithChildren !== "yes") return false;
    if (f.pets && !a.goodWithAnimals) return false;
    if (f.age.length && !f.age.includes(ageGroup(a))) return false;
    if (f.size.length && !f.size.includes(a.size)) return false;
    if (f.energy.length && !f.energy.includes(a.energy)) return false;
    if (f.exp !== "any" && EXPERIENCE_RANK[a.experience] > EXPERIENCE_RANK[f.exp]) return false;
    if (f.centre && a.centreId !== f.centre) return false;
    if (f.saved && !favourites.includes(a.id)) return false;
    return true;
  });
}

export function sortAnimals(animals: Listing[], sort: SortKey) {
  const out = [...animals];
  if (sort === "nearest") out.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity) || a.daysInCare - b.daysInCare);
  if (sort === "newest") out.sort((a, b) => a.daysInCare - b.daysInCare);
  if (sort === "long-stay") out.sort((a, b) => b.daysInCare - a.daysInCare);
  return out;
}

/** Number of active narrowing filters (sort and saved are shown separately). */
export function countActive(f: Filters) {
  return (
    f.species.length + f.age.length + f.size.length + f.energy.length +
    (f.kids ? 1 : 0) + (f.pets ? 1 : 0) + (f.exp !== "any" ? 1 : 0) + (f.centre ? 1 : 0)
  );
}
