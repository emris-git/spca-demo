import type { CalendarEvent } from "@/lib/services/events";
import { EventCard } from "./EventCard";

/** Horizontal, swipeable strip of upcoming events on phones; a grid on desktop. */
export function WhatsOnStrip({ events, now }: { events: CalendarEvent[]; now: Date }) {
  return (
    <ul className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6 lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-4 lg:overflow-visible">
      {events.slice(0, 8).map((e, i) => (
        <li key={e.id} className={`w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-auto ${i >= 4 ? "lg:hidden" : ""}`}>
          <EventCard event={e} now={now} compact />
        </li>
      ))}
    </ul>
  );
}
