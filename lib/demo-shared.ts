// Demo state lives in plain (non-secret) cookies so the server can render the right
// campaign, centre and date on the first paint. Shared by server and client code.

export const DEMO_COOKIE = {
  date: "demo_date", // YYYY-MM-DD — simulated date
  time: "demo_time", // "day" | "evening" — simulated time of day
  loc: "demo_loc", // centreId~lat~lng~source
  given: "demo_given", // running total of mock gifts this session, for the progress bar
} as const;

export type TimeMode = "real" | "day" | "evening";
export type LocationSource = "gps" | "manual";

export type DemoLocation = { centreId: string; lat: number; lng: number; source: LocationSource };

export function encodeLocation(loc: DemoLocation) {
  return [loc.centreId, loc.lat.toFixed(4), loc.lng.toFixed(4), loc.source].join("~");
}

export function decodeLocation(value: string | undefined): DemoLocation | null {
  if (!value) return null;
  const [centreId, lat, lng, source] = value.split("~");
  const la = Number(lat);
  const ln = Number(lng);
  if (!centreId || !Number.isFinite(la) || !Number.isFinite(ln)) return null;
  return { centreId, lat: la, lng: ln, source: source === "gps" ? "gps" : "manual" };
}
