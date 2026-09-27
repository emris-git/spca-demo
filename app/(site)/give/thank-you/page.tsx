import type { Metadata } from "next";
import Link from "next/link";
import { AppealProgress } from "@/components/give/AppealProgress";
import { AfterGiftDetails } from "@/components/give/AfterGiftDetails";
import { MonthlyUpsell } from "@/components/give/MonthlyUpsell";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { getDemoState } from "@/lib/demo-server";
import { money } from "@/lib/format";
import { nearestImpact, type Impact } from "@/lib/mocks/impact";
import type { PhotoKey } from "@/lib/photos.generated";
import { EventsService } from "@/lib/services/events";
import { METHOD_LABEL, taxCredit, type PaymentMethod } from "@/lib/services/payment";
import { btn, container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Thank you" };

const PHOTO: Record<Impact["icon"], PhotoKey> = { rabbit: "rabbit-snow", bed: "hero-bed", kitten: "hero-kittens", heart: "dog-nana" };

export default async function ThankYouPage({ searchParams }: PageProps<"/give/thank-you">) {
  const demo = await getDemoState();
  const params = await searchParams;
  const amount = Math.max(2, Math.min(Math.floor(Number(params.amount)) || 30, 100_000));
  const monthly = params.freq === "monthly";
  const method = (typeof params.method === "string" && params.method in METHOD_LABEL ? params.method : "card") as PaymentMethod;
  const ref = typeof params.ref === "string" ? params.ref.replace(/[^A-Z0-9-]/g, "").slice(0, 16) : "DEMO";
  const impact = nearestImpact(amount);
  const exact = impact.amount === amount;
  const campaign = EventsService.campaign(demo.now);
  const progress = EventsService.appealProgress(demo.now, campaign, demo.given);

  return (
    <div className={`${container} max-w-3xl pt-8`}>
      <div className="overflow-hidden rounded-3xl bg-navy text-cream on-dark">
        <div className="relative aspect-[16/9]">
          <Photo photo={PHOTO[impact.icon]} sizes="(min-width: 768px) 768px, 100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
        </div>
        <div className="relative -mt-16 p-5 sm:p-8">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-orange">Thank you</p>
          <h1 className="mt-2 animate-rise font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
            {monthly
              ? `Your ${money(amount)} a month will ${impact.base} — every month.`
              : exact
                ? `Your ${money(amount)} just ${impact.past}.`
                : `Your ${money(amount)} is already at work — ${amount > impact.amount ? "more than" : "close to"} what it takes to ${impact.base}.`}
          </h1>
          <p className="mt-3 text-mist">
            {money(amount)}
            {monthly ? " a month" : ""} via {METHOD_LABEL[method]} · demo receipt {ref} · nothing was charged
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {!monthly ? <MonthlyUpsell amount={amount} impactAmount={impact.amount} impactPast={impact.past} /> : null}

        <AppealProgress
          name={campaign.appeal.name}
          raised={progress.raised}
          goal={progress.goal}
          supporters={progress.supporters + 1}
          milestones={campaign.appeal.milestones}
          yourGift={amount}
          live={false}
        />

        <AfterGiftDetails />

        <section aria-labelledby="next" className="rounded-3xl border border-line bg-paper p-5">
          <p className={eyebrow}>What happens next</p>
          <h2 id="next" className="mt-1 font-serif text-xl font-bold">
            We&apos;ll show you where it went
          </h2>
          <ul className="mt-3 space-y-3">
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-blue" />
              <span>A tax receipt by email today. Claim {money(taxCredit(amount), { cents: taxCredit(amount) % 1 !== 0 })} back with the donation tax credit.</span>
            </li>
            <li className="flex gap-3">
              <Icon name="heart" className="mt-0.5 size-5 shrink-0 text-blue" />
              <span>In about three weeks: a short story and photo of an animal your gift helped.</span>
            </li>
            <li className="flex gap-3">
              <Icon name="users" className="mt-0.5 size-5 shrink-0 text-blue" />
              <span>A note when the appeal hits its goal — so you see the whole effect, not just your part.</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-muted">In the demo no email is sent; this is what the CRM journey would do.</p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/adopt" className={btn.primary}>
            Meet the animals you&apos;re helping
          </Link>
          <Link href="/give/gifts-in-wills" className={btn.secondary}>
            Leave a gift in your Will
          </Link>
        </div>
      </div>
    </div>
  );
}
