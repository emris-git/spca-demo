import type { Metadata } from "next";
import { AdoptBrowser } from "@/components/adopt/AdoptBrowser";
import { Icon } from "@/components/Icon";
import { getDemoState } from "@/lib/demo-server";
import { AdoptionService } from "@/lib/services/adoption";
import { EventsService } from "@/lib/services/events";
import { formatDate } from "@/lib/time";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Adopt" };

export default async function AdoptPage({ searchParams }: PageProps<"/adopt">) {
  const demo = await getDemoState();
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (typeof v === "string") query.set(k, v);

  const animals = AdoptionService.list(demo.now, demo.location);
  const campaign = EventsService.campaign(demo.now);
  const cts = campaign.id === "clear-the-shelters" ? EventsService.upcoming(demo.now, null, 10).find((e) => e.id.startsWith("clear-the-shelters")) : null;

  return (
    <div className={`${container} pt-8`}>
      <p className={eyebrow}>Adopt</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Find your new best friend</h1>
      <p className="mt-2 max-w-2xl text-lg">
        Filter by what matters at home — energy, experience, kids and other pets — then apply online in minutes.
      </p>
      {cts ? (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-orange-soft p-4 font-bold text-navy">
          <Icon name="sparkle" className="mt-0.5 size-5 shrink-0 text-rust" />
          Clear the Shelters: 50% off every adoption fee until {formatDate(cts.endDate, { day: "numeric", month: "long" })}.
        </p>
      ) : null}
      <div className="mt-6">
        <AdoptBrowser
          animals={animals}
          initialQuery={query.toString()}
          hasLocation={Boolean(demo.location)}
          centreId={demo.location?.centreId ?? null}
        />
      </div>
    </div>
  );
}
