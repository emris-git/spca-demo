import type { Metadata } from "next";
import Link from "next/link";
import { AppealProgress } from "@/components/give/AppealProgress";
import { DonateForm } from "@/components/give/DonateForm";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { TrackView } from "@/components/TrackView";
import { getDemoState } from "@/lib/demo-server";
import { EventsService } from "@/lib/services/events";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Give" };

export default async function GivePage({ searchParams }: PageProps<"/give">) {
  const demo = await getDemoState();
  const params = await searchParams;
  const campaign = EventsService.campaign(demo.now);
  const progress = EventsService.appealProgress(demo.now, campaign, demo.given);
  const requested = Number(params.amount);
  const initialAmount = Number.isFinite(requested) && requested > 0 ? Math.min(Math.floor(requested), 100_000) : null;

  return (
    <div className={`${container} pt-8`}>
      <TrackView name="view_donate" props={{ appeal: campaign.id }} />
      <div className="grid gap-8 lg:grid-cols-[1fr_440px]">
        <div>
          <p className={eyebrow}>{campaign.appeal.name}</p>
          <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">See exactly what your gift does</h1>
          <p className="mt-2 text-lg">{campaign.appeal.pitch}</p>
          <div className="mt-6">
            <AppealProgress
              name={campaign.appeal.name}
              raised={progress.raised}
              goal={progress.goal}
              supporters={progress.supporters}
              milestones={campaign.appeal.milestones}
            />
          </div>
          <div className="relative mt-6 hidden aspect-[16/9] overflow-hidden rounded-3xl lg:block">
            <Photo photo="hero-bed" sizes="(min-width: 1024px) 600px, 1px" />
          </div>
        </div>
        <div className="lg:pt-2">
          <DonateForm initialAmount={initialAmount} appeal={campaign.appeal.name} />
        </div>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Other ways to give">
        <Link href="/give/gifts-in-wills" className="group rounded-3xl border border-line bg-paper p-5 hover:border-blue">
          <Icon name="leaf" className="size-6 text-blue" />
          <h2 className="mt-2 font-serif text-xl font-bold">Gifts in Wills</h2>
          <p className="mt-1 text-[15px]">Leave a legacy that looks after animals for generations. Start with a free information pack.</p>
          <span className="mt-3 inline-flex items-center gap-1 font-extrabold text-blue">
            Find out more <Icon name="arrow-right" className="size-4" />
          </span>
        </Link>
        <Link href="/get-involved#fundraise" className="group rounded-3xl border border-line bg-paper p-5 hover:border-blue">
          <Icon name="cake" className="size-6 text-blue" />
          <h2 className="mt-2 font-serif text-xl font-bold">Fundraise</h2>
          <p className="mt-1 text-[15px]">Bake, run, shave or celebrate — turn your thing into vet care.</p>
          <span className="mt-3 inline-flex items-center gap-1 font-extrabold text-blue">
            Start fundraising <Icon name="arrow-right" className="size-4" />
          </span>
        </Link>
        <Link href="/events" className="group rounded-3xl border border-line bg-paper p-5 hover:border-blue">
          <Icon name="calendar" className="size-6 text-blue" />
          <h2 className="mt-2 font-serif text-xl font-bold">Appeals and events</h2>
          <p className="mt-1 text-[15px]">See every appeal and event in the year — nationally and near you.</p>
          <span className="mt-3 inline-flex items-center gap-1 font-extrabold text-blue">
            What&apos;s on <Icon name="arrow-right" className="size-4" />
          </span>
        </Link>
      </section>
    </div>
  );
}
