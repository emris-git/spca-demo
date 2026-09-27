"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { LocationPicker } from "./LocationPicker";
import { Sheet } from "./Sheet";

export function LocationChip({ centreId, centreShort }: { centreId: string | null; centreShort: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 max-w-[9.5rem] items-center gap-1.5 rounded-full border border-line bg-paper px-3 text-sm font-bold text-navy hover:border-navy/40"
        aria-label={centreShort ? `Your centre: ${centreShort}. Change` : "Set your nearest centre"}
      >
        <Icon name="pin" className="size-4 shrink-0 text-blue" />
        <span className="truncate">{centreShort ?? "Near me"}</span>
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Your nearest centre"
        description="We use it for opening hours, animals near you, local events and who to call."
      >
        <LocationPicker currentId={centreId} onDone={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
