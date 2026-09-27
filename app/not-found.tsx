import Link from "next/link";
import { DISCLAIMER } from "@/components/ConceptBanner";
import { Wordmark } from "@/components/Wordmark";
import { btn } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4 py-16 text-center">
      <div className="mx-auto">
        <Wordmark />
      </div>
      <p className="mt-10 font-serif text-6xl font-bold text-orange">404</p>
      <h1 className="mt-3 font-serif text-3xl font-bold">This page has gone walkies</h1>
      <p className="mt-2 text-lg">It might have been adopted.</p>
      <Link href="/" className={`${btn.primary} mx-auto mt-6`}>
        Back home
      </Link>
      <p className="mt-10 text-sm text-muted">{DISCLAIMER}</p>
    </main>
  );
}
