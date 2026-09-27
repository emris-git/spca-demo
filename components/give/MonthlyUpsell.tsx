"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { money } from "@/lib/format";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";

export function MonthlyUpsell({ amount, outcome }: { amount: number; outcome: string }) {
  const suggested = Math.max(10, Math.round(amount / 3 / 5) * 5);
  const [state, setState] = useState<"ask" | "yes" | "no">("ask");
  if (state === "no") return null;
  return (
    <section aria-labelledby="monthly" className="rounded-3xl border-2 border-orange bg-orange-soft p-5 text-navy">
      {state === "yes" ? (
        <div className="animate-pop">
          <p id="monthly" className="font-serif text-xl font-bold">You&apos;re an SPCA Guardian now (in the demo).</p>
          <p className="mt-1">
            {money(suggested)} a month, starting next month. In the real build this would be set up through the payment
            gateway and confirmed by email — nothing was charged here.
          </p>
        </div>
      ) : (
        <>
          <p id="monthly" className="font-serif text-xl font-bold">Keep the good going?</p>
          <p className="mt-1">
            {money(suggested)} a month adds up to {money(suggested * 12)} a year — that&apos;s like your gift today{" "}
            ({outcome}), again and again. Change or stop anytime.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className={btn.dark}
              onClick={async () => {
                await SupporterService.submit({ kind: "monthly-upgrade", amount: suggested });
                Analytics.track("monthly_upsell_accept", { amount: suggested });
                setState("yes");
              }}
            >
              <Icon name="sparkle" className="size-4" /> Yes, {money(suggested)} a month
            </button>
            <button
              type="button"
              className="min-h-12 rounded-full px-4 font-bold text-navy underline"
              onClick={() => {
                Analytics.track("monthly_upsell_decline");
                setState("no");
              }}
            >
              Not right now
            </button>
          </div>
        </>
      )}
    </section>
  );
}
