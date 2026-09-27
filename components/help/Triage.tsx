"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CallButton } from "@/components/CallButton";
import { Icon } from "@/components/Icon";
import { LocationPicker } from "@/components/LocationPicker";
import { distance } from "@/lib/format";
import { EMERGENCY } from "@/lib/mocks/centres";
import { Analytics } from "@/lib/services/analytics";

type Step = "ask" | "urgent" | "wildlife" | "crime";

type Props = {
  centre: { id: string; name: string; area: string; phone: string } | null;
  status: { open: boolean; label: string; todayLabel: string } | null;
  vet: { name: string; area: string; phone: string; km: number } | null;
  locationSource: "gps" | "manual" | null;
};

export function Triage({ centre, status, vet, locationSource }: Props) {
  const [step, setStep] = useState<Step>("ask");
  const heading = useRef<HTMLHeadingElement>(null);

  const go = (next: Step) => {
    setStep(next);
    Analytics.track("report_triage", { answer: next });
    requestAnimationFrame(() => heading.current?.focus());
  };

  const back = (
    <button type="button" onClick={() => go("ask")} className="mt-5 inline-flex min-h-11 items-center gap-1 font-bold text-blue">
      <Icon name="chevron-left" className="size-4" /> Start again
    </button>
  );

  return (
    <div className="rounded-3xl bg-navy p-5 text-cream on-dark sm:p-7">
      {step === "ask" ? (
        <div className="animate-rise">
          <h2 ref={heading} tabIndex={-1} className="font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Is an animal in danger right now?
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => go("urgent")} className="flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-orange px-5 text-left text-lg font-extrabold text-navy">
              Yes — it&apos;s happening now
              <Icon name="arrow-right" />
            </button>
            <Link
              href="/get-help/report"
              onClick={() => Analytics.track("report_triage", { answer: "non-urgent" })}
              className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 border-cream/40 px-5 text-lg font-extrabold text-cream hover:border-cream"
            >
              No, but I&apos;m worried
              <Icon name="arrow-right" />
            </Link>
          </div>
          <div className="mt-4 grid gap-2 text-[15px] sm:grid-cols-2">
            <button type="button" onClick={() => go("wildlife")} className="flex min-h-12 items-center gap-2 rounded-xl bg-navy-2 px-4 text-left font-bold text-cream">
              <Icon name="leaf" className="size-5 text-orange" /> It&apos;s a wild animal or marine mammal
            </button>
            <button type="button" onClick={() => go("crime")} className="flex min-h-12 items-center gap-2 rounded-xl bg-navy-2 px-4 text-left font-bold text-cream">
              <Icon name="alert" className="size-5 text-orange" /> A crime is happening or people are at risk
            </button>
          </div>
        </div>
      ) : null}

      {step === "urgent" ? (
        <div className="animate-rise">
          {!centre || !status ? (
            <>
              <h2 ref={heading} tabIndex={-1} className="font-serif text-2xl font-bold text-cream">
                Where are you?
              </h2>
              <p className="mt-1 text-mist">We&apos;ll connect you to the nearest centre — or an after-hours vet if it&apos;s closed.</p>
              <div className="mt-4">
                <LocationPicker currentId={null} tone="dark" />
              </div>
            </>
          ) : status.open ? (
            <>
              <p className="text-sm font-extrabold uppercase tracking-wider text-orange">
                {locationSource === "gps" ? "Nearest centre to you" : "Your centre"}
              </p>
              <h2 ref={heading} tabIndex={-1} className="mt-1 font-serif text-3xl font-bold text-cream">
                Call {centre.name}
              </h2>
              <p className="mt-1 text-mist">{centre.area}</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1 text-sm font-extrabold text-green">
                <Icon name="clock" className="size-4" /> {status.label}
              </p>
              <CallButton who={centre.name} number={centre.phone} label={`Call now · ${centre.phone}`} variant="accent" className="mt-5 w-full py-4 text-lg" />
              <p className="mt-3 text-sm text-mist">Stay safe. Don&apos;t put yourself at risk to reach the animal. Photos and a location help the Inspectorate.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-extrabold uppercase tracking-wider text-orange">{centre.name} is closed</p>
              <h2 ref={heading} tabIndex={-1} className="mt-1 font-serif text-3xl font-bold text-cream">
                Call the nearest after-hours vet
              </h2>
              <p className="mt-1 text-mist">{status.label}. For an injured or sick animal right now, go to:</p>
              {vet ? (
                <div className="mt-4 rounded-2xl bg-navy-2 p-4">
                  <p className="font-extrabold text-cream">{vet.name}</p>
                  <p className="text-sm text-mist">
                    {vet.area} · {distance(vet.km)} away · open 24/7
                  </p>
                  <CallButton who={vet.name} number={vet.phone} label={`Call ${vet.phone}`} variant="accent" className="mt-3 w-full py-4 text-lg" />
                </div>
              ) : null}
              <p className="mt-4 text-sm text-mist">
                For cruelty that isn&apos;t an emergency, you can{" "}
                <Link href="/get-help/report" className="font-bold text-cream underline">
                  report it online now
                </Link>{" "}
                and the centre will pick it up when it opens.
              </p>
            </>
          )}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-cream/25 p-3 text-sm">
            <Icon name="alert" className="size-5 shrink-0 text-orange" />
            <span>If a crime is happening or anyone is in danger, call the Police on 111.</span>
          </div>
          {back}
        </div>
      ) : null}

      {step === "wildlife" ? (
        <div className="animate-rise">
          <p className="text-sm font-extrabold uppercase tracking-wider text-orange">Wildlife and marine mammals</p>
          <h2 ref={heading} tabIndex={-1} className="mt-1 font-serif text-3xl font-bold text-cream">
            Call the DOC hotline
          </h2>
          <p className="mt-2 text-mist">
            The Department of Conservation looks after native wildlife, stranded whales, dolphins and seals. The line is
            open 24/7.
          </p>
          <CallButton who="the DOC hotline (0800 DOC HOT)" number={EMERGENCY.docHotline} label={`Call ${EMERGENCY.docHotline}`} variant="accent" className="mt-5 w-full py-4 text-lg" />
          <p className="mt-3 text-sm text-mist">For injured birds you can safely contain, keep them warm, dark and quiet until help arrives.</p>
          {back}
        </div>
      ) : null}

      {step === "crime" ? (
        <div className="animate-rise">
          <p className="text-sm font-extrabold uppercase tracking-wider text-orange">Emergency</p>
          <h2 ref={heading} tabIndex={-1} className="mt-1 font-serif text-3xl font-bold text-cream">
            Call the Police on 111
          </h2>
          <p className="mt-2 text-mist">If a crime is happening now or anyone is at risk, the Police come first. You can report the animal side to us afterwards.</p>
          <CallButton who="Police emergency" number={EMERGENCY.police} label="Call 111" variant="danger" className="mt-5 w-full py-4 text-lg" />
          {back}
        </div>
      ) : null}
    </div>
  );
}
