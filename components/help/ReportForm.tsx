"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";

const CONCERNS = [
  "No food or water",
  "No shelter",
  "Injured or sick, not being treated",
  "Being hurt",
  "Abandoned",
  "Living in dirty or crowded conditions",
  "Something else",
];
const SPECIES = ["Dog", "Cat", "Horse or farm animal", "Rabbit or small animal", "Bird", "Other"];
const DURATION = ["Today", "A few days", "Weeks or longer", "Not sure"];
const STEPS = ["What's happening", "Where", "Details", "You", "Check and send"];

type Data = {
  concerns: string[];
  species: string;
  where: string;
  count: string;
  duration: string;
  description: string;
  anonymous: boolean;
  name: string;
  phone: string;
};

export function ReportForm({ centreName }: { centreName: string | null }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<Data>({
    concerns: [],
    species: "Dog",
    where: "",
    count: "1",
    duration: "A few days",
    description: "",
    anonymous: false,
    name: "",
    phone: "",
  });
  const heading = useRef<HTMLHeadingElement>(null);
  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  const validate = () => {
    if (step === 0 && data.concerns.length === 0) return "Choose at least one thing you've noticed.";
    if (step === 1 && data.where.trim().length < 3) return "Tell us roughly where — a street and suburb is enough.";
    return null;
  };
  const move = (delta: number) => {
    const problem = delta > 0 ? validate() : null;
    setError(problem);
    if (problem) return;
    setStep((s) => s + delta);
    Analytics.track("report_step", { step: STEPS[step + delta] ?? "done" });
    requestAnimationFrame(() => heading.current?.focus());
  };

  if (ref) {
    return (
      <div role="status" className="animate-pop rounded-3xl bg-paper p-6 text-center ring-1 ring-line">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-soft text-green">
          <Icon name="check" className="size-8" />
        </div>
        <h2 className="mt-3 font-serif text-2xl font-bold">Thank you. We&apos;ve got it (demo).</h2>
        <p className="mt-2">
          In the live site your report would go straight to the Inspectorate{centreName ? ` team covering ${centreName}` : ""}.
          Every report is read and prioritised by risk.
        </p>
        <p className="mt-2 text-sm text-muted">Demo reference {ref} · nothing was sent anywhere</p>
        <Link href="/get-help" className={`${btn.dark} mt-5`}>
          Back to Get help
        </Link>
      </div>
    );
  }

  const field = "mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px] text-navy";

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (step < STEPS.length - 1) return move(1);
        setBusy(true);
        const r = await SupporterService.submit({ kind: "cruelty-report", urgency: "non-urgent" });
        Analytics.track("report_submit", { concerns: data.concerns.length, anonymous: data.anonymous });
        setRef(r.reference);
        setBusy(false);
      }}
      className="rounded-3xl border border-line bg-paper p-5 sm:p-6"
    >
      <div className="flex gap-1.5" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-blue" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-2 text-sm font-bold text-muted">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 ref={heading} tabIndex={-1} className="mt-1 font-serif text-2xl font-bold">
        {STEPS[step]}
      </h2>

      {error ? (
        <p role="alert" id="form-error" className="mt-3 flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm font-bold text-[#7a1a14]">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {step === 0 ? (
          <>
            <fieldset aria-describedby={error ? "form-error" : undefined}>
              <legend className="font-extrabold text-navy">What have you noticed? Choose all that apply.</legend>
              <div className="mt-2 grid gap-2">
                {CONCERNS.map((c) => (
                  <label key={c} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-line bg-white px-3 font-bold text-navy has-[:checked]:border-blue has-[:checked]:bg-sky">
                    <input
                      type="checkbox"
                      checked={data.concerns.includes(c)}
                      onChange={() =>
                        set({ concerns: data.concerns.includes(c) ? data.concerns.filter((x) => x !== c) : [...data.concerns, c] })
                      }
                      className="size-5 accent-blue"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="r-species" className="font-extrabold text-navy">What kind of animal?</label>
              <select id="r-species" value={data.species} onChange={(e) => set({ species: e.target.value })} className={field}>
                {SPECIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div>
              <label htmlFor="r-where" className="font-extrabold text-navy">Where is the animal?</label>
              <p id="r-where-hint" className="text-sm text-muted">A street and suburb, or a landmark. Stays in your browser in this demo.</p>
              <input
                id="r-where"
                value={data.where}
                onChange={(e) => set({ where: e.target.value })}
                aria-describedby={error ? "form-error r-where-hint" : "r-where-hint"}
                aria-invalid={Boolean(error)}
                autoComplete="off"
                placeholder="e.g. Rata Street, Newtown"
                className={field}
              />
            </div>
            {centreName ? (
              <p className="flex items-center gap-2 rounded-xl bg-sky p-3 text-sm font-bold text-navy">
                <Icon name="pin" className="size-4 text-blue" /> We&apos;ll route this to the team covering {centreName}.
              </p>
            ) : null}
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="r-count" className="font-extrabold text-navy">How many animals?</label>
                <select id="r-count" value={data.count} onChange={(e) => set({ count: e.target.value })} className={field}>
                  {["1", "2", "3–5", "More than 5", "Not sure"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="r-duration" className="font-extrabold text-navy">For how long?</label>
                <select id="r-duration" value={data.duration} onChange={(e) => set({ duration: e.target.value })} className={field}>
                  {DURATION.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="r-desc" className="font-extrabold text-navy">Anything else we should know? <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="r-desc" rows={4} value={data.description} onChange={(e) => set({ description: e.target.value })} className={`${field} py-2`} />
              <p className="mt-1 text-sm text-muted">In the real build you could add photos here.</p>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-line bg-white px-3 font-bold text-navy has-[:checked]:border-blue has-[:checked]:bg-sky">
              <input type="checkbox" checked={data.anonymous} onChange={(e) => set({ anonymous: e.target.checked })} className="size-5 accent-blue" />
              Report anonymously
            </label>
            {!data.anonymous ? (
              <>
                <p className="text-sm text-muted">Optional — only used if an Inspector needs to ask you something. We never tell anyone who reported.</p>
                <div>
                  <label htmlFor="r-name" className="font-extrabold text-navy">First name <span className="font-normal text-muted">(optional)</span></label>
                  <input id="r-name" value={data.name} onChange={(e) => set({ name: e.target.value })} autoComplete="off" className={field} />
                </div>
                <div>
                  <label htmlFor="r-phone" className="font-extrabold text-navy">Phone <span className="font-normal text-muted">(optional)</span></label>
                  <input id="r-phone" type="tel" value={data.phone} onChange={(e) => set({ phone: e.target.value })} autoComplete="off" className={field} />
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {step === 4 ? (
          <dl className="divide-y divide-line rounded-2xl bg-sand px-4 text-[15px]">
            {[
              ["Concerns", data.concerns.join(", ")],
              ["Animal", `${data.species} · ${data.count}`],
              ["Where", data.where],
              ["How long", data.duration],
              ["Notes", data.description || "—"],
              ["You", data.anonymous ? "Anonymous" : data.name || "Not given"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2">
                <dt className="w-24 shrink-0 font-bold text-navy">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => move(-1)} className={`${btn.secondary} flex-1`}>
            Back
          </button>
        ) : null}
        <button type="submit" disabled={busy} className={`${btn.primary} flex-[2]`}>
          {step < STEPS.length - 1 ? "Continue" : busy ? "Sending…" : "Send report (demo)"}
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Demo form — nothing you enter leaves this browser.</p>
    </form>
  );
}
