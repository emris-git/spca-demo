import { CAMPAIGNS, type Campaign } from "@/lib/mocks/campaigns";
import { eventsForYear, type SpcaEvent } from "@/lib/mocks/events";
import { fromYmd, toYmd } from "@/lib/time";

// EventsService — the year calendar and "campaign mode".
// Mock: events generated per year in code; campaign windows hard-coded.
// Real: events and campaigns as content types in a headless CMS (start/end dates,
// centre, CTA), with peer-to-peer campaigns (Cupcake Day, fundraisers) pulled from Raisely.

export type CalendarEvent = SpcaEvent & { startDate: Date; endDate: Date };

function hydrate(e: SpcaEvent): CalendarEvent {
  return { ...e, startDate: fromYmd(e.start), endDate: fromYmd(e.end) };
}

function inWindow(now: Date, from: [number, number], to: [number, number]) {
  const md = (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
  const a = from[0] * 100 + from[1];
  const b = to[0] * 100 + to[1];
  return a <= b ? md >= a && md <= b : md >= a || md <= b;
}

export const EventsService = {
  /** Every event that touches the given year, including ones that started the year before. */
  forYear(year: number, centreId?: string | null): CalendarEvent[] {
    return [...eventsForYear(year - 1), ...eventsForYear(year)]
      .filter((e) => e.start.slice(0, 4) === String(year) || e.end.slice(0, 4) === String(year))
      .filter((e) => !centreId || e.centreId === null || e.centreId === centreId)
      .map(hydrate)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  },
  upcoming(now: Date, centreId: string | null, limit = 6): CalendarEvent[] {
    const today = toYmd(now);
    const y = now.getUTCFullYear();
    const all = [...EventsService.forYear(y, centreId), ...EventsService.forYear(y + 1, centreId)];
    return all
      .filter((e, i) => all.findIndex((x) => x.id === e.id) === i)
      .filter((e) => e.end >= today)
      .filter((e) => !centreId || e.centreId === centreId || e.centreId === null)
      .slice(0, limit);
  },
  campaign(now: Date): Campaign {
    return (
      CAMPAIGNS.find((c) => c.windows.some((w) => inWindow(now, w.from, w.to))) ??
      CAMPAIGNS.find((c) => c.id === "everyday")!
    );
  },
  /** Mock progress: a deterministic curve through the campaign window, plus gifts made in this browser. */
  appealProgress(now: Date, campaign: Campaign, givenHere: number) {
    const w = campaign.windows[0];
    let share = 0.58;
    if (w) {
      const y = now.getUTCFullYear();
      let start = Date.UTC(y, w.from[0] - 1, w.from[1]);
      let end = Date.UTC(y, w.to[0] - 1, w.to[1]);
      if (end < start) {
        if (now.getTime() < end + 86_400_000) start = Date.UTC(y - 1, w.from[0] - 1, w.from[1]);
        else end = Date.UTC(y + 1, w.to[0] - 1, w.to[1]);
      }
      const t = Math.min(1, Math.max(0, (now.getTime() - start) / (end - start + 86_400_000)));
      share = 0.18 + 0.7 * Math.sqrt(t);
    }
    const base = Math.round((campaign.appeal.goal * share) / 10) * 10;
    const supporters = Math.round(base / 57);
    return { base, raised: base + givenHere, goal: campaign.appeal.goal, supporters };
  },
};
