import "server-only";
import { cookies } from "next/headers";
import { DEMO_COOKIE, decodeLocation, type DemoLocation, type TimeMode } from "./demo-shared";
import { fromYmd, isYmd, nzNow, toYmd } from "./time";

export type DemoState = {
  /** NZ wall-clock "now", after any simulated date or time. */
  now: Date;
  realToday: string;
  simulatedDate: string | null;
  timeMode: TimeMode;
  location: DemoLocation | null;
  /** Total of mock gifts made in this browser, added to campaign progress. */
  given: number;
};

export async function getDemoState(): Promise<DemoState> {
  const jar = await cookies();
  const real = nzNow();
  const dateValue = jar.get(DEMO_COOKIE.date)?.value;
  const timeValue = jar.get(DEMO_COOKIE.time)?.value;
  const simulatedDate = isYmd(dateValue) ? dateValue : null;
  const timeMode: TimeMode = timeValue === "day" || timeValue === "evening" ? timeValue : "real";

  let minutes = real.getUTCHours() * 60 + real.getUTCMinutes();
  if (timeMode === "day") minutes = 11 * 60;
  if (timeMode === "evening") minutes = 21 * 60 + 30;
  const base = simulatedDate ? fromYmd(simulatedDate) : fromYmd(toYmd(real));
  const now = new Date(base.getTime() + minutes * 60_000);

  const given = Math.max(0, Math.min(Number(jar.get(DEMO_COOKIE.given)?.value) || 0, 1_000_000));

  return {
    now,
    realToday: toYmd(real),
    simulatedDate,
    timeMode,
    location: decodeLocation(jar.get(DEMO_COOKIE.loc)?.value),
    given,
  };
}
