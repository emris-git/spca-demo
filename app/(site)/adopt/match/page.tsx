import type { Metadata } from "next";
import { MatchQuiz } from "@/components/adopt/MatchQuiz";
import { getDemoState } from "@/lib/demo-server";
import { AdoptionService } from "@/lib/services/adoption";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Match me" };

export default async function MatchPage() {
  const demo = await getDemoState();
  const animals = AdoptionService.list(demo.now, demo.location);
  return (
    <div className={`${container} max-w-2xl pt-8`}>
      <p className={eyebrow}>Match me · about 60 seconds</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Five questions, then your shortlist</h1>
      <p className="mt-2 text-lg">
        Rule out the wrong match before you fall in love with a photo — not at the meet-and-greet.
      </p>
      <MatchQuiz animals={animals} />
    </div>
  );
}
