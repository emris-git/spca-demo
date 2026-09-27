"use client";

import { useEffect } from "react";
import { Analytics } from "@/lib/services/analytics";

/** Records a page-level analytics event once, for the mock GA4 log in the Demo panel. */
export function TrackView({ name, props = {} }: { name: string; props?: Record<string, string | number | boolean> }) {
  const key = JSON.stringify(props);
  useEffect(() => {
    Analytics.track(name, JSON.parse(key));
  }, [name, key]);
  return null;
}
