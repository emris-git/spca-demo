"use client";

// Analytics — the measurement plan, made visible.
// Mock: events are kept in memory and shown in the Demo panel; nothing is sent.
// Real: GA4 via Google Tag Manager with a documented event schema (these names), consent
// mode, and server-side tagging for donation and application conversions.

export type AnalyticsEvent = { name: string; props: Record<string, string | number | boolean>; at: number };

const listeners = new Set<() => void>();
let log: AnalyticsEvent[] = [];

export const Analytics = {
  track(name: string, props: AnalyticsEvent["props"] = {}) {
    log = [{ name, props, at: Date.now() }, ...log].slice(0, 20);
    listeners.forEach((l) => l());
  },
  events() {
    return log;
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
