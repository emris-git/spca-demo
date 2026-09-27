"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Listing } from "@/lib/services/adoption";
import { Analytics } from "@/lib/services/analytics";
import { btn } from "@/lib/ui";
import { EMPTY_FILTERS, applyFilters, filtersToParams, type Filters } from "./filters";

type Option = { label: string; hint?: string; patch: Partial<Filters> };
type Question = { id: string; title: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "species",
    title: "Who are you hoping to meet?",
    options: [
      { label: "A dog", patch: { species: ["dog"] } },
      { label: "A cat", patch: { species: ["cat"] } },
      { label: "A rabbit or small animal", patch: { species: ["rabbit", "small"] } },
      { label: "Surprise me", patch: { species: [] } },
    ],
  },
  {
    id: "pace",
    title: "What does a perfect Saturday look like?",
    options: [
      { label: "Sofa, blanket, a good film", patch: { energy: ["low"] } },
      { label: "A stroll to the café and back", patch: { energy: ["low", "medium"] } },
      { label: "A long tramp or a run on the beach", patch: { energy: ["medium", "high"] } },
    ],
  },
  {
    id: "household",
    title: "Who's at home?",
    options: [
      { label: "Just adults", patch: { kids: false, pets: false } },
      { label: "Children under 10", patch: { kids: true } },
      { label: "Another pet", patch: { pets: true } },
      { label: "Children and a pet", patch: { kids: true, pets: true } },
    ],
  },
  {
    id: "experience",
    title: "How much animal experience do you have?",
    options: [
      { label: "This would be my first pet", patch: { exp: "first-time" } },
      { label: "I've had pets before", patch: { exp: "some" } },
      { label: "Lots — bring me a challenge", patch: { exp: "experienced" } },
    ],
  },
  {
    id: "space",
    title: "How much room do you have?",
    options: [
      { label: "An apartment", patch: { size: ["small", "medium"] } },
      { label: "A house with a small yard", patch: { size: [] } },
      { label: "A big section", patch: { size: [] } },
    ],
  },
];

export function MatchQuiz({ animals }: { animals: Listing[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const filters = useMemo(() => {
    let f: Filters = { ...EMPTY_FILTERS };
    QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      if (a !== undefined) f = { ...f, ...q.options[a].patch };
    });
    // A dog's energy matters more than a cat's; don't over-narrow small animals.
    if (f.species.length && !f.species.includes("dog") && f.energy.length === 1) f = { ...f, energy: [] };
    return f;
  }, [answers]);

  const matches = applyFilters(animals, filters, []).length;
  const done = step >= QUESTIONS.length;
  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3" aria-hidden>
        {QUESTIONS.map((x, i) => (
          <span key={x.id} className={`h-2 flex-1 rounded-full ${i < step ? "bg-blue" : i === step ? "bg-orange" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-muted" aria-live="polite">
        {done ? "All done" : `Question ${step + 1} of ${QUESTIONS.length}`} · {matches} animals match so far
      </p>

      {!done ? (
        <fieldset key={q.id} className="mt-6 animate-rise">
          <legend className="font-serif text-2xl font-bold text-navy">{q.title}</legend>
          <div className="mt-4 grid gap-3">
            {q.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  setAnswers((a) => ({ ...a, [q.id]: i }));
                  setStep((s) => s + 1);
                  Analytics.track("quiz_answer", { question: q.id, answer: o.label });
                }}
                className={`flex min-h-14 items-center justify-between rounded-2xl border-2 bg-paper px-4 text-left text-[17px] font-bold text-navy hover:border-blue ${answers[q.id] === i ? "border-blue" : "border-line"}`}
              >
                {o.label}
                <Icon name="chevron-right" className="size-5 text-muted" />
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-4 inline-flex min-h-11 items-center gap-1 font-bold text-blue">
              <Icon name="chevron-left" className="size-4" /> Back
            </button>
          ) : null}
        </fieldset>
      ) : (
        <div className="mt-6 animate-pop rounded-3xl bg-navy p-6 text-cream on-dark">
          <p className="font-serif text-3xl font-bold text-cream">
            {matches > 0 ? `${matches} ${matches === 1 ? "animal fits" : "animals fit"} your life.` : "No exact match today."}
          </p>
          <p className="mt-2 text-mist">
            {matches > 0
              ? "We've set the filters for you. You can always loosen them."
              : "New animals arrive every day. Try loosening a filter, or save a search (coming in the real build)."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className={btn.accent}
              onClick={() => {
                Analytics.track("quiz_complete", { matches });
                const qs = filtersToParams(filters).toString();
                router.push(qs ? `/adopt?${qs}` : "/adopt");
              }}
            >
              Show my matches
            </button>
            <button type="button" className={btn.onDark} onClick={() => { setStep(0); setAnswers({}); }}>
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
