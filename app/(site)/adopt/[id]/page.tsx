import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalCard } from "@/components/AnimalCard";
import { CallButton } from "@/components/CallButton";
import { FavouriteButton } from "@/components/FavouriteButton";
import { Icon } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { TrackView } from "@/components/TrackView";
import { getDemoState } from "@/lib/demo-server";
import { distance, money } from "@/lib/format";
import { ANIMALS, ENERGY_LABEL, EXPERIENCE_LABEL, SIZE_LABEL, SPECIES_LABEL, ageLabel, type Animal } from "@/lib/mocks/animals";
import { AdoptionService } from "@/lib/services/adoption";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { btn, card, eyebrow } from "@/lib/ui";

export async function generateMetadata({ params }: PageProps<"/adopt/[id]">): Promise<Metadata> {
  const { id } = await params;
  const a = ANIMALS.find((x) => x.id.toLowerCase() === id.toLowerCase());
  return { title: a ? `${a.name} — adopt` : "Animal not found" };
}

function checklist(a: Animal) {
  const items = [
    a.species === "dog"
      ? `Time for ${a.energy === "high" ? "at least two good walks" : "a daily walk"} and some training`
      : a.species === "cat"
        ? "A safe indoor space and a plan for the first few weeks"
        : "A roomy, predator-proof enclosure and daily time together",
    "A budget for food, vet care and the unexpected",
    "Your landlord's OK, if you rent",
    a.goodWithAnimals ? "An introduction plan for any pets you already have" : `No other pets at home — ${a.name} wants to be the only one`,
  ];
  if (a.experience === "experienced") items.unshift(`Experience with ${a.species === "dog" ? "dogs" : "animals"} who need a confident, patient owner`);
  return items.slice(0, 4);
}

export default async function AnimalPage({ params }: PageProps<"/adopt/[id]">) {
  const { id } = await params;
  const demo = await getDemoState();
  const animal = AdoptionService.get(id, demo.now, demo.location);
  if (!animal) notFound();

  const centre = LocationService.getCentre(animal.centreId)!;
  const status = LocationService.status(centre, demo.now);
  const campaign = EventsService.campaign(demo.now);
  const discount = campaign.adoptionDiscount ?? 0;
  const fee = AdoptionService.fee(animal, discount);
  const similar = AdoptionService.list(demo.now, demo.location)
    .filter((a) => a.id !== animal.id && a.species === animal.species)
    .sort((a, b) => Math.abs(a.ageMonths - animal.ageMonths) - Math.abs(b.ageMonths - animal.ageMonths))
    .slice(0, 3);

  const glance = [
    { label: "Children", value: animal.goodWithChildren === "yes" ? "Good with children" : animal.goodWithChildren === "older" ? "Best with older children" : "Adults-only home" },
    { label: "Other animals", value: animal.animalsNote },
    { label: "Energy", value: ENERGY_LABEL[animal.energy] },
    { label: "Experience", value: EXPERIENCE_LABEL[animal.experience] },
    { label: "Size", value: SIZE_LABEL[animal.size] },
    { label: "Age", value: ageLabel(animal.ageMonths) },
  ];

  const apply = `/adopt/${animal.id}/apply`;

  return (
    <div className="pb-28 lg:pb-0">
      <TrackView name="view_animal" props={{ animal_id: animal.id, species: animal.species, campaign: campaign.id }} />
      <div className="lg:mx-auto lg:max-w-6xl lg:px-6 lg:pt-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          <div>
            {/* Photo first */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand lg:rounded-3xl">
              <Photo photo={animal.photo} sizes="(min-width: 1024px) 700px, 100vw" priority />
              <Link
                href="/adopt"
                className="absolute left-3 top-3 inline-flex min-h-11 items-center gap-1 rounded-full bg-paper/95 px-3 text-sm font-extrabold text-navy shadow"
              >
                <Icon name="chevron-left" className="size-4" />
                All animals
              </Link>
            </div>

            <div className="px-4 pt-5 sm:px-6 lg:px-0">
              <div className="flex flex-wrap gap-2">
                {animal.longStay ? <span className="rounded-full bg-orange px-2.5 py-1 text-xs font-extrabold text-navy">Long-stay legend · {animal.daysInCare} days with us</span> : null}
                {animal.inFoster ? <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-cream">In foster care</span> : null}
                {animal.daysInCare <= 5 ? <span className="rounded-full bg-sky px-2.5 py-1 text-xs font-extrabold text-blue">Just arrived</span> : null}
              </div>
              <h1 className="mt-2 font-serif text-4xl font-bold">{animal.name}</h1>
              <p className="mt-1 text-muted">
                {SPECIES_LABEL[animal.species]} · {animal.breed} · {animal.sex === "Pair" ? "Pair" : animal.sex} · {ageLabel(animal.ageMonths)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-muted">
                <Icon name="pin" className="size-4 text-blue" />
                {centre.name}
                {animal.km !== null ? ` · ${distance(animal.km)} from you` : ""}
              </p>

              <p className="mt-5 font-serif text-2xl font-bold leading-snug text-navy">{animal.headline}</p>
              <p className="mt-3 text-[17px]">{animal.story}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {animal.traits.map((t) => (
                  <li key={t} className="rounded-full border border-line bg-paper px-3 py-1 text-sm font-bold text-navy">
                    {t}
                  </li>
                ))}
              </ul>

              <section aria-labelledby="glance" className="mt-8">
                <h2 id="glance" className="font-serif text-xl font-bold">
                  At a glance
                </h2>
                <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {glance.map((g) => (
                    <div key={g.label} className="rounded-2xl bg-paper p-3 ring-1 ring-line">
                      <dt className="text-xs font-extrabold uppercase tracking-wider text-muted">{g.label}</dt>
                      <dd className="mt-1 text-[15px] font-bold leading-snug text-navy">{g.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="ready" className={`${card} mt-8 p-5`}>
                <h2 id="ready" className="font-serif text-xl font-bold">
                  Is {animal.name} right for you?
                </h2>
                <p className="mt-1 text-sm text-muted">A quick check before you apply. Ticked all four? Go for it.</p>
                <ul className="mt-3 space-y-2">
                  {checklist(animal).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-green-soft text-green">
                        <Icon name="check" className="size-4" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/adopt/ready" className="mt-4 inline-flex min-h-11 items-center gap-1 font-extrabold text-blue hover:underline">
                  Read the full “Are you ready to adopt?” guide
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </section>

              <section aria-labelledby="how" className="mt-8">
                <h2 id="how" className="font-serif text-xl font-bold">
                  How adopting {animal.name} works
                </h2>
                <ol className="mt-3 space-y-3">
                  {[
                    ["Apply online", "Ten minutes on our adoption partner's form. We carry over who you're applying for."],
                    [`Meet ${animal.name}`, `The ${centre.name} team calls you to book a meet-and-greet${animal.inFoster ? " with the foster carer" : ""}.`],
                    ["Take them home", "Desexed, vaccinated and microchipped, with a vet check and support afterwards."],
                  ].map(([title, body], i) => (
                    <li key={title} className="flex gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy font-extrabold text-orange">{i + 1}</span>
                      <div>
                        <p className="font-extrabold text-navy">{title}</p>
                        <p className="text-[15px]">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className={`${card} sticky top-16 p-5`}>
              <FeeBlock fee={fee} full={animal.fee} discount={discount} />
              <div className="mt-4 flex gap-2">
                <Link href={apply} className={`${btn.accent} flex-1`}>
                  Apply for {animal.name}
                </Link>
                <FavouriteButton id={animal.id} name={animal.name} variant="bar" />
              </div>
              <CentreBlock centreName={centre.name} status={status.label} open={status.open} phone={centre.phone} />
            </div>
          </aside>
        </div>

        <div className="px-4 sm:px-6 lg:hidden">
          <div className={`${card} mt-8 p-5`}>
            <FeeBlock fee={fee} full={animal.fee} discount={discount} />
            <CentreBlock centreName={centre.name} status={status.label} open={status.open} phone={centre.phone} />
          </div>
        </div>

        {similar.length ? (
          <section aria-labelledby="similar" className="mt-12 px-4 sm:px-6 lg:px-0">
            <p className={eyebrow}>You might also like</p>
            <h2 id="similar" className="font-serif text-2xl font-bold">
              More {animal.species === "small" ? "small animals" : `${SPECIES_LABEL[animal.species].toLowerCase()}s`} looking for a home
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((a) => (
                <li key={a.id}>
                  <AnimalCard animal={a} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* Sticky mobile apply bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <FavouriteButton id={animal.id} name={animal.name} variant="bar" />
          <Link href={apply} className={`${btn.accent} flex-1`}>
            Apply for {animal.name}
            <span className="font-bold opacity-80">· {money(fee)}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeeBlock({ fee, full, discount }: { fee: number; full: number; discount: number }) {
  return (
    <div>
      <p className="text-sm font-bold text-muted">Adoption fee</p>
      <p className="font-serif text-3xl font-bold text-navy">
        {money(fee)}
        {discount ? <span className="ml-2 align-middle text-lg text-muted line-through">{money(full)}</span> : null}
      </p>
      {discount ? <p className="mt-1 text-sm font-extrabold text-rust">Clear the Shelters: 50% off</p> : null}
      <p className="mt-1 text-sm">Includes desexing, vaccinations, microchip and a vet check.</p>
    </div>
  );
}

function CentreBlock({ centreName, status, open, phone }: { centreName: string; status: string; open: boolean; phone: string }) {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <p className="font-extrabold text-navy">{centreName}</p>
      <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-bold ${open ? "text-green" : "text-muted"}`}>
        <Icon name="clock" className="size-4" />
        {status}
      </p>
      <p className="mt-1 text-sm">Visits by appointment. Questions first? Give the team a ring.</p>
      <CallButton who={centreName} number={phone} variant="secondary" label="Call the centre" className="mt-3 w-full" />
    </div>
  );
}
