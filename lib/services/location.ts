import { AFTER_HOURS_VETS, CENTRES, type AfterHoursVet, type Centre } from "@/lib/mocks/centres";
import { formatTime, minutesOfDay } from "@/lib/time";

// LocationService — centres, opening hours and "near me".
// Mock: an in-memory list of centres and invented after-hours vets.
// Real: centre data from the CMS (or the animal-management system), browser geolocation
// on the client, and a maintained list of partner after-hours clinics.

export type Coords = { lat: number; lng: number };
export type OpenStatus = { open: boolean; label: string; todayLabel: string };

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const LocationService = {
  centres(): Centre[] {
    return CENTRES;
  },
  getCentre(id: string | null | undefined): Centre | null {
    return CENTRES.find((c) => c.id === id) ?? null;
  },
  nearestCentre(at: Coords): Centre {
    return [...CENTRES].sort((a, b) => distanceKm(at, a) - distanceKm(at, b))[0];
  },
  nearestAfterHoursVet(at: Coords): AfterHoursVet & { km: number } {
    const [vet] = [...AFTER_HOURS_VETS].sort((a, b) => distanceKm(at, a) - distanceKm(at, b));
    return { ...vet, km: distanceKm(at, vet) };
  },
  hoursFor(centre: Centre, day: number) {
    const h = centre.hours[day];
    return h ? `${formatTime(h[0])}–${formatTime(h[1])}` : "Closed";
  },
  weekHours(centre: Centre) {
    return [1, 2, 3, 4, 5, 6, 0].map((day) => ({ day: DAY[day], hours: LocationService.hoursFor(centre, day) }));
  },
  status(centre: Centre, now: Date): OpenStatus {
    const day = now.getUTCDay();
    const mins = minutesOfDay(now);
    const today = centre.hours[day];
    const todayLabel = LocationService.hoursFor(centre, day);
    if (today && mins >= today[0] && mins < today[1]) {
      return { open: true, label: `Open now · closes ${formatTime(today[1])}`, todayLabel };
    }
    for (let i = 0; i < 7; i++) {
      const d = (day + i) % 7;
      const h = centre.hours[d];
      if (!h) continue;
      if (i === 0 && mins < h[0]) return { open: false, label: `Closed · opens ${formatTime(h[0])} today`, todayLabel };
      if (i > 0) return { open: false, label: `Closed · opens ${i === 1 ? "tomorrow" : DAY[d]} ${formatTime(h[0])}`, todayLabel };
    }
    return { open: false, label: "Closed", todayLabel };
  },
};
