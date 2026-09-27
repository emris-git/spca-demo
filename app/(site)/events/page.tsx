import type { Metadata } from "next";
import Link from "next/link";
import { AutoSubmitSelect } from "@/components/AutoSubmitSelect";
import { EventCard } from "@/components/EventCard";
import { getDemoState } from "@/lib/demo-server";
import { KIND_LABEL, type EventKind } from "@/lib/mocks/events";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { btn, container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "What's on" };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const demo = await getDemoState();
  const params = await searchParams;
  const nowYear = demo.now.getUTCFullYear();
  const yearParam = Number(params.year);
  const year = [nowYear, nowYear + 1].includes(yearParam) ? yearParam : nowYear;
  const centreParam = typeof params.centre === "string" ? params.centre : "";
  const centreId = centreParam === "mine" ? demo.location?.centreId ?? "" : centreParam;
  const centre = LocationService.getCentre(centreId);
  const kind = typeof params.kind === "string" && params.kind in KIND_LABEL ? (params.kind as EventKind) : null;

  const events = EventsService.forYear(year, centre?.id ?? null).filter((e) => !kind || e.kind === kind);
  const byMonth = MONTHS.map((_, m) =>
    events.filter((e) => {
      const start = e.startDate.getUTCFullYear() < year ? 0 : e.startDate.getUTCMonth();
      const end = e.endDate.getUTCFullYear() > year ? 11 : e.endDate.getUTCMonth();
      return m >= start && m <= end;
    }),
  );
  const currentMonth = demo.now.getUTCFullYear() === year ? demo.now.getUTCMonth() : -1;
  const myCentre = LocationService.getCentre(demo.location?.centreId);

  const link = (patch: Record<string, string | number | null>) => {
    const q = new URLSearchParams();
    const merged = { year, centre: centreParam || null, kind, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== null && v !== "" && !(k === "year" && v === nowYear)) q.set(k, String(v));
    });
    const s = q.toString();
    return s ? `/events?${s}` : "/events";
  };

  return (
    <div className={`${container} pt-8`}>
      <p className={eyebrow}>What&apos;s on</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">The year at SPCA</h1>
      <p className="mt-2 max-w-2xl text-lg">
        Campaigns, open days and ways to help — nationally and at your centre. Every event has one clear next step.
      </p>

      {/* Filters */}
      <form method="get" action="/events" className="mt-6 grid gap-3 rounded-3xl border border-line bg-paper p-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
        <div className="flex gap-2" role="group" aria-label="Year">
          {[nowYear, nowYear + 1].map((y) => (
            <Link
              key={y}
              href={link({ year: y })}
              aria-current={y === year ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 font-extrabold ${y === year ? "border-navy bg-navy text-cream" : "border-line text-navy"}`}
            >
              {y}
            </Link>
          ))}
        </div>
        <input type="hidden" name="year" value={year} />
        <label className="text-sm font-bold text-navy">
          Centre
          <AutoSubmitSelect name="centre" defaultValue={centreParam} className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px]">
            <option value="">All centres + nationwide</option>
            {myCentre ? <option value="mine">My centre ({myCentre.name})</option> : null}
            {LocationService.centres().map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </AutoSubmitSelect>
        </label>
        <label className="text-sm font-bold text-navy">
          Type
          <AutoSubmitSelect name="kind" defaultValue={kind ?? ""} className="mt-1 min-h-11 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px]">
            <option value="">Everything</option>
            {Object.entries(KIND_LABEL).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </AutoSubmitSelect>
        </label>
        <noscript>
          <button type="submit" className={btn.primary}>Apply</button>
        </noscript>
      </form>

      {/* Year at a glance */}
      <nav aria-label="Months" className="mt-6">
        <ol className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {MONTHS.map((m, i) => (
            <li key={m}>
              <a
                href={`#m-${i}`}
                className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border text-sm font-extrabold ${
                  i === currentMonth ? "border-orange bg-orange-soft text-navy" : byMonth[i].length ? "border-line bg-paper text-navy" : "border-transparent bg-sand text-muted"
                }`}
              >
                {m.slice(0, 3)}
                <span className="mt-1 flex gap-0.5" aria-label={`${byMonth[i].length} events`}>
                  {byMonth[i].slice(0, 4).map((e) => (
                    <span key={e.id} className={`size-1.5 rounded-full ${e.kind === "campaign" ? "bg-rust" : "bg-blue"}`} />
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p className="mt-4 text-sm font-bold text-muted" aria-live="polite">
        {events.length} events in {year}
        {centre ? ` for ${centre.name} and nationwide` : ""}
        {kind ? ` · ${KIND_LABEL[kind]}` : ""}
      </p>

      <div className="mt-4 space-y-8">
        {MONTHS.map((m, i) => (
          <section key={m} id={`m-${i}`} aria-labelledby={`h-${i}`} className="scroll-mt-16">
            <h2 id={`h-${i}`} className="flex items-center gap-3 font-serif text-xl font-bold">
              {m} {year}
              {i === currentMonth ? <span className="rounded-full bg-orange px-2 py-0.5 font-sans text-xs font-extrabold text-navy">This month</span> : null}
            </h2>
            {byMonth[i].length ? (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byMonth[i].map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} now={demo.now} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">Nothing scheduled yet{centre ? ` at ${centre.name}` : ""}.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
