import Link from "next/link";
import { AnimalCard } from "@/components/AnimalCard";
import { CallButton } from "@/components/CallButton";
import { Icon, type IconName } from "@/components/Icon";
import { LocationPicker } from "@/components/LocationPicker";
import { Photo } from "@/components/Photo";
import { WhatsOnStrip } from "@/components/WhatsOnStrip";
import { getDemoState } from "@/lib/demo-server";
import { money } from "@/lib/format";
import type { Goal } from "@/lib/mocks/campaigns";
import { IMPACT_LADDER } from "@/lib/mocks/impact";
import { AdoptionService } from "@/lib/services/adoption";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { btn, card, container, eyebrow } from "@/lib/ui";

const GOALS: Record<Goal, { href: string; title: string; icon: IconName; links: { href: string; label: string }[] }> = {
  adopt: {
    href: "/adopt",
    title: "Adopt",
    icon: "paw",
    links: [
      { href: "/adopt", label: "Meet the animals" },
      { href: "/adopt/match", label: "60-second match quiz" },
    ],
  },
  give: {
    href: "/give",
    title: "Give",
    icon: "gift",
    links: [
      { href: "/give", label: "Donate once or monthly" },
      { href: "/give/gifts-in-wills", label: "Gifts in Wills" },
    ],
  },
  help: {
    href: "/get-help",
    title: "Get help",
    icon: "alert",
    links: [
      { href: "/get-help", label: "Report animal cruelty" },
      { href: "/get-help#advice", label: "Pet advice" },
    ],
  },
  involved: {
    href: "/get-involved",
    title: "Get involved",
    icon: "users",
    links: [
      { href: "/get-involved#volunteer", label: "Volunteer" },
      { href: "/get-involved#foster", label: "Foster" },
    ],
  },
};

export default async function HomePage() {
  const demo = await getDemoState();
  const campaign = EventsService.campaign(demo.now);
  const centre = LocationService.getCentre(demo.location?.centreId);
  const status = centre ? LocationService.status(centre, demo.now) : null;
  const animals = AdoptionService.list(demo.now, demo.location);
  const nearby = [...animals]
    .sort((a, b) => (a.km ?? 0) - (b.km ?? 0) || b.daysInCare - a.daysInCare)
    .slice(0, 3);
  const events = EventsService.upcoming(demo.now, centre?.id ?? null, 8);
  const hero = campaign.hero;

  const blurbs: Record<Goal, string> = {
    adopt: campaign.adoptionDiscount
      ? `${animals.length} animals, 50% off fees right now`
      : `${animals.length} animals looking for their people`,
    give: "$30 vaccinates a rabbit. See what yours does.",
    help: "Animal in danger? One question gets you the right number.",
    involved: "Volunteer, foster a litter, or fundraise your way.",
  };

  return (
    <>
      {/* Hero adapts to "campaign mode" */}
      <section className="relative overflow-hidden bg-navy text-cream on-dark">
        <div className="absolute inset-0 md:left-1/2">
          <Photo photo={hero.photo} sizes="(min-width: 768px) 50vw, 100vw" priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10 md:bg-gradient-to-r md:from-navy md:via-navy/20 md:to-transparent" />
        </div>
        <div className={`${container} relative flex min-h-[440px] flex-col justify-end pb-12 pt-28 md:min-h-[560px] md:justify-center md:pt-16`}>
          <div className="max-w-xl animate-rise">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-orange">{hero.eyebrow}</p>
            <h1 className="mt-3 font-serif text-[2rem] font-bold leading-[1.1] text-cream sm:text-5xl">{hero.title}</h1>
            <p className="mt-3 text-mist sm:mt-4 sm:text-lg">{hero.body}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={hero.primary.href} className={btn.accent}>
                {hero.primary.label}
                <Icon name="arrow-right" />
              </Link>
              <Link href={hero.secondary.href} className={btn.onDark}>
                {hero.secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Four goals, one tap each */}
      <section aria-labelledby="goals-heading" className={`${container} relative z-10 -mt-6`}>
        <h2 id="goals-heading" className="sr-only">
          What brings you here?
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {campaign.goals.map((goal, i) => {
            const g = GOALS[goal];
            const lead = i === 0;
            return (
              <li key={goal} className={`relative flex flex-col rounded-3xl border p-4 shadow-sm sm:p-5 ${lead ? "border-orange bg-orange-soft" : "border-line bg-paper"}`}>
                <span className={`grid size-11 place-items-center rounded-2xl ${lead ? "bg-navy text-orange" : "bg-sky text-blue"}`}>
                  <Icon name={g.icon} className="size-6" />
                </span>
                <h3 className="mt-3 font-serif text-xl font-bold">
                  <Link href={g.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {g.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm leading-snug text-ink">{blurbs[goal]}</p>
                <ul className="relative z-10 mt-3 hidden space-y-1 text-sm font-bold sm:block">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-blue hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Nearest centre */}
      <section aria-labelledby="centre-heading" className={`${container} mt-10`}>
        <div className={`${card} grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_1fr]`}>
          {centre && status ? (
            <>
              <div>
                <p className={eyebrow}>{demo.location?.source === "gps" ? "Nearest to you" : "Your centre"}</p>
                <h2 id="centre-heading" className="mt-1 font-serif text-2xl font-bold">
                  {centre.name}
                </h2>
                <p className="text-muted">{centre.area}</p>
                <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-extrabold ${status.open ? "bg-green-soft text-green" : "bg-sand text-navy"}`}>
                  <Icon name="clock" className="size-4" />
                  {status.label}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/adopt?centre=${centre.id}`} className={btn.primary}>
                    Animals at {centre.name.replace(" Centre", "")}
                  </Link>
                  <CallButton who={centre.name} number={centre.phone} variant="secondary" label="Call the centre" />
                </div>
              </div>
              <div className="rounded-2xl bg-sand p-4 text-sm">
                <p className="font-extrabold text-navy">Not your centre?</p>
                <div className="mt-3">
                  <LocationPicker currentId={centre.id} compact />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className={eyebrow}>Near you</p>
                <h2 id="centre-heading" className="mt-1 font-serif text-2xl font-bold">
                  Find your nearest centre
                </h2>
                <p className="mt-2">
                  Share your location once and we&apos;ll show opening hours, animals near you, local events and the
                  right number to call — across the whole site.
                </p>
              </div>
              <LocationPicker currentId={null} />
            </>
          )}
        </div>
      </section>

      {/* What's on */}
      <section aria-labelledby="whatson-heading" className="mt-12">
        <div className={`${container} flex items-end justify-between gap-4`}>
          <div>
            <p className={eyebrow}>What&apos;s on</p>
            <h2 id="whatson-heading" className="font-serif text-2xl font-bold sm:text-3xl">
              {centre ? `Coming up near ${centre.name.replace(" Centre", "")}` : "Coming up around Aotearoa"}
            </h2>
          </div>
          <Link href="/events" className="shrink-0 font-extrabold text-blue hover:underline">
            Full calendar
          </Link>
        </div>
        <WhatsOnStrip events={events} now={demo.now} />
      </section>

      {/* Animals */}
      <section aria-labelledby="animals-heading" className={`${container} mt-12`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={eyebrow}>{centre ? "Closest to you" : "Waiting the longest"}</p>
            <h2 id="animals-heading" className="font-serif text-2xl font-bold sm:text-3xl">
              Could it be you?
            </h2>
          </div>
          <Link href="/adopt" className="shrink-0 font-extrabold text-blue hover:underline">
            See all {animals.length}
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((a) => (
            <li key={a.id}>
              <AnimalCard animal={a} />
            </li>
          ))}
        </ul>
      </section>

      {/* Voice */}
      <section className={`${container} mt-12`}>
        <div className="grid overflow-hidden rounded-3xl bg-orange text-navy md:grid-cols-2">
          <div className="p-6 sm:p-10">
            <p className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
              Skip the sports car. <br />
              Get a best friend who&apos;s thrilled every time you come home.
            </p>
            <Link href="/adopt/match" className={`${btn.dark} mt-6`}>
              Find your match in 60 seconds
            </Link>
          </div>
          <div className="relative min-h-56">
            <Photo photo="hero-friends" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      {/* Giving teaser */}
      <section aria-labelledby="give-heading" className={`${container} mt-12`}>
        <p className={eyebrow}>Give</p>
        <h2 id="give-heading" className="font-serif text-2xl font-bold sm:text-3xl">
          Every dollar has a job
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {IMPACT_LADDER.map((step) => (
            <li key={step.amount}>
              <Link
                href={`/give?amount=${step.amount}`}
                className="flex h-full flex-col rounded-3xl border border-line bg-paper p-4 hover:border-blue"
              >
                <span className="font-serif text-3xl font-bold text-blue">{money(step.amount)}</span>
                <span className="mt-1 text-[15px] leading-snug">{step.outcome}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
