import type { Metadata } from "next";
import Link from "next/link";
import { Triage } from "@/components/help/Triage";
import { Icon } from "@/components/Icon";
import { getDemoState } from "@/lib/demo-server";
import { LocationService } from "@/lib/services/location";
import { btn, container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Get help — report animal cruelty" };

const GUIDANCE: [string, string][] = [
  ["What counts as animal cruelty?", "Hurting an animal on purpose, but also neglect: no food, water or shelter, untreated injury or illness, animals left in unsafe places, or being kept in conditions that cause distress. If you're not sure, tell us — our Inspectors will assess it."],
  ["What happens after I report?", "Every report is triaged by the Inspectorate. Urgent ones get a same-day response where possible; others are prioritised by risk. We may contact you for more detail, but we won't tell anyone who made the report."],
  ["Can I report anonymously?", "Yes. Your details help if we need to ask a follow-up question, but they're optional."],
  ["A dog is locked in a hot car", "Heat kills fast. If the dog is distressed, call your nearest centre or the Police on 111 straight away. Note the car's make, colour and registration."],
  ["Farm animals and horses", "Report welfare concerns about livestock in the same way. For large-scale farm concerns, the Ministry for Primary Industries may also be involved — we'll pass it on."],
  ["Lost, found or stray animals", "A stray isn't always a cruelty case. Check for a collar or microchip at a vet, and contact your local council for stray dogs."],
  ["Wildlife and marine mammals", "Native wildlife, stranded whales, dolphins and seals are looked after by the Department of Conservation. Call 0800 362 468 (0800 DOC HOT), 24/7."],
];

const ADVICE: [string, string][] = [
  ["Desexing", "Why it matters, when to do it, and low-cost options near you."],
  ["Behaviour", "Barking, scratching, fear and first-week nerves — practical help from our team."],
  ["Summer heat", "Hot cars, hot pavements and keeping small animals cool."],
  ["Moving house with pets", "Rentals, introductions and settling in."],
];

export default async function GetHelpPage() {
  const demo = await getDemoState();
  const centre = LocationService.getCentre(demo.location?.centreId);
  const status = centre ? LocationService.status(centre, demo.now) : null;
  const vet = demo.location ? LocationService.nearestAfterHoursVet(demo.location) : null;

  return (
    <div className={`${container} max-w-3xl pt-8`}>
      <p className={eyebrow}>Get help</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Report animal cruelty</h1>
      <p className="mt-2 text-lg">One question first, so you reach the right people fast.</p>

      <div className="mt-6">
        <Triage
          centre={centre ? { id: centre.id, name: centre.name, area: centre.area, phone: centre.phone } : null}
          status={status}
          vet={vet ? { name: vet.name, area: vet.area, phone: vet.phone, km: vet.km } : null}
          locationSource={demo.location?.source ?? null}
        />
      </div>

      {centre ? (
        <details className="group mt-4 rounded-3xl border border-line bg-paper px-5 py-2">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between font-extrabold text-navy">
            {centre.name} opening hours
            <Icon name="chevron-down" className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <dl className="grid grid-cols-2 gap-y-1 pb-3 text-[15px]">
            {LocationService.weekHours(centre).map((d) => (
              <div key={d.day} className="contents">
                <dt>{d.day}</dt>
                <dd className="text-right font-bold text-navy">{d.hours}</dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}

      <section aria-labelledby="guidance" className="mt-10">
        <h2 id="guidance" className="font-serif text-2xl font-bold">
          Full guidance
        </h2>
        <p className="mt-1 text-muted">Everything else you might need, tucked away until you need it.</p>
        <div className="mt-4 divide-y divide-line rounded-3xl border border-line bg-paper">
          {GUIDANCE.map(([q, a]) => (
            <details key={q} className="group px-5 py-2">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 font-extrabold text-navy">
                {q}
                <Icon name="chevron-down" className="size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-3">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="advice" aria-labelledby="advice-heading" className="mt-10 scroll-mt-20">
        <p className={eyebrow}>Pet advice</p>
        <h2 id="advice-heading" className="font-serif text-2xl font-bold">
          Not an emergency? We can still help
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {ADVICE.map(([title, body]) => (
            <li key={title} className="rounded-3xl border border-line bg-paper p-4">
              <h3 className="font-extrabold text-navy">{title}</h3>
              <p className="mt-1 text-[15px]">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Advice articles would come from the CMS in the real build.</p>
        <Link href="/get-help/report" className={`${btn.secondary} mt-5`}>
          Report a non-urgent concern online
        </Link>
      </section>
    </div>
  );
}
