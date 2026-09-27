"use client";

import { useEffect, useRef, useState } from "react";
import { Analytics } from "@/lib/services/analytics";
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

/** Tweens a number towards `value` (ease-out), so a changing total visibly counts up. */
function useCountUp(value: number, duration = 800) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    // Reduced motion: jump straight to the new value.
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = Math.round(start + (value - start) * eased);
      from.current = next;
      setShown(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return shown;
}

const TOWNS = ["Nelson", "Tauranga", "Ōtautahi", "Whanganui", "Dunedin", "Pōneke", "Kirikiriroa", "Napier", "Timaru", "Whangārei"];

/** Campaign goal with milestone markers. With `live`, mock gifts trickle in so people can feel momentum. */
export function AppealProgress({ name, raised, goal, supporters, milestones, yourGift = 0, live = true }: Props) {
  const [extra, setExtra] = useState(0);
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [lastGift, setLastGift] = useState<{ id: number; amount: number } | null>(null);
  const seed = useRef(0);
  const extraRef = useRef(0);

  const total = raised + extra;
  const pct = Math.min(100, (total / goal) * 100);
  const shownTotal = useCountUp(total);
  const yourPct = Math.min(pct, (yourGift / goal) * 100);

  useEffect(() => {
    if (!live || paused) return;
    let id: number;
    const gift = () => {
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
      setLastGift({ id: seed.current, amount: step.amount });
      setLatest(`Someone in ${town} just gave ${money(step.amount)} — ${step.short}`);
      id = window.setTimeout(gift, 6500);
    };
    // The first gift lands quickly so the page visibly comes alive.
    id = window.setTimeout(gift, seed.current === 0 ? 2500 : 6500);
    return () => window.clearTimeout(id);
  }, [live, paused, raised, goal, milestones]);

  return (
    <section aria-label={`${name} progress`} className="rounded-3xl bg-navy p-5 text-cream on-dark sm:p-6">
      {live ? (
        <p className="mb-2 flex h-6 items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-orange">
          <span className="relative flex size-2.5" aria-hidden>
            <span key={lastGift?.id ?? 0} className={`absolute inset-0 rounded-full bg-orange ${lastGift ? "goal-flash" : "opacity-0"}`} style={{ boxShadow: "0 0 0 6px rgb(242 165 83 / 0.35)" }} />
            <span className="relative size-2.5 rounded-full bg-orange" />
          </span>
          {paused ? "Updates paused" : "Live"}
          {lastGift ? (
            <span
              key={lastGift.id}
              aria-hidden
              className="goal-chip rounded-full bg-orange px-2 py-0.5 text-[13px] tracking-normal text-navy"
            >
              +{money(lastGift.amount)}
            </span>
          ) : null}
        </p>
      ) : null}
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-3xl font-bold tabular-nums text-cream">{money(shownTotal)}</p>
        <p className="text-right text-sm text-mist">
          of {money(goal)} goal
          <br />
          <span className="tabular-nums">{number(supporters + count)}</span> supporters
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
        <div
          className="goal-fill h-full w-full rounded-full bg-orange"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0 round 9999px)` }}
        />
        {lastGift ? (
          <span
            key={`flash-${lastGift.id}`}
            aria-hidden
            className="goal-flash pointer-events-none absolute inset-y-0 w-12 rounded-full bg-gradient-to-r from-transparent to-cream/90"
            style={{ left: `calc(${pct}% - 3rem)` }}
          />
        ) : null}
        {live ? (
          <span
            key={`head-${lastGift?.id ?? 0}`}
            aria-hidden
            className={`goal-head absolute top-1/2 size-5 rounded-full border-[3px] border-navy bg-orange shadow ${lastGift ? "is-bumping" : ""}`}
            style={{ right: `${100 - pct}%` }}
          />
        ) : null}
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
              <span className={`grid size-5 place-items-center rounded-full ${reached ? "bg-orange text-navy" : "border border-mist/60"} ${celebrate === m.label ? "animate-pop" : ""}`}>
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
          <p key={lastGift?.id ?? 0} className={`min-h-10 text-sm ${latest ? "ticker-in text-cream" : "text-mist"}`} aria-live="off">
            {latest ?? "Gifts are coming in now…"}
          </p>
          <button
            type="button"
            onClick={() => {
              setPaused((p) => !p);
              Analytics.track("appeal_ticker_toggle", { paused: !paused });
            }}
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
