// The impact ladder published on spca.nz/donate (checked 27 Sep 2026).
export type Impact = { amount: number; outcome: string; short: string; icon: "rabbit" | "bed" | "kitten" | "heart" };

export const IMPACT_LADDER: Impact[] = [
  { amount: 30, outcome: "vaccinates a rabbit", short: "a rabbit vaccinated", icon: "rabbit" },
  { amount: 210, outcome: "gives a puppy a warm bed for a week", short: "a week of warm bed for a puppy", icon: "bed" },
  { amount: 500, outcome: "desexes a litter of 5 kittens", short: "a litter of 5 kittens desexed", icon: "kitten" },
  { amount: 720, outcome: "helps provide life-saving surgery", short: "life-saving surgery", icon: "heart" },
];

/** The ladder step closest to any amount. */
export function nearestImpact(amount: number): Impact {
  return IMPACT_LADDER.reduce((best, step) =>
    Math.abs(step.amount - amount) < Math.abs(best.amount - amount) ? step : best,
  );
}
