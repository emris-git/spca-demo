import type { PhotoKey } from "@/lib/photos.generated";

// "Campaign mode": what the home page and the Give page lead with on a given date.
// In a real build this would come from the CMS (a campaign content type with start and end
// dates), not from code.

export type CampaignId = "everyday" | "clear-the-shelters" | "cupcake-day" | "fill-the-bucket" | "christmas" | "kitten-season";
export type Goal = "adopt" | "give" | "help" | "involved";

export type Campaign = {
  id: CampaignId;
  label: string;
  /** Inclusive month/day windows; a window may wrap the new year. */
  windows: { from: [number, number]; to: [number, number] }[];
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    photo: PhotoKey;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  /** Order of the four goal tiles on the home page; the first one is highlighted. */
  goals: Goal[];
  appeal: Appeal;
  adoptionDiscount?: number;
};

export type Appeal = {
  name: string;
  goal: number;
  pitch: string;
  milestones: { at: number; label: string }[];
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "clear-the-shelters",
    label: "Clear the Shelters",
    windows: [{ from: [4, 13], to: [5, 3] }],
    adoptionDiscount: 0.5,
    hero: {
      eyebrow: "Clear the Shelters · on now",
      title: "Half-price adoptions. Full-price love.",
      body: "Every centre, 50% off adoption fees until 3 May. Hundreds of dogs, cats and small friends are ready to go home this week.",
      photo: "hero-run",
      primary: { label: "Find your match", href: "/adopt" },
      secondary: { label: "Take the 60-second quiz", href: "/adopt/match" },
    },
    goals: ["adopt", "give", "involved", "help"],
    appeal: {
      name: "Clear the Shelters",
      goal: 150_000,
      pitch: "Your gift covers the half of the adoption fee we waive, so more animals go home.",
      milestones: [
        { at: 0.33, label: "500 fees covered" },
        { at: 0.66, label: "1,000 fees covered" },
        { at: 1, label: "Every discount funded" },
      ],
    },
  },
  {
    id: "cupcake-day",
    label: "Cupcake Day",
    windows: [{ from: [8, 15], to: [9, 16] }],
    hero: {
      eyebrow: "Cupcake Day · 16 September",
      title: "Bake a difference.",
      body: "Host a bake sale at work, school or home. Sign up, get your kit, and turn icing into vet care.",
      photo: "hero-cupcakes",
      primary: { label: "Sign up to host", href: "/get-involved#fundraise" },
      secondary: { label: "Give instead", href: "/give" },
    },
    goals: ["involved", "give", "adopt", "help"],
    appeal: {
      name: "Cupcake Day",
      goal: 500_000,
      pitch: "Can't bake? Nobody's judging. Give online and we'll count it as a cupcake.",
      milestones: [
        { at: 0.25, label: "1,000 bake sales" },
        { at: 0.5, label: "Every kitten vaccinated" },
        { at: 1, label: "Record Cupcake Day" },
      ],
    },
  },
  {
    id: "fill-the-bucket",
    label: "Fill the Bucket",
    windows: [{ from: [10, 1], to: [10, 18] }],
    hero: {
      eyebrow: "Fill the Bucket · 16–18 October",
      title: "No cash? No problem. Fill the bucket online.",
      body: "Our street appeal is back. Grab a bucket for an hour, or drop a virtual coin in from your phone.",
      photo: "hero-pat",
      primary: { label: "Fill the bucket", href: "/give" },
      secondary: { label: "Collect for an hour", href: "/get-involved#volunteer" },
    },
    goals: ["give", "involved", "adopt", "help"],
    appeal: {
      name: "Fill the Bucket",
      goal: 400_000,
      pitch: "Every bucket pays for rescues, vet care and warm beds across all 27 centres.",
      milestones: [
        { at: 0.25, label: "100 rescues funded" },
        { at: 0.5, label: "Every centre's vet bill covered for a week" },
        { at: 1, label: "Buckets full" },
      ],
    },
  },
  {
    id: "christmas",
    label: "Christmas appeal",
    windows: [{ from: [12, 1], to: [12, 24] }],
    hero: {
      eyebrow: "Christmas appeal",
      title: "The best present fits in a dog bed.",
      body: "This Christmas, give an animal in our care a warm bed, a full bowl and the vet care they need.",
      photo: "hero-bed",
      primary: { label: "Give a Christmas gift", href: "/give" },
      secondary: { label: "Meet the animals", href: "/adopt" },
    },
    goals: ["give", "adopt", "involved", "help"],
    appeal: {
      name: "Christmas appeal",
      goal: 600_000,
      pitch: "Our centres don't close for Christmas. Neither does the need.",
      milestones: [
        { at: 0.25, label: "1,000 warm beds" },
        { at: 0.5, label: "Holiday vet care covered" },
        { at: 1, label: "A Christmas for every animal" },
      ],
    },
  },
  {
    id: "kitten-season",
    label: "Kitten season",
    windows: [{ from: [12, 25], to: [2, 28] }],
    hero: {
      eyebrow: "Kitten season",
      title: "It's raining kittens. Got a spare room?",
      body: "Summer brings thousands of kittens into care. Fosterers give them a home until they're ready for yours.",
      photo: "hero-kittens",
      primary: { label: "Foster a litter", href: "/get-involved#foster" },
      secondary: { label: "Adopt a kitten", href: "/adopt?species=cat&age=young" },
    },
    goals: ["involved", "adopt", "give", "help"],
    appeal: {
      name: "Kitten season appeal",
      goal: 250_000,
      pitch: "Formula, vaccinations and desexing for every kitten that comes through our doors.",
      milestones: [
        { at: 0.25, label: "1,000 kittens vaccinated" },
        { at: 0.5, label: "500 litters desexed" },
        { at: 1, label: "Every kitten covered" },
      ],
    },
  },
  {
    id: "everyday",
    label: "Everyday",
    windows: [],
    hero: {
      eyebrow: "Adopt · Give · Get help · Get involved",
      title: "Cheaper than a midlife crisis. Much better at cuddles.",
      body: "Thousands of animals in our care are waiting for their people. Find yours, fund a rescue, or tell us about an animal in trouble.",
      photo: "hero-hug",
      primary: { label: "Meet the animals", href: "/adopt" },
      secondary: { label: "Give today", href: "/give" },
    },
    goals: ["adopt", "give", "help", "involved"],
    appeal: {
      name: "Spring appeal: ready for kitten season",
      goal: 200_000,
      pitch: "Kitten season starts in December. Help us stock up on vaccines, formula and warm beds now.",
      milestones: [
        { at: 0.25, label: "500 kittens vaccinated" },
        { at: 0.5, label: "Every centre stocked with formula" },
        { at: 1, label: "Ready for kitten season" },
      ],
    },
  },
];
