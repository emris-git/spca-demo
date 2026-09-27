"use client";

import Link from "next/link";
import { useState } from "react";
import { btn } from "@/lib/ui";
import { Icon, type IconName } from "./Icon";
import { Sheet } from "./Sheet";

const ITEMS: { href: string; label: string; hint: string; icon: IconName }[] = [
  { href: "/adopt", label: "Adopt", hint: "Meet animals near you", icon: "paw" },
  { href: "/give", label: "Give", hint: "See exactly what your gift does", icon: "gift" },
  { href: "/get-help", label: "Get help", hint: "Report cruelty, get advice", icon: "alert" },
  { href: "/get-involved", label: "Get involved", hint: "Volunteer, foster, fundraise", icon: "users" },
  { href: "/events", label: "What's on", hint: "Events and campaigns near you", icon: "calendar" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full border border-line bg-paper text-navy"
        aria-label="Open menu"
        aria-haspopup="dialog"
      >
        <Icon name="menu" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="What brings you here?">
        <nav aria-label="Main">
          <ul className="space-y-2">
            {ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-cream px-4 py-3 hover:border-navy/40"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-navy text-orange">
                    <Icon name={item.icon} />
                  </span>
                  <span>
                    <span className="block font-extrabold text-navy">{item.label}</span>
                    <span className="block text-sm text-muted">{item.hint}</span>
                  </span>
                  <Icon name="chevron-right" className="ml-auto size-5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/give" onClick={() => setOpen(false)} className={`${btn.accent} mt-4 w-full`}>
          Donate
        </Link>
      </Sheet>
    </div>
  );
}
