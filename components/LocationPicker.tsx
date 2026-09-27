"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveLocation } from "@/lib/demo-client";
import { Analytics } from "@/lib/services/analytics";
import { LocationService } from "@/lib/services/location";
import { btn } from "@/lib/ui";
import { Icon } from "./Icon";

/** "Use my location" with a manual centre picker as the fallback. Saves to a cookie and re-renders. */
export function LocationPicker({
  currentId,
  onDone,
  compact = false,
  tone = "light",
}: {
  currentId: string | null;
  onDone?: () => void;
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const centres = LocationService.centres();

  const apply = (centreId: string, lat: number, lng: number, source: "gps" | "manual") => {
    saveLocation({ centreId, lat, lng, source });
    Analytics.track("location_set", { centre: centreId, source });
    startTransition(() => router.refresh());
    onDone?.();
  };

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("Your browser can't share a location. Pick a centre instead.");
      return;
    }
    setStatus("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const nearest = LocationService.nearestCentre({ lat, lng });
        setStatus(`Nearest centre: ${nearest.name}`);
        apply(nearest.id, lat, lng, "gps");
      },
      () => setStatus("We couldn't get your location. Pick a centre instead."),
      { timeout: 8000, maximumAge: 600_000 },
    );
  };

  const dark = tone === "dark";
  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <button type="button" onClick={locate} className={`${dark ? btn.accent : btn.primary} w-full`} disabled={pending}>
        <Icon name="locate" />
        Use my location
      </button>
      <div>
        <label htmlFor="centre-picker" className={`mb-1 block text-sm font-bold ${dark ? "text-cream" : "text-navy"}`}>
          Or choose a centre
        </label>
        <select
          id="centre-picker"
          value={currentId ?? ""}
          onChange={(e) => {
            const c = LocationService.getCentre(e.target.value);
            if (c) apply(c.id, c.lat, c.lng, "manual");
          }}
          className="min-h-12 w-full rounded-xl border-2 border-line bg-white px-3 text-[16px] text-navy"
        >
          <option value="" disabled>
            Select a centre…
          </option>
          {centres.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.area}
            </option>
          ))}
        </select>
      </div>
      <p aria-live="polite" className={`min-h-5 text-sm ${dark ? "text-mist" : "text-muted"}`}>
        {pending ? "Updating…" : status}
      </p>
    </div>
  );
}
