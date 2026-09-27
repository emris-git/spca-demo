// The impact ladder published on spca.nz/donate (checked 27 Sep 2026).
export type Impact = {
  amount: number;
  outcome: string;
  short: string;
  /** "Your $30 just …" */
  past: string;
  /** "… enough to …" */
  base: string;
  icon: "rabbit" | "bed" | "kitten" | "heart";
};

export const IMPACT_LADDER: Impact[] = [
  { amount: 30, outcome: "vaccinates a rabbit", short: "a rabbit vaccinated", past: "vaccinated a rabbit", base: "vaccinate a rabbit", icon: "rabbit" },
  { amount: 210, outcome: "gives a puppy a warm bed for a week", short: "a warm bed for a puppy", past: "gave a puppy a warm bed for a week", base: "give a puppy a warm bed for a week", icon: "bed" },
  { amount: 500, outcome: "desexes a litter of 5 kittens", short: "a litter of kittens desexed", past: "desexed a litter of 5 kittens", base: "desex a litter of 5 kittens", icon: "kitten" },
  { amount: 720, outcome: "helps provide life-saving surgery", short: "life-saving surgery", past: "helped provide life-saving surgery", base: "help provide life-saving surgery", icon: "heart" },
];

/** The ladder step closest to any amount. */
export function nearestImpact(amount: number): Impact {
  return IMPACT_LADDER.reduce((best, step) =>
    Math.abs(step.amount - amount) < Math.abs(best.amount - amount) ? step : best,
  );
}
