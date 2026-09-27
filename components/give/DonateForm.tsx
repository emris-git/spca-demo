"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { Sheet } from "@/components/Sheet";
import { addToGivenTotal } from "@/lib/demo-client";
import { money } from "@/lib/format";
import { IMPACT_LADDER, nearestImpact, type Impact } from "@/lib/mocks/impact";
import { Analytics } from "@/lib/services/analytics";
import { METHOD_LABEL, PaymentService, taxCredit, type Frequency, type PaymentMethod } from "@/lib/services/payment";
import { btn } from "@/lib/ui";

const IMPACT_ICON: Record<Impact["icon"], IconName> = { rabbit: "leaf", bed: "home", kitten: "paw", heart: "heart" };

export function DonateForm({ initialAmount, appeal }: { initialAmount: number | null; appeal: string }) {
  const router = useRouter();
  const customId = useId();
  const [frequency, setFrequency] = useState<Frequency>("once");
  const preset = initialAmount && IMPACT_LADDER.some((s) => s.amount === initialAmount) ? initialAmount : null;
  const [selected, setSelected] = useState<number | null>(preset ?? (initialAmount ? null : 210));
  const [custom, setCustom] = useState(initialAmount && !preset ? String(initialAmount) : "");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);

  const customValue = Math.floor(Number(custom.replace(/[^0-9.]/g, "")) || 0);
  const amount = selected ?? customValue;
  const valid = amount >= 2 && amount <= 100_000;
  const impact = nearestImpact(amount || 30);
  const monthly = frequency === "monthly";

  const choose = (a: number) => {
    setSelected(a);
    setCustom("");
    Analytics.track("donate_amount", { amount: a, frequency });
  };

  const pay = async () => {
    if (!method) return;
    setProcessing(true);
    Analytics.track("donate_payment_start", { amount, frequency, method });
    const receipt = await PaymentService.confirm(amount, frequency, method);
    addToGivenTotal(amount);
    Analytics.track("donate_success", { amount, frequency, method, appeal });
    const qs = new URLSearchParams({ amount: String(amount), freq: frequency, method, ref: receipt.reference });
    router.push(`/give/thank-you?${qs}`);
  };

  return (
    <div className="rounded-3xl border border-line bg-paper p-4 sm:p-6">
      {/* Once / monthly */}
      <fieldset>
        <legend className="sr-only">How often?</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1">
          {(["once", "monthly"] as Frequency[]).map((f) => (
            <label key={f} className="relative">
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => {
                  setFrequency(f);
                  Analytics.track("donate_frequency", { frequency: f });
                }}
                className="peer sr-only"
              />
              <span className="flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full text-[15px] font-extrabold text-navy peer-checked:bg-navy peer-checked:text-cream peer-focus-visible:outline-3 peer-focus-visible:outline-blue">
                {f === "once" ? "Give once" : "Give monthly"}
                {f === "monthly" ? <Icon name="sparkle" className="size-4 text-orange" /> : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {monthly ? (
        <p className="mt-3 rounded-2xl bg-orange-soft p-3 text-sm text-navy">
          <strong>Monthly gifts keep working.</strong> They let centres plan ahead — vaccines ordered before kitten season,
          not after. Monthly supporters become SPCA Guardians.
        </p>
      ) : null}

      {/* Impact ladder */}
      <fieldset className="mt-5">
        <legend className="font-extrabold text-navy">Choose what your gift does</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {IMPACT_LADDER.map((step) => {
            const on = selected === step.amount;
            return (
              <label key={step.amount} className="relative">
                <input
                  type="radio"
                  name="amount"
                  value={step.amount}
                  checked={on}
                  onChange={() => choose(step.amount)}
                  className="peer sr-only"
                />
                <span
                  className={`flex h-full cursor-pointer flex-col rounded-2xl border-2 p-3 transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue ${
                    on ? "border-blue bg-sky" : "border-line bg-white hover:border-navy/40"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-navy">
                      {money(step.amount)}
                      {monthly ? <span className="font-sans text-sm font-bold text-muted">/mo</span> : null}
                    </span>
                    <span className={`grid size-8 place-items-center rounded-full ${on ? "bg-blue text-white" : "bg-sand text-blue"}`}>
                      {on ? <Icon name="check" className="size-4" /> : <Icon name={IMPACT_ICON[step.icon]} className="size-4" />}
                    </span>
                  </span>
                  <span className="mt-1 text-[14px] leading-snug text-ink">{step.outcome}</span>
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-3">
          <label htmlFor={customId} className="text-sm font-bold text-navy">
            Or choose your own amount
          </label>
          <div className={`mt-1 flex min-h-12 items-center rounded-xl border-2 bg-white px-3 ${selected === null ? "border-blue" : "border-line"}`}>
            <span className="font-bold text-muted">$</span>
            <input
              id={customId}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Other amount"
              value={custom}
              onFocus={() => setSelected(null)}
              onChange={(e) => {
                setSelected(null);
                setCustom(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
              }}
              className="ml-1 w-full bg-transparent py-2 text-[16px] font-bold text-navy outline-none"
              aria-describedby={`${customId}-impact`}
            />
            {monthly ? <span className="text-sm font-bold text-muted">/month</span> : null}
          </div>
        </div>
      </fieldset>

      {/* Live outcome */}
      <div id={`${customId}-impact`} aria-live="polite" className="mt-4 rounded-2xl bg-navy p-4 text-cream">
        {valid ? (
          <>
            <p className="text-sm font-bold uppercase tracking-wider text-orange">Your {money(amount)}{monthly ? " a month" : ""}</p>
            <p className="mt-1 font-serif text-xl font-bold leading-snug text-cream">
              {selected !== null
                ? monthly
                  ? `${capitalise(impact.outcome)} — every month. That's ${12}× a year.`
                  : `${capitalise(impact.outcome)}.`
                : amount === impact.amount
                  ? `${capitalise(impact.outcome)}.`
                  : `Closest to: ${money(impact.amount)} ${impact.outcome}.`}
            </p>
          </>
        ) : (
          <p className="font-bold">Enter an amount of $2 or more to see what it does.</p>
        )}
      </div>

      {valid && amount >= 5 ? (
        <p className="mt-3 text-sm text-ink">
          <Icon name="info" className="mr-1 inline size-4 text-blue" />
          Gifts of $5+ qualify for New Zealand&apos;s 33⅓% donation tax credit — you could claim back{" "}
          <strong>{money(taxCredit(amount), { cents: taxCredit(amount) % 1 !== 0 })}</strong>
          {monthly ? " each month" : ""} from Inland Revenue.
        </p>
      ) : null}

      {/* Payment — all simulated */}
      <div className="mt-5 space-y-2">
        <p className="font-extrabold text-navy">Pay in one tap</p>
        <button type="button" disabled={!valid} onClick={() => setMethod("apple-pay")} aria-label="Apple Pay · demo" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black font-bold text-white disabled:opacity-50">
          <AppleMark /> Pay <span className="text-xs font-normal opacity-80">· demo</span>
        </button>
        <button type="button" disabled={!valid} onClick={() => setMethod("google-pay")} aria-label="Google Pay · demo" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#3c4043] bg-white font-bold text-[#3c4043] disabled:opacity-50">
          <GoogleMark /> Pay <span className="text-xs font-normal opacity-80">· demo</span>
        </button>
        <button type="button" disabled={!valid} onClick={() => setMethod("card")} className={`${btn.secondary} w-full`}>
          <Icon name="card" /> Card
        </button>
        <p className="flex items-start gap-2 pt-1 text-xs text-muted">
          <Icon name="lock" className="size-4 shrink-0" />
          Just your name and email for the receipt — no address or phone. Demo only: no payment is taken and
          you&apos;ll never be asked for card details.
        </p>
      </div>

      <Sheet
        open={method !== null}
        onClose={() => !processing && setMethod(null)}
        title={method ? `Pay with ${METHOD_LABEL[method]} — demo` : "Pay — demo"}
        description="A simulated payment sheet. Nothing is charged."
      >
        <div className="rounded-2xl bg-sand p-4">
          <p className="flex justify-between font-bold text-navy">
            <span>{appeal}</span>
            <span>
              {money(amount)}
              {monthly ? "/mo" : ""}
            </span>
          </p>
          <p className="mt-1 text-sm">{capitalise(impact.outcome)}{monthly ? ", every month" : ""}.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pay();
          }}
        >
          {method === "card" ? (
            <fieldset className="mt-4">
              <legend className="font-extrabold text-navy">Your details for the tax receipt</legend>
              <p className="mt-1 text-sm text-muted">
                That&apos;s all we need: the receipt only needs your name, and we email it to you. No address or phone
                before you give.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${customId}-first`} className="text-sm font-bold text-navy">First name</label>
                  <input id={`${customId}-first`} required defaultValue="Alex" autoComplete="off" className={field} />
                </div>
                <div>
                  <label htmlFor={`${customId}-last`} className="text-sm font-bold text-navy">Last name</label>
                  <input id={`${customId}-last`} required defaultValue="Taylor" autoComplete="off" className={field} />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor={`${customId}-email`} className="text-sm font-bold text-navy">Email for your receipt</label>
                <input id={`${customId}-email`} type="email" required defaultValue="alex@example.com" autoComplete="off" className={field} />
              </div>
              {monthly ? (
                <div className="mt-3">
                  <label htmlFor={`${customId}-phone`} className="text-sm font-bold text-navy">
                    Phone <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input id={`${customId}-phone`} type="tel" autoComplete="off" className={field} aria-describedby={`${customId}-phone-why`} />
                  <p id={`${customId}-phone-why`} className="mt-1 text-xs text-muted">Only used if a monthly payment fails, so your gift doesn&apos;t quietly stop.</p>
                </div>
              ) : null}
              <label className="mt-3 flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1 size-4 accent-blue" />
                Send me stories about the animals I help (optional)
              </label>
              <p className="mt-1 text-xs text-muted">Sample details, pre-filled. Nothing leaves your browser.</p>
              <p className="mt-4 rounded-2xl border-2 border-dashed border-line p-4 text-sm">
                On the live site, the payment gateway&apos;s secure card field would appear here, so card numbers never touch
                SPCA&apos;s servers. <strong>This demo never asks for card details.</strong>
              </p>
            </fieldset>
          ) : (
            <p className="mt-4 text-sm">
              On a real phone this opens the {method ? METHOD_LABEL[method] : ""} sheet. Your name and email for the tax
              receipt come from the wallet, so there&apos;s no form to fill in. Here we&apos;ll simulate it.
            </p>
          )}
          <button
            type="submit"
            disabled={processing}
            className={`mt-5 w-full ${method === "apple-pay" ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-black font-bold text-white" : btn.primary}`}
          >
            {processing ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
                Processing…
              </>
            ) : (
              `Confirm ${money(amount)}${monthly ? " monthly" : ""} (simulated)`
            )}
          </button>
        </form>
      </Sheet>
    </div>
  );
}

const field = "mt-1 min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px] text-navy";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function AppleMark() {
  return (
    <svg viewBox="0 0 17 20" className="h-5 w-4" fill="currentColor" aria-hidden>
      <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.1-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.7-1-2.7-4.3zM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}
