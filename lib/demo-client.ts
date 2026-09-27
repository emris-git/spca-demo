"use client";

import { DEMO_COOKIE, encodeLocation, type DemoLocation } from "./demo-shared";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function setCookie(name: string, value: string, maxAge = THIRTY_DAYS) {
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
}

export function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function readCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function saveLocation(loc: DemoLocation) {
  setCookie(DEMO_COOKIE.loc, encodeLocation(loc));
}

export function addToGivenTotal(amount: number) {
  const current = Number(readCookie(DEMO_COOKIE.given)) || 0;
  setCookie(DEMO_COOKIE.given, String(Math.min(current + amount, 1_000_000)));
}
