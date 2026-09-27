"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { money, number } from "@/lib/format";
import { IMPACT_LADDER } from "@/lib/mocks/impact";

type Props = {
  name: string;
  raised: number;
  goal: number;
  supporters: number;
  milestones: { at: number; label: string }[];
  /** Highlight a gift just made in this browser. */
  yourGift?: number;
  live?: boolean;
};

const TOWNS = ["Nelson", "Tauranga", "Ōtautahi", "Whanganui", "Dunedin", "Pōneke", "Kirikiriroa", "Napier", "Timaru", "Whangārei"];

/** Campaign goal with milestone markers. With `live`, mock gifts trickle in so people can feel momentum. */
export function AppealProgress({ name, raised, goal, supporters, milestones, yourGift = 0, live = true }: Props) {
  const [extra, setExtra] = useState(0);
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const seed = useRef(0);
  const extraRef = useRef(0);

  const total = raised + extra;
  const pct = Math.min(100, (total / goal) * 100);
  const yourPct = Math.min(pct, (yourGift / goal) * 100);

  useEffect(() => {
    if (!live || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      seed.current += 1;
      const step = IMPACT_LADDER[seed.current % 3 === 0 ? 1 : 0];
      const town = TOWNS[seed.current % TOWNS.length];
      const before = (raised + extraRef.current) / goal;
      extraRef.current += step.amount;
      const after = (raised + extraRef.current) / goal;
      const crossed = milestones.find((m) => before < m.at && after >= m.at);
      if (crossed) setCelebrate(crossed.label);
      setExtra(extraRef.current);
      setCount((c) => c + 1);
      setLatest(`Someone in ${town} just gave ${money(step.amount)} — ${step.short}`);
    }, 6500);
    return () => window.clearInterval(id);
  }, [live, paused, raised, goal, milestones]);

  return (
    <section aria-label={`${name} progress`} className="rounded-3xl bg-navy p-5 text-cream on-dark sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-3xl font-bold text-cream">{money(total)}</p>
        <p className="text-right text-sm text-mist">
          of {money(goal)} goal
          <br />
          {number(supporters + count)} supporters
        </p>
      </div>

      <div
        className="relative mt-4 h-4 rounded-full bg-navy-2"
        role="progressbar"
        aria-label={`${name}: amount raised`}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.round(total)}
        aria-valuetext={`${money(total)} raised of ${money(goal)}`}
      >
        <div className="h-full rounded-full bg-orange transition-[width] duration-1000 ease-out" style={{ width: `${pct}%` }} />
        {yourGift > 0 ? (
          <div
            className="absolute top-0 h-full animate-pulse rounded-r-full bg-cream"
            style={{ left: `${Math.max(0, pct - yourPct)}%`, width: `${Math.max(yourPct, 1.2)}%` }}
            aria-hidden
          />
        ) : null}
        {milestones.map((m) => (
          <span
            key={m.at}
            aria-hidden
            className={`absolute -top-1 h-6 w-1 rounded-full ${pct / 100 >= m.at ? "bg-cream" : "bg-mist/50"}`}
            style={{ left: `calc(${m.at * 100}% - 2px)` }}
          />
        ))}
      </div>

      <ul className="mt-4 grid gap-1.5 text-sm">
        {milestones.map((m) => {
          const reached = pct / 100 >= m.at;
          return (
            <li key={m.at} className={`flex items-center gap-2 ${reached ? "text-cream" : "text-mist"}`}>
              <span className={`grid size-5 place-items-center rounded-full ${reached ? "bg-orange text-navy" : "border border-mist/60"}`}>
                {reached ? <Icon name="check" className="size-3.5" /> : null}
              </span>
              <span className={reached ? "font-bold" : ""}>{m.label}</span>
              <span className="ml-auto text-xs text-mist">{Math.round(m.at * 100)}%</span>
            </li>
          );
        })}
      </ul>

      {yourGift > 0 ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-navy-2 p-3 text-sm font-bold text-cream">
          <span className="size-3 rounded-full bg-cream" aria-hidden /> The white slice is you. Thank you.
        </p>
      ) : null}

      {celebrate ? (
        <p role="status" className="mt-4 animate-pop rounded-2xl bg-orange p-3 text-sm font-extrabold text-navy">
          <Icon name="sparkle" className="mr-1 inline size-4" />
          Milestone reached: {celebrate}!
        </p>
      ) : null}

      {live ? (
        <div className="mt-4 flex items-start justify-between gap-3 border-t border-navy-2 pt-3">
          <p className="min-h-10 text-sm text-mist" aria-live="off">
            {latest ?? "Gifts are coming in now…"}
          </p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="shrink-0 rounded-full border border-mist/40 px-3 py-1.5 text-xs font-bold text-cream"
          >
            {paused ? "Resume updates" : "Pause updates"}
          </button>
        </div>
      ) : null}
      <p className="mt-2 text-xs text-mist">Mock figures for the demo.</p>
    </section>
  );
}
