import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, getDemoPassword, verifySessionToken } from "@/lib/auth";

// Every page and every image needs a valid session cookie; without one the visitor is sent
// to /password. Only the password page itself, the login endpoint, build assets
// (JS, CSS, fonts under /_next/static), robots.txt and the favicon are public.
const PUBLIC_PATHS = new Set(["/password", "/api/auth"]);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return withNoIndex(NextResponse.next());

  const ok = await verifySessionToken(request.cookies.get(AUTH_COOKIE)?.value, getDemoPassword());
  if (ok) return withNoIndex(NextResponse.next());

  const url = request.nextUrl.clone();
  url.pathname = "/password";
  url.search = "";
  const isPage = !pathname.includes(".") && !pathname.startsWith("/api/");
  if (isPage && pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
  return withNoIndex(NextResponse.redirect(url, 307));
}

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|robots.txt|favicon.ico|icon.svg).*)"],
};
