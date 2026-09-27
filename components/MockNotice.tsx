"use client";

import { useState } from "react";
import { btn } from "@/lib/ui";
import { Analytics } from "@/lib/services/analytics";
import { Sheet } from "./Sheet";

/** A button for things that would leave the site (Raisely, Shopify…). Explains instead of navigating. */
export function MockNotice({
  label,
  title,
  children,
  variant = "secondary",
  className = "",
  track,
}: {
  label: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: keyof typeof btn;
  className?: string;
  track?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`${btn[variant]} ${className}`}
        onClick={() => {
          setOpen(true);
          if (track) Analytics.track(track);
        }}
      >
        {label}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title}>
        <div className="space-y-3">{children}</div>
        <button type="button" className={`${btn.dark} mt-5 w-full`} onClick={() => setOpen(false)}>
          Close
        </button>
      </Sheet>
    </>
  );
}
