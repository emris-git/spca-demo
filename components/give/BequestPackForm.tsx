"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";

export function BequestPackForm() {
  const [delivery, setDelivery] = useState<"email" | "post">("email");
  const [ref, setRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (ref) {
    return (
      <div role="status" className="animate-pop rounded-3xl bg-green-soft p-5 text-navy">
        <p className="flex items-center gap-2 font-serif text-xl font-bold">
          <Icon name="check" className="size-6 text-green" /> Your pack is on its way (demo)
        </p>
        <p className="mt-2">
          In the live site, the pack would arrive {delivery === "email" ? "in your inbox in a few minutes" : "in your letterbox within a week"},
          and the Gifts in Wills team would follow up only if you asked them to.
        </p>
        <p className="mt-2 text-sm text-muted">Demo reference {ref}. Nothing was sent.</p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const r = await SupporterService.submit({ kind: "bequest-pack", delivery });
        Analytics.track("bequest_pack_request", { delivery });
        setRef(r.reference);
        setBusy(false);
      }}
    >
      <fieldset>
        <legend className="font-extrabold text-navy">How would you like it?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["email", "post"] as const).map((d) => (
            <label key={d} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 border-line bg-white px-3 font-bold text-navy has-[:checked]:border-blue has-[:checked]:bg-sky">
              <input type="radio" name="delivery" value={d} checked={delivery === d} onChange={() => setDelivery(d)} className="accent-blue" />
              {d === "email" ? "By email" : "By post"}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="bq-name" className="block text-sm font-bold text-navy">First name</label>
        <input id="bq-name" defaultValue="Alex" autoComplete="off" className="mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px]" />
      </div>
      <div>
        <label htmlFor="bq-contact" className="block text-sm font-bold text-navy">
          {delivery === "email" ? "Email" : "Postal address"}
        </label>
        <input
          id="bq-contact"
          key={delivery}
          defaultValue={delivery === "email" ? "alex@example.com" : "1 Example Street, Wellington"}
          autoComplete="off"
          className="mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px]"
        />
        <p className="mt-1 text-xs text-muted">Pre-filled sample details — this demo doesn&apos;t collect real ones.</p>
      </div>
      <button type="submit" disabled={busy} className={`${btn.accent} w-full`}>
        {busy ? "Sending…" : "Send my free pack"}
      </button>
      <p className="text-sm text-muted">No obligation. We won&apos;t call unless you ask us to.</p>
    </form>
  );
}
