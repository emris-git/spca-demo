import { ANIMALS, LONG_STAY_DAYS, type Animal } from "@/lib/mocks/animals";
import { LocationService, distanceKm, type Coords } from "./location";
import { addDays } from "@/lib/time";

// AdoptionService — listings, profiles and the hand-off to the adoption platform.
// Mock: the in-memory ANIMALS list; the hand-off builds a URL but never leaves the demo.
// Real: a read API over the animal-management system (listings refreshed every few
// minutes and cached), and a deep link into Adopets carrying the animal ID, the centre and
// UTM tags so applications can be attributed back to the page and campaign.

export type Listing = Animal & { listedAt: Date; longStay: boolean; km: number | null };

export type HandoffContext = { campaign: string; source: string; now: Date };

export const ADOPETS_MOCK_BASE = "https://adopt.adopets.example/spca-nz/apply";

export const AdoptionService = {
  list(now: Date, from: Coords | null): Listing[] {
    return ANIMALS.map((a) => {
      const centre = LocationService.getCentre(a.centreId)!;
      return {
        ...a,
        listedAt: addDays(now, -a.daysInCare),
        longStay: a.daysInCare >= LONG_STAY_DAYS,
        km: from ? distanceKm(from, centre) : null,
      };
    });
  },
  get(id: string, now: Date, from: Coords | null): Listing | null {
    return AdoptionService.list(now, from).find((a) => a.id.toLowerCase() === id.toLowerCase()) ?? null;
  },
  ids() {
    return ANIMALS.map((a) => a.id);
  },
  fee(animal: Animal, discount = 0) {
    return Math.round(animal.fee * (1 - discount));
  },
  /** What the real hand-off link would carry. Never fetched or opened by the demo. */
  handoffUrl(animal: Animal, ctx: HandoffContext) {
    const url = new URL(ADOPETS_MOCK_BASE);
    url.searchParams.set("animal_id", animal.id);
    url.searchParams.set("centre", animal.centreId);
    url.searchParams.set("utm_source", "spca.nz");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", ctx.campaign);
    url.searchParams.set("utm_content", ctx.source);
    return url.toString();
  },
};
