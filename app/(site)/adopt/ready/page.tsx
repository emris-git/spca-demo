import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { btn, container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Are you ready to adopt?" };

const SECTIONS: { icon: IconName; title: string; body: string; ask: string[] }[] = [
  {
    icon: "clock",
    title: "Time",
    body: "Animals need company, exercise and training every day — for the next 10 to 20 years.",
    ask: ["Who looks after them when you're at work or away?", "Can you commit to training in the first months?"],
  },
  {
    icon: "gift",
    title: "Money",
    body: "Beyond the adoption fee there's food, vet visits, flea and worm treatments, insurance and the surprises.",
    ask: ["Could you cover an unexpected vet bill?", "Have you looked at pet insurance?"],
  },
  {
    icon: "home",
    title: "Home",
    body: "Space, fencing and a safe spot to retreat to matter more than a big section.",
    ask: ["If you rent, does your landlord agree?", "Is your fence secure for a dog, or your home safe for a cat?"],
  },
  {
    icon: "users",
    title: "Everyone on board",
    body: "The whole household should want this — including any pets you already have.",
    ask: ["Has everyone met the animal?", "How will you introduce them to your other pets?"],
  },
  {
    icon: "bolt",
    title: "The right match",
    body: "Energy and experience matter more than looks. A mellow senior can be a better first pet than a puppy.",
    ask: ["Does their energy fit your week?", "Do they need more experience than you have?"],
  },
];

export default function ReadyPage() {
  return (
    <div className={`${container} max-w-3xl pt-8`}>
      <p className={eyebrow}>Adopt · the full guide</p>
      <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">Are you ready to adopt?</h1>
      <p className="mt-2 text-lg">
        Five honest questions. If you can answer them, you&apos;re ready — and our team is here for the rest.
      </p>
      <ol className="mt-8 space-y-4">
        {SECTIONS.map((s, i) => (
          <li key={s.title} className="rounded-3xl border border-line bg-paper p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-sky text-blue">
                <Icon name={s.icon} />
              </span>
              <h2 className="font-serif text-xl font-bold">
                {i + 1}. {s.title}
              </h2>
            </div>
            <p className="mt-3">{s.body}</p>
            <ul className="mt-3 space-y-1.5">
              {s.ask.map((a) => (
                <li key={a} className="flex gap-2 text-[15px]">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-green" />
                  {a}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/adopt" className={btn.primary}>
          Meet the animals
        </Link>
        <Link href="/adopt/match" className={btn.secondary}>
          Take the match quiz
        </Link>
      </div>
      <p className="mt-6 text-sm text-muted">
        Guide written for this concept demo; the live site&apos;s full guide would sit here, owned by the adoptions team.
      </p>
    </div>
  );
}
