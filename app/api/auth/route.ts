import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, SESSION_SECONDS, createSessionToken, getDemoPassword, safeEqual, safeNextPath } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const attempt = String(form.get("password") ?? "");
  const next = safeNextPath(form.get("next"));
  const password = getDemoPassword();

  if (!password || !(await safeEqual(attempt, password))) {
    // A short pause makes guessing slow without bothering real visitors.
    await new Promise((r) => setTimeout(r, 700));
    const url = new URL("/password", request.url);
    url.searchParams.set("error", password ? "1" : "config");
    if (next !== "/") url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(AUTH_COOKIE, await createSessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}
