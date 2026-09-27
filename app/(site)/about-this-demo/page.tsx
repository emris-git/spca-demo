import type { Metadata } from "next";
import Link from "next/link";
import { PHOTOS } from "@/lib/photos.generated";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "About this demo" };

const TOUR: [string, string, string][] = [
  ["Home", "/", "Four goals, one tap each. Set your centre, then open the Demo panel and jump to Clear the Shelters or Christmas — the home page changes what it leads with."],
  ["Adopt", "/adopt", "Filter by energy and experience (new), sort by nearest, save favourites, or take the 60-second quiz. Open a profile: photo first, sticky Apply, then the Adopets hand-off."],
  ["Give", "/give", "Every amount maps to an outcome. Try a custom amount, switch to monthly, pay with the simulated Apple Pay sheet and watch the progress bar."],
  ["Get help", "/get-help", "One question first. Set Demo → After hours to see the nearest after-hours vet instead of a closed centre."],
  ["What's on", "/events", "The whole year on one calendar, filterable by centre, each event with a next step."],
];

const MOCKED = [
  "Payments — Apple Pay, Google Pay and card are simulated. No card fields, nothing charged.",
  "Adopets — the hand-off screen is a labelled mock of the partner platform.",
  "CRM, email and forms — nothing is sent. Every form resolves in the browser with a fake reference.",
  "Analytics — events are shown in the Demo panel, never sent to GA4.",
  "Animals, people, phone numbers, opening hours, events and campaign figures — invented.",
];

export default function AboutPage() {
  const credits = Object.entries(PHOTOS).sort(([, a], [, b]) => a.author.localeCompare(b.author));
  return (
    <div className={`${container} max-w-3xl pt-8`}>
      <p className={eyebrow}>About this demo</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">A working prototype, not the SPCA website</h1>
      <p className="mt-3 text-lg">
        I built this as part of my application for the Website Project Manager role, to make the ideas in my deck —
        clear paths, giving that grows, and real life on the site — something you can click. It is an independent
        concept and is not affiliated with or endorsed by SPCA.
      </p>
      <p className="mt-2 font-bold text-navy">— Mikhail Gorbunov</p>

      <section aria-labelledby="tour" className="mt-10">
        <h2 id="tour" className="font-serif text-2xl font-bold">A two-minute tour</h2>
        <ol className="mt-4 space-y-3">
          {TOUR.map(([title, href, body], i) => (
            <li key={title} className="flex gap-3 rounded-3xl border border-line bg-paper p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy font-extrabold text-orange">{i + 1}</span>
              <div>
                <Link href={href} className="font-extrabold text-blue underline">{title}</Link>
                <p className="mt-1 text-[15px]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="mocked" className="mt-10 rounded-3xl border-2 border-orange bg-orange-soft p-5 text-navy">
        <h2 id="mocked" className="font-serif text-2xl font-bold">Everything is mocked</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          {MOCKED.map((m) => <li key={m}>{m}</li>)}
        </ul>
        <p className="mt-3 text-sm">
          Each integration sits behind a typed service adapter, so a real build swaps the mock for Adopets, a payment
          gateway, the CRM or a headless CMS without touching the pages.
        </p>
      </section>

      <section aria-labelledby="credits-h" id="credits" className="mt-10 scroll-mt-16">
        <h2 id="credits-h" className="font-serif text-2xl font-bold">Photo credits</h2>
        <p className="mt-1 text-muted">All photos are from Unsplash under the Unsplash Licence. Animal names and stories are invented.</p>
        <ul className="mt-3 grid gap-1 text-[15px] sm:grid-cols-2">
          {credits.map(([key, p]) => (
            <li key={key}>
              {p.author} — <span className="text-muted">{p.alt.toLowerCase()}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Source links for every photo are listed in the project README.</p>
      </section>
    </div>
  );
}
