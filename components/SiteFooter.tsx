import Link from "next/link";
import { container } from "@/lib/ui";
import { DISCLAIMER } from "./ConceptBanner";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="on-dark mt-16 bg-navy text-mist">
      <div className={`${container} py-10`}>
        <div className="rounded-2xl border border-orange/60 bg-navy-2 p-4 text-cream">
          <p className="font-extrabold text-orange">This is not the SPCA website.</p>
          <p className="mt-1 text-sm">{DISCLAIMER}</p>
          <p className="mt-1 text-sm">
            Animals, people, phone numbers, events and figures are invented or mocked. Photos are openly licensed stock
            images from Unsplash.
          </p>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <Wordmark tone="light" />
            <p className="mt-3 text-sm">
              A working prototype of ideas from “Replatforming spca.nz — an outside-in view”.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-bold text-cream">
              <li><Link className="hover:underline" href="/adopt">Adopt</Link></li>
              <li><Link className="hover:underline" href="/give">Give</Link></li>
              <li><Link className="hover:underline" href="/get-help">Get help</Link></li>
              <li><Link className="hover:underline" href="/get-involved">Get involved</Link></li>
              <li><Link className="hover:underline" href="/events">What&apos;s on</Link></li>
              <li><Link className="hover:underline" href="/give/gifts-in-wills">Gifts in Wills</Link></li>
              <li><Link className="hover:underline" href="/adopt/ready">Ready to adopt?</Link></li>
              <li><Link className="hover:underline" href="/about-this-demo">About this demo</Link></li>
            </ul>
          </nav>
          <p className="text-sm">
            Built with Next.js as part of a job application.{" "}
            <Link href="/about-this-demo#credits" className="font-bold text-cream underline">
              Photo credits and how it works
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
