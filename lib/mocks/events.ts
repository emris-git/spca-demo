// Mock but realistic calendar. National moments follow SPCA's public 2026 campaign dates;
// centre events are invented samples. Everything is generated per year so the calendar
// works for whichever date the Demo panel simulates.

export type EventKind = "campaign" | "fundraiser" | "open-day" | "adoption" | "volunteer" | "foster";
export type CtaAction = "adopt" | "donate" | "volunteer" | "signup" | "foster";

export type SpcaEvent = {
  id: string;
  title: string;
  kind: EventKind;
  start: string; // YYYY-MM-DD, NZ date
  end: string;
  centreId: string | null; // null = nationwide
  summary: string;
  cta: { label: string; action: CtaAction; href: string };
};

export const KIND_LABEL: Record<EventKind, string> = {
  campaign: "Campaign",
  fundraiser: "Fundraiser",
  "open-day": "Open day",
  adoption: "Adoption event",
  volunteer: "Volunteering",
  foster: "Fostering",
};

const pad = (n: number) => String(n).padStart(2, "0");
const d = (y: number, m: number, day: number) => `${y}-${pad(m)}-${pad(day)}`;

/** The nth Saturday of a month (1-based). */
function saturday(y: number, m: number, nth: number) {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const day = 1 + ((6 - first + 7) % 7) + (nth - 1) * 7;
  return d(y, m, day);
}

export function eventsForYear(y: number): SpcaEvent[] {
  return [
    {
      id: `open-day-dunedin-${y}`, title: "Dunedin Centre open day", kind: "open-day",
      start: saturday(y, 2, 3), end: saturday(y, 2, 3), centreId: "dunedin",
      summary: "Meet the team, tour the new cattery and say hi to animals looking for homes.",
      cta: { label: "Meet the animals", action: "adopt", href: "/adopt?centre=dunedin" },
    },
    {
      id: `open-day-wellington-${y}`, title: "Wellington Centre open day", kind: "open-day",
      start: saturday(y, 3, 2), end: saturday(y, 3, 2), centreId: "wellington",
      summary: "Behind-the-scenes tours, a sausage sizzle and adoption meet-and-greets.",
      cta: { label: "Meet the animals", action: "adopt", href: "/adopt?centre=wellington" },
    },
    {
      id: `clear-the-shelters-${y}`, title: "Clear the Shelters", kind: "campaign",
      start: d(y, 4, 13), end: d(y, 5, 3), centreId: null,
      summary: "Three weeks, every centre, 50% off adoption fees. Thousands of animals in care and more than a thousand ready to go home.",
      cta: { label: "Find your match", action: "adopt", href: "/adopt" },
    },
    {
      id: `adoption-day-waikato-${y}`, title: "Waikato adoption day", kind: "adoption",
      start: saturday(y, 4, 4), end: saturday(y, 4, 4), centreId: "waikato",
      summary: "A Clear the Shelters special: extended hours and same-day meet-and-greets.",
      cta: { label: "Browse Waikato animals", action: "adopt", href: "/adopt?centre=waikato" },
    },
    {
      id: `volunteer-evening-hobsonville-${y}`, title: "Volunteer info evening", kind: "volunteer",
      start: d(y, 6, 11), end: d(y, 6, 11), centreId: "hobsonville",
      summary: "Dog walking, cat cuddling, op shop shifts and more. Come and find the role that fits you.",
      cta: { label: "Register interest", action: "volunteer", href: "/get-involved#volunteer" },
    },
    {
      id: `open-day-auckland-${y}`, title: "Auckland Centre open day", kind: "open-day",
      start: saturday(y, 7, 2), end: saturday(y, 7, 2), centreId: "auckland",
      summary: "Winter warmer open day: blanket drive, tours and adoption meet-and-greets.",
      cta: { label: "Meet the animals", action: "adopt", href: "/adopt?centre=auckland" },
    },
    {
      id: `cupcake-day-signups-${y}`, title: "Cupcake Day registrations open", kind: "fundraiser",
      start: d(y, 8, 15), end: d(y, 9, 15), centreId: null,
      summary: "Sign up to host a bake sale at work, school or home. We send you a kit; you bring the icing.",
      cta: { label: "Sign up to host", action: "signup", href: "/get-involved#fundraise" },
    },
    {
      id: `cupcake-day-${y}`, title: "Cupcake Day", kind: "fundraiser",
      start: d(y, 9, 16), end: d(y, 9, 16), centreId: null,
      summary: "Aotearoa's sweetest fundraiser. Bake, sell, eat, repeat — every cupcake helps animals in care.",
      cta: { label: "Sign up to host", action: "signup", href: "/get-involved#fundraise" },
    },
    {
      id: `fill-the-bucket-${y}`, title: "Fill the Bucket street appeal", kind: "campaign",
      start: d(y, 10, 16), end: d(y, 10, 18), centreId: null,
      summary: "Our national street appeal. Grab a bucket for an hour, or give online if you're not carrying cash.",
      cta: { label: "Collect for an hour", action: "volunteer", href: "/get-involved#volunteer" },
    },
    {
      id: `open-day-tauranga-${y}`, title: "Tauranga Centre open day", kind: "open-day",
      start: saturday(y, 10, 4), end: saturday(y, 10, 4), centreId: "tauranga",
      summary: "Spring open day with a dog-training demo and adoption meet-and-greets.",
      cta: { label: "Meet the animals", action: "adopt", href: "/adopt?centre=tauranga" },
    },
    {
      id: `foster-evening-christchurch-${y}`, title: "Kitten foster training night", kind: "foster",
      start: d(y, 11, 12), end: d(y, 11, 12), centreId: "christchurch",
      summary: "Everything you need to know before kitten season: feeding, cleaning and knowing when to call us.",
      cta: { label: "Save me a seat", action: "signup", href: "/get-involved#foster" },
    },
    {
      id: `open-day-christchurch-${y}`, title: "Christchurch Centre open day", kind: "open-day",
      start: saturday(y, 11, 1), end: saturday(y, 11, 1), centreId: "christchurch",
      summary: "Tours, face painting and animals looking for their people.",
      cta: { label: "Meet the animals", action: "adopt", href: "/adopt?centre=christchurch" },
    },
    {
      id: `christmas-appeal-${y}`, title: "Christmas appeal", kind: "campaign",
      start: d(y, 12, 1), end: d(y, 12, 24), centreId: null,
      summary: "A warm bed, a full bowl and the vet care they need over the holidays.",
      cta: { label: "Give a Christmas gift", action: "donate", href: "/give" },
    },
    {
      id: `kitten-season-${y}`, title: "Kitten season: foster a litter", kind: "foster",
      start: d(y, 12, 1), end: d(y + 1, 2, 28), centreId: null,
      summary: "Kitten season starts in December. Foster carers are the difference between a crowded centre and a calm one.",
      cta: { label: "Become a foster carer", action: "foster", href: "/get-involved#foster" },
    },
  ];
}
