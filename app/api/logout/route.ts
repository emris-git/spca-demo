import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/password?signedout=1", request.url), 303);
  response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  for (const name of ["demo_date", "demo_time", "demo_loc", "demo_given"]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}
