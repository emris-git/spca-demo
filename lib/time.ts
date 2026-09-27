// Dates in the demo are "wall-clock" dates: a Date whose UTC fields hold New Zealand local
// time. Always read them with getUTC* or format them with timeZone "UTC".

const NZ = "Pacific/Auckland";

export function nzNow(): Date {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: NZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute")));
}

export const toYmd = (d: Date) => d.toISOString().slice(0, 10);

export function fromYmd(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export const isYmd = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(fromYmd(value).getTime());

export function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 86_400_000);
}

export function startOfDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function daysBetween(a: Date, b: Date) {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);
}

export function formatDate(d: Date, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("en-NZ", { timeZone: "UTC", ...options }).format(d);
}

export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}.${String(m).padStart(2, "0")}${suffix}`;
}

export const minutesOfDay = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes();
