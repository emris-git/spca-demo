"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition } from "react";
import { clearCookie, setCookie } from "@/lib/demo-client";
import { DEMO_COOKIE, type TimeMode } from "@/lib/demo-shared";
import { Analytics } from "@/lib/services/analytics";
import { btn } from "@/lib/ui";
import { Icon } from "./Icon";
import { LocationPicker } from "./LocationPicker";
import { Sheet } from "./Sheet";

type Props = {
  realToday: string;
  simulatedDate: string | null;
  timeMode: TimeMode;
  centreId: string | null;
  campaignLabel: string;
};

const PRESETS: { label: string; md: string }[] = [
  { label: "Clear the Shelters", md: "04-20" },
  { label: "Cupcake Day", md: "09-10" },
  { label: "Fill the Bucket", md: "10-16" },
  { label: "Christmas appeal", md: "12-10" },
  { label: "Kitten season", md: "01-15" },
];

function nextOccurrence(realToday: string, md: string) {
  const year = Number(realToday.slice(0, 4));
  const candidate = `${year}-${md}`;
  return candidate >= realToday ? candidate : `${year + 1}-${md}`;
}

const emptyLog: ReturnType<typeof Analytics.events> = [];

export function DemoPanel({ realToday, simulatedDate, timeMode, centreId, campaignLabel }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const log = useSyncExternalStore(Analytics.subscribe, Analytics.events, () => emptyLog);
  const refresh = () => startTransition(() => router.refresh());

  const setDate = (value: string | null) => {
    if (value && value !== realToday) setCookie(DEMO_COOKIE.date, value);
    else clearCookie(DEMO_COOKIE.date);
    Analytics.track("demo_date", { date: value ?? "today" });
    refresh();
  };
  const setTime = (mode: TimeMode) => {
    if (mode === "real") clearCookie(DEMO_COOKIE.time);
    else setCookie(DEMO_COOKIE.time, mode);
    refresh();
  };
  const reset = () => {
    Object.values(DEMO_COOKIE).forEach(clearCookie);
    try {
      localStorage.removeItem("spca-demo:favourites");
    } catch {}
    window.dispatchEvent(new Event("spca-demo:favourites"));
    refresh();
  };

  const current = simulatedDate ?? realToday;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-orange px-3 text-[13px] font-extrabold text-navy hover:bg-[#e8943a]"
        aria-haspopup="dialog"
      >
        <Icon name="settings" className="size-4" />
        Demo
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Demo controls"
        description="For interviewers: change the date and location to see the site adapt. Not part of the real site."
        wide
      >
        <div className="space-y-6">
          <p className="rounded-2xl bg-sky px-4 py-3 text-sm text-navy" aria-live="polite">
            {pending ? "Updating the site…" : (
              <>
                Campaign mode now: <strong>{campaignLabel}</strong>
              </>
            )}
          </p>

          <section aria-labelledby="demo-date">
            <h3 id="demo-date" className="font-extrabold">Simulate the date</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDate(null)}
                aria-pressed={!simulatedDate}
                className={`rounded-full border-2 px-3 py-2 text-sm font-bold ${!simulatedDate ? "border-navy bg-navy text-cream" : "border-line bg-paper text-navy"}`}
              >
                Today
              </button>
              {PRESETS.map((p) => {
                const value = nextOccurrence(realToday, p.md);
                const active = simulatedDate === value;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDate(value)}
                    aria-pressed={active}
                    className={`rounded-full border-2 px-3 py-2 text-sm font-bold ${active ? "border-navy bg-navy text-cream" : "border-line bg-paper text-navy"}`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
            <label className="mt-3 flex items-center gap-3 text-sm font-bold text-navy">
              Or pick a date
              <input
                type="date"
                value={current}
                min="2026-01-01"
                max="2027-12-31"
                onChange={(e) => e.target.value && setDate(e.target.value)}
                className="min-h-11 rounded-xl border-2 border-line bg-white px-3 text-[16px]"
              />
            </label>
          </section>

          <section aria-labelledby="demo-time">
            <h3 id="demo-time" className="font-extrabold">Time of day</h3>
            <p className="text-sm text-muted">Try “After hours” with Get help → an animal in danger.</p>
            <div className="mt-2 grid grid-cols-3 gap-2" role="group" aria-labelledby="demo-time">
              {(
                [
                  ["real", "Real time"],
                  ["day", "Daytime"],
                  ["evening", "After hours"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTime(mode)}
                  aria-pressed={timeMode === mode}
                  className={`min-h-11 rounded-xl border-2 px-2 text-sm font-bold ${timeMode === mode ? "border-navy bg-navy text-cream" : "border-line bg-paper text-navy"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="demo-loc">
            <h3 id="demo-loc" className="mb-2 font-extrabold">Simulate location</h3>
            <LocationPicker currentId={centreId} compact />
          </section>

          <section aria-labelledby="demo-analytics">
            <h3 id="demo-analytics" className="font-extrabold">Analytics events (mock GA4)</h3>
            <p className="text-sm text-muted">What the live site would measure. Nothing is sent.</p>
            <ol className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-2xl bg-navy p-3 font-mono text-xs text-mist">
              {log.length === 0 ? <li>No events yet — click around.</li> : null}
              {log.slice(0, 12).map((e) => (
                <li key={e.at + e.name}>
                  <span className="text-orange">{e.name}</span> {JSON.stringify(e.props)}
                </li>
              ))}
            </ol>
          </section>

          <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
            <button type="button" onClick={reset} className={`${btn.secondary} flex-1`}>
              Reset demo
            </button>
            <form action="/api/logout" method="post" className="flex-1">
              <button type="submit" className={`${btn.secondary} w-full`}>
                Log out
              </button>
            </form>
          </div>
        </div>
      </Sheet>
    </>
  );
}
