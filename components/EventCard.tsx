import { KIND_LABEL } from "@/lib/mocks/events";
import type { CalendarEvent } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";
import { formatDate, toYmd } from "@/lib/time";
import { EventCta } from "./EventCta";
import { Icon } from "./Icon";

export function eventDateLabel(e: CalendarEvent) {
  if (e.start === e.end) return formatDate(e.startDate, { weekday: "short", day: "numeric", month: "short" });
  const sameMonth = e.startDate.getUTCMonth() === e.endDate.getUTCMonth();
  return sameMonth
    ? `${e.startDate.getUTCDate()}–${formatDate(e.endDate, { day: "numeric", month: "short" })}`
    : `${formatDate(e.startDate)} – ${formatDate(e.endDate)}`;
}

export function EventCard({ event, now, compact = false }: { event: CalendarEvent; now: Date; compact?: boolean }) {
  const centre = LocationService.getCentre(event.centreId);
  const today = toYmd(now);
  const live = event.start <= today && event.end >= today;
  const past = event.end < today;
  return (
    <article className={`flex h-full flex-col rounded-3xl border bg-paper p-4 ${live ? "border-orange ring-2 ring-orange/40" : "border-line"} ${past ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
        <span className="rounded-full bg-sky px-2 py-0.5 text-blue">{KIND_LABEL[event.kind]}</span>
        {live ? <span className="rounded-full bg-orange px-2 py-0.5 text-navy">On now</span> : null}
        {past ? <span className="rounded-full bg-sand px-2 py-0.5 text-muted">Finished</span> : null}
      </div>
      <h3 className="mt-2 font-serif text-lg font-bold leading-snug">{event.title}</h3>
      <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <Icon name="calendar" className="size-4 text-blue" />
          {eventDateLabel(event)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="pin" className="size-4 text-blue" />
          {centre ? centre.name : "Nationwide"}
        </span>
      </p>
      {!compact ? <p className="mt-2 text-[15px]">{event.summary}</p> : null}
      {!past ? (
        <div className="mt-auto pt-4">
          <EventCta
            eventId={event.id}
            title={event.title}
            label={event.cta.label}
            action={event.cta.action}
            href={event.cta.href}
            compact={compact}
          />
        </div>
      ) : null}
    </article>
  );
}
