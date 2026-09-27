import type { Metadata } from "next";
import Link from "next/link";
import { EventCta } from "@/components/EventCta";
import { Icon } from "@/components/Icon";
import { MockNotice } from "@/components/MockNotice";
import { Photo } from "@/components/Photo";
import { WhatsOnStrip } from "@/components/WhatsOnStrip";
import { getDemoState } from "@/lib/demo-server";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { btn, container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Get involved" };

const ROLES = [
  { id: "dog-walker", title: "Dog walker", time: "2 hours a week", body: "Walks, sniffs and a bit of training for dogs waiting for homes." },
  { id: "cat-cuddler", title: "Cat socialiser", time: "2 hours a week", body: "Help shy cats learn that people are OK. Lap required." },
  { id: "op-shop", title: "Op Shop assistant", time: "One shift a week", body: "Sort, price and sell donated treasures that fund the centre." },
  { id: "bucket", title: "Street appeal collector", time: "One hour in October", body: "Grab a bucket for Fill the Bucket. The easiest hour you'll give all year." },
];

export default async function GetInvolvedPage() {
  const demo = await getDemoState();
  const centre = LocationService.getCentre(demo.location?.centreId);
  const campaign = EventsService.campaign(demo.now);
  const events = EventsService.upcoming(demo.now, centre?.id ?? null, 8);
  const kittenSeason = campaign.id === "kitten-season" || campaign.id === "christmas";

  return (
    <div>
      <div className={`${container} pt-8`}>
        <p className={eyebrow}>Get involved</p>
        <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Give time, a spare room, or a bake sale</h1>
        <p className="mt-2 max-w-2xl text-lg">
          Thousands of volunteers and fosterers keep SPCA going. Pick the way that fits your week.
        </p>
        <nav aria-label="On this page" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
          {[["#volunteer", "Volunteer"], ["#foster", "Foster"], ["#fundraise", "Fundraise"], ["#events", "Events"], ["#shop", "Op Shops"]].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-line bg-paper px-4 font-bold text-navy">
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section id="volunteer" aria-labelledby="vol" className={`${container} mt-10 scroll-mt-16`}>
        <h2 id="vol" className="font-serif text-2xl font-bold sm:text-3xl">
          Volunteer{centre ? ` at ${centre.name}` : ""}
        </h2>
        <p className="mt-1 text-muted">
          {centre ? "Roles open now near you (sample roles)." : "Set your centre in the header to see roles near you. Sample roles:"}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <li key={r.id} className="flex flex-col rounded-3xl border border-line bg-paper p-5">
              <p className="text-sm font-bold text-blue">{r.time}</p>
              <h3 className="font-serif text-lg font-bold">{r.title}</h3>
              <p className="mt-1 text-[15px]">{r.body}</p>
              <div className="mt-4">
                <EventCta eventId={`volunteer-${r.id}`} title={`${r.title}: register interest`} label="Register interest" action="signup" href="#" compact />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="foster" aria-labelledby="fos" className={`${container} mt-12 scroll-mt-16`}>
        <div className="grid overflow-hidden rounded-3xl bg-navy text-cream on-dark md:grid-cols-2">
          <div className="relative min-h-60">
            <Photo photo="hero-kittens" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-orange">{kittenSeason ? "Kitten season · needed now" : "Foster"}</p>
            <h2 id="fos" className="mt-2 font-serif text-2xl font-bold text-cream sm:text-3xl">
              A spare room can save a litter
            </h2>
            <p className="mt-3 text-mist">
              Fosterers care for animals at home until they&apos;re ready to adopt: kittens too young, dogs recovering from
              surgery, shy cats who need a quiet space. We cover food and vet costs and back you up 24/7.
            </p>
            <div className="mt-5">
              <EventCta eventId="foster-interest" title="Become a foster carer" label="Become a foster carer" action="signup" href="#" />
            </div>
          </div>
        </div>
      </section>

      <section id="fundraise" aria-labelledby="fun" className={`${container} mt-12 scroll-mt-16`}>
        <h2 id="fun" className="font-serif text-2xl font-bold sm:text-3xl">Fundraise your way</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-paper p-5">
            <Icon name="cake" className="size-7 text-rust" />
            <h3 className="mt-2 font-serif text-lg font-bold">Host a Cupcake Day</h3>
            <p className="mt-1 text-[15px]">Every September. Sign up, get your kit and bake. Workplaces compete on a leaderboard.</p>
            <div className="mt-4">
              <EventCta eventId="cupcake-day-host" title="Host a Cupcake Day" label="Sign up to host" action="signup" href="#" compact />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-5">
            <Icon name="star" className="size-7 text-rust" />
            <h3 className="mt-2 font-serif text-lg font-bold">Start your own fundraiser</h3>
            <p className="mt-1 text-[15px]">Birthday, marathon or head shave — get a page, a goal and a share link in two minutes.</p>
            <MockNotice label="Start a fundraiser" title="Peer-to-peer fundraising — demo" className="mt-4 min-h-11 text-sm" track="fundraise_start">
              <p>
                On the live site this starts a fundraising page on SPCA&apos;s peer-to-peer platform (Raisely today). In the
                replatform, sign-up would start here, on spca.nz, and hand over with the campaign and centre already set.
              </p>
            </MockNotice>
          </div>
        </div>
      </section>

      <section id="events" aria-labelledby="ev" className="mt-12 scroll-mt-16">
        <div className={`${container} flex items-end justify-between`}>
          <h2 id="ev" className="font-serif text-2xl font-bold sm:text-3xl">Coming up</h2>
          <Link href="/events" className="font-extrabold text-blue hover:underline">Full calendar</Link>
        </div>
        <WhatsOnStrip events={events} now={demo.now} />
      </section>

      <section id="shop" aria-labelledby="shop-h" className={`${container} mt-12 scroll-mt-16`}>
        <div className="rounded-3xl bg-sand p-6">
          <h2 id="shop-h" className="font-serif text-2xl font-bold">Shop, donate goods, or both</h2>
          <p className="mt-2 max-w-2xl">
            SPCA&apos;s 90+ Op Shops turn pre-loved goods into animal care. Drop off donations or shop online.
          </p>
          <MockNotice label={<>Visit the online Op Shop <Icon name="external" className="size-4" /></>} title="Online Op Shop — demo" className="mt-4" track="opshop_tap">
            <p>On the live site this opens the Op Shop store (Shopify). The demo doesn&apos;t leave this site.</p>
          </MockNotice>
        </div>
        <Link href="/give" className={`${btn.accent} mt-6`}>Or make a donation</Link>
      </section>
    </div>
  );
}
