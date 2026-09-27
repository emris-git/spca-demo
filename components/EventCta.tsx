"use client";

import Link from "next/link";
import { useState } from "react";
import type { CtaAction } from "@/lib/mocks/events";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";
import { Sheet } from "./Sheet";

/** Event call to action. Sign-ups open a mock confirmation; the rest are links into the site. */
export function EventCta({
  eventId,
  title,
  label,
  action,
  href,
  compact = false,
}: {
  eventId: string;
  title: string;
  label: string;
  action: CtaAction;
  href: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cls = `${action === "donate" ? btn.accent : btn.primary} ${compact ? "min-h-11 px-4 text-sm" : ""}`;

  if (action !== "signup") {
    return (
      <Link href={href} className={cls} onClick={() => Analytics.track("event_cta", { event_id: eventId, action })}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <button type="button" className={cls} onClick={() => setOpen(true)}>
        {label}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={title} description="Demo sign-up — nothing is sent.">
        {ref ? (
          <div className="animate-pop text-center">
            <p className="font-serif text-2xl font-bold text-navy">You&apos;re on the list!</p>
            <p className="mt-2">In the live site you&apos;d get a confirmation email and a reminder the week before.</p>
            <p className="mt-2 text-sm text-muted">Demo reference {ref}</p>
            <button type="button" className={`${btn.dark} mt-5 w-full`} onClick={() => setOpen(false)}>
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              const r = await SupporterService.submit({ kind: "event-signup", eventId });
              Analytics.track("event_signup", { event_id: eventId });
              setRef(r.reference);
              setBusy(false);
            }}
            className="space-y-4"
          >
            <p>We&apos;d ask for just a first name and an email. In this demo the fields are pre-filled and nothing leaves your browser.</p>
            <div>
              <label htmlFor={`${eventId}-name`} className="block text-sm font-bold text-navy">First name</label>
              <input id={`${eventId}-name`} defaultValue="Alex" autoComplete="off" className="mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3" />
            </div>
            <div>
              <label htmlFor={`${eventId}-email`} className="block text-sm font-bold text-navy">Email</label>
              <input id={`${eventId}-email`} type="email" defaultValue="alex@example.com" autoComplete="off" className="mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3" />
            </div>
            <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
              {busy ? "Signing you up…" : "Sign me up (demo)"}
            </button>
          </form>
        )}
      </Sheet>
    </>
  );
}
