import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdopetsMock } from "@/components/adopt/AdopetsMock";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { getDemoState } from "@/lib/demo-server";
import { money } from "@/lib/format";
import { SPECIES_LABEL, ageLabel } from "@/lib/mocks/animals";
import { AdoptionService } from "@/lib/services/adoption";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Apply to adopt" };

export default async function ApplyPage({ params }: PageProps<"/adopt/[id]/apply">) {
  const { id } = await params;
  const demo = await getDemoState();
  const animal = AdoptionService.get(id, demo.now, demo.location);
  if (!animal) notFound();
  const centre = LocationService.getCentre(animal.centreId)!;
  const campaign = EventsService.campaign(demo.now);
  const fee = AdoptionService.fee(animal, campaign.adoptionDiscount ?? 0);
  const handoff = AdoptionService.handoffUrl(animal, { campaign: campaign.id, source: "animal-profile", now: demo.now });

  return (
    <div className={`${container} max-w-3xl pt-6`}>
      <Link href={`/adopt/${animal.id}`} className="inline-flex min-h-11 items-center gap-1 font-extrabold text-blue">
        <Icon name="chevron-left" className="size-4" />
        Back to {animal.name}
      </Link>
      <p className={`${eyebrow} mt-4`}>Apply · step 1 of 2</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">You&apos;re applying for {animal.name}</h1>
      <p className="mt-2 text-lg">
        Applications are handled by our adoption partner, Adopets. We&apos;ll pass along who you&apos;re applying for, so
        you don&apos;t have to find {animal.name} again.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-line bg-paper p-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-sand">
          <Photo photo={animal.photo} sizes="96px" />
        </div>
        <div>
          <p className="font-serif text-xl font-bold text-navy">{animal.name}</p>
          <p className="text-sm text-muted">
            {SPECIES_LABEL[animal.species]} · {ageLabel(animal.ageMonths)} · ID {animal.id}
          </p>
          <p className="text-sm text-muted">
            {centre.name} · fee {money(fee)}
          </p>
        </div>
      </div>

      <AdopetsMock
        animal={{ id: animal.id, name: animal.name, species: animal.species }}
        centreName={centre.name}
        campaign={campaign.id}
        handoffUrl={handoff}
      />
    </div>
  );
}
