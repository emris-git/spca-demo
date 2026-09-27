import type { Metadata } from "next";
import { DISCLAIMER } from "@/components/ConceptBanner";
import { Icon } from "@/components/Icon";
import { Wordmark } from "@/components/Wordmark";
import { safeNextPath } from "@/lib/auth";
import { btn } from "@/lib/ui";

export const metadata: Metadata = { title: "Private demo" };

export default async function PasswordPage({ searchParams }: PageProps<"/password">) {
  const params = await searchParams;
  const error = params.error;
  const next = safeNextPath(typeof params.next === "string" ? params.next : "/");
  const signedOut = params.signedout === "1";

  return (
    <main className="on-dark flex min-h-dvh flex-col bg-navy px-4 text-cream">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <Wordmark tone="light" />
        <h1 className="mt-8 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
          Hello! This one&apos;s behind a door.
        </h1>
        <p className="mt-4 text-lg text-mist">
          This concept demo is shared privately with SPCA&apos;s hiring team — the password is in my cover letter.
        </p>

        <form action="/api/auth" method="post" className="mt-8 rounded-3xl bg-navy-2 p-5">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="password" className="block font-extrabold text-cream">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            autoFocus
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "password-error" : undefined}
            className="mt-2 min-h-12 w-full rounded-xl border-2 border-mist/40 bg-cream px-3 text-[16px] text-navy"
          />
          {error ? (
            <p id="password-error" role="alert" className="mt-3 flex items-start gap-2 text-sm font-bold text-orange">
              <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
              {error === "config"
                ? "The demo password hasn't been set up on this server yet."
                : "That's not quite it. Check the cover letter and try again."}
            </p>
          ) : null}
          {signedOut ? (
            <p role="status" className="mt-3 text-sm text-mist">
              You&apos;re signed out. Ka kite anō!
            </p>
          ) : null}
          <button type="submit" className={`${btn.accent} mt-4 w-full`}>
            Let me in
            <Icon name="arrow-right" />
          </button>
        </form>

        <p className="mt-8 rounded-2xl border border-orange/50 p-4 text-sm text-mist">{DISCLAIMER}</p>
      </div>
    </main>
  );
}
