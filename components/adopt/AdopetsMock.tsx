"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";

type Props = {
  animal: { id: string; name: string; species: string };
  centreName: string;
  campaign: string;
  handoffUrl: string;
};

export function AdopetsMock({ animal, centreName, campaign, handoffUrl }: Props) {
  const [stage, setStage] = useState<"handoff" | "partner" | "done">("handoff");
  const [ref, setRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (stage === "handoff") {
    return (
      <div className="mt-6 space-y-5">
        <div className="rounded-3xl bg-sky p-5 text-navy">
          <p className="font-extrabold">What we carry across</p>
          <ul className="mt-2 space-y-1 text-[15px]">
            <li className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-green" />The animal: {animal.name} ({animal.id})</li>
            <li className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-green" />The centre: {centreName}</li>
            <li className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-green" />Where you came from, so SPCA can see which pages and campaigns lead to adoptions</li>
          </ul>
          <details className="mt-3 rounded-2xl bg-paper p-3 text-sm">
            <summary className="cursor-pointer font-bold text-blue">Show the hand-off link (for the technical folks)</summary>
            <code className="mt-2 block break-all font-mono text-xs text-ink">{handoffUrl}</code>
            <p className="mt-2 text-xs text-muted">Mock domain — the demo never opens it.</p>
          </details>
        </div>
        <button
          type="button"
          className={`${btn.accent} w-full sm:w-auto`}
          onClick={() => {
            setStage("partner");
            Analytics.track("adoption_handoff", { animal_id: animal.id, campaign });
          }}
        >
          Continue to Adopets
          <Icon name="arrow-right" />
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border-4 border-dashed border-[#6b4fa0] bg-white">
      <p className="bg-[#6b4fa0] px-4 py-2 text-center text-sm font-extrabold uppercase tracking-wider text-white">
        Mock of the partner platform (Adopets) — not the real service
      </p>
      <div className="p-5 font-[system-ui] text-[#2b2540]">
        <p className="text-lg font-bold tracking-tight">adopets <span className="font-normal text-[#6b6480]">· mock</span></p>
        {stage === "done" ? (
          <div className="animate-pop py-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-soft text-green">
              <Icon name="check" className="size-8" />
            </div>
            <p className="mt-3 text-xl font-bold">Application received (demo)</p>
            <p className="mt-1">
              In real life, the {centreName} team would call you within two working days to arrange a meet-and-greet with{" "}
              {animal.name}.
            </p>
            <p className="mt-2 text-sm text-[#6b6480]">Reference {ref} · nothing was sent anywhere</p>
            <Link href="/adopt" className={`${btn.dark} mt-5`}>
              Back to SPCA
            </Link>
          </div>
        ) : (
          <form
            className="mt-4 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              const r = await SupporterService.submit({ kind: "adoption-application", animalId: animal.id });
              Analytics.track("adoption_application_submit", { animal_id: animal.id, campaign });
              setRef(r.reference);
              setStage("done");
              setBusy(false);
            }}
          >
            <div className="rounded-2xl bg-[#f3effa] p-3 text-sm">
              <p className="font-bold">Pre-filled from SPCA</p>
              <p>
                Applying for <strong>{animal.name}</strong> ({animal.id}) at {centreName} · campaign: {campaign}
              </p>
            </div>
            <fieldset>
              <legend className="font-bold">Your home</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["House with a yard", "House, no yard", "Apartment", "Rural property"].map((h, i) => (
                  <label key={h} className="flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#e2dcef] px-3 text-sm has-[:checked]:border-[#6b4fa0]">
                    <input type="radio" name="home" defaultChecked={i === 0} className="accent-[#6b4fa0]" />
                    {h}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-bold">Who lives with you?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Adults only", "Children under 10", "Children 10+", "Other pets"].map((h, i) => (
                  <label key={h} className="flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#e2dcef] px-3 text-sm has-[:checked]:border-[#6b4fa0]">
                    <input type="checkbox" defaultChecked={i === 0} className="accent-[#6b4fa0]" />
                    {h}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="why" className="font-bold">
                Why {animal.name}?
              </label>
              <textarea
                id="why"
                rows={3}
                defaultValue={`We love ${animal.name}'s story and have the time and space to give them a great home.`}
                className="mt-2 w-full rounded-xl border-2 border-[#e2dcef] p-3 text-[16px]"
              />
            </div>
            <p className="text-sm text-[#6b6480]">
              Contact details are skipped in this demo. Nothing you type leaves your browser.
            </p>
            <button type="submit" disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6b4fa0] px-5 font-bold text-white disabled:opacity-60">
              {busy ? "Submitting…" : "Submit application (demo)"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
