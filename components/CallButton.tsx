"use client";

import { useState } from "react";
import { Analytics } from "@/lib/services/analytics";
import { btn } from "@/lib/ui";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

/** Looks like a call button, but only explains what the live site would dial. Never dials. */
export function CallButton({
  who,
  number,
  label,
  variant = "primary",
  className = "",
}: {
  who: string;
  number: string;
  label?: string;
  variant?: keyof typeof btn;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`${btn[variant]} ${className}`}
        onClick={() => {
          setOpen(true);
          Analytics.track("call_tap", { who, number });
        }}
      >
        <Icon name="phone" />
        {label ?? `Call ${number}`}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="This is a demo — no call was made">
        <p>
          On the live site this button would call <strong className="text-navy">{who}</strong> on{" "}
          <strong className="whitespace-nowrap text-navy">{number}</strong>.
        </p>
        <p className="mt-4 rounded-2xl bg-danger-soft p-4 font-bold text-[#7a1a14]">
          In a real emergency call 111 or your local SPCA centre.
        </p>
        <button type="button" className={`${btn.dark} mt-5 w-full`} onClick={() => setOpen(false)}>
          Got it
        </button>
      </Sheet>
    </>
  );
}
