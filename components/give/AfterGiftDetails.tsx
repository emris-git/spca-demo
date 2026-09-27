"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/Icon";
import { Analytics } from "@/lib/services/analytics";
import { SupporterService } from "@/lib/services/supporter";
import { btn } from "@/lib/ui";

const SOURCES = ["Choose one", "Social media", "A friend or family", "Email from SPCA", "A centre or Op Shop", "News or radio", "Street appeal", "Other"];

/**
 * Optional details asked for only after the gift, each with a reason — instead of making
 * address and phone mandatory before payment.
 */
export function AfterGiftDetails() {
  const id = useId();
  const [state, setState] = useState<"ask" | "saved" | "skipped">("ask");
  const [post, setPost] = useState(false);
  const [busy, setBusy] = useState(false);

  if (state === "skipped") return null;
  const field = "mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px] text-navy";

  return (
    <section aria-labelledby={`${id}-h`} className="rounded-3xl border border-line bg-paper p-5">
      {state === "saved" ? (
        <p role="status" className="flex items-center gap-2 font-bold text-navy">
          <Icon name="check" className="size-5 text-green" /> Thanks — noted (demo, nothing was sent).
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const heard = (e.currentTarget.elements.namedItem("heard") as HTMLSelectElement).value;
            await SupporterService.submit({ kind: "post-gift-details", postalUpdates: post, heardFrom: heard });
            Analytics.track("post_gift_details", { postal: post, heard });
            setState("saved");
            setBusy(false);
          }}
        >
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-blue">Optional · 20 seconds</p>
          <h2 id={`${id}-h`} className="mt-1 font-serif text-xl font-bold">
            Two quick questions, only if you&apos;d like
          </h2>
          <p className="mt-1 text-sm text-muted">Your gift is done. We didn&apos;t need any of this to take it.</p>

          <label className="mt-4 flex items-start gap-3 rounded-xl border-2 border-line bg-white p-3 has-[:checked]:border-blue has-[:checked]:bg-sky">
            <input type="checkbox" checked={post} onChange={(e) => setPost(e.target.checked)} className="mt-1 size-5 accent-blue" />
            <span>
              <span className="block font-bold text-navy">Post me a paper receipt and updates</span>
              <span className="block text-sm text-muted">Only then do we need your postal address.</span>
            </span>
          </label>
          {post ? (
            <div className="mt-3 animate-rise">
              <label htmlFor={`${id}-addr`} className="text-sm font-bold text-navy">Postal address</label>
              <input id={`${id}-addr`} defaultValue="1 Example Street, Newtown, Wellington 6021" autoComplete="off" className={field} />
              <p className="mt-1 text-xs text-muted">One line is fine. In the real build this field would autocomplete NZ addresses. Sample pre-filled.</p>
            </div>
          ) : null}

          <div className="mt-4">
            <label htmlFor={`${id}-heard`} className="text-sm font-bold text-navy">How did you hear about this appeal?</label>
            <select id={`${id}-heard`} name="heard" defaultValue="Choose one" className={field}>
              {SOURCES.map((s) => (
                <option key={s} disabled={s === "Choose one"}>{s}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">Helps us spend less on what doesn&apos;t work — and more on animals.</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="min-h-12 rounded-full px-4 font-bold text-navy underline"
              onClick={() => {
                Analytics.track("post_gift_details_skip");
                setState("skipped");
              }}
            >
              Skip
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
