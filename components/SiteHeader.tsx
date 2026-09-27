import Link from "next/link";
import { btn, container } from "@/lib/ui";
import { LocationChip } from "./LocationChip";
import { MobileMenu } from "./MobileMenu";
import { Wordmark } from "./Wordmark";

export const NAV = [
  { href: "/adopt", label: "Adopt" },
  { href: "/give", label: "Give" },
  { href: "/get-help", label: "Get help" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/events", label: "What's on" },
];

export function SiteHeader({ centreId, centreShort }: { centreId: string | null; centreShort: string | null }) {
  return (
    <header className="border-b border-line bg-cream">
      <div className={`${container} flex h-16 items-center gap-3`}>
        <Link href="/" className="-ml-1 rounded-lg px-1 py-2" aria-label="SPCA concept demo — home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="ml-6 hidden lg:block">
          <ul className="flex gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-full px-3 py-2 font-bold text-navy hover:bg-sand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocationChip centreId={centreId} centreShort={centreShort} />
          <Link href="/give" className={`${btn.accent} hidden! min-h-11 px-4 sm:inline-flex!`}>
            Donate
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
