import type { Metadata } from "next";
import { CallButton } from "@/components/CallButton";
import { BequestPackForm } from "@/components/give/BequestPackForm";
import { Icon, type IconName } from "@/components/Icon";
import { Photo } from "@/components/Photo";
import { MockNotice } from "@/components/MockNotice";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Gifts in Wills" };

const BENEFITS: { icon: IconName; title: string; body: string }[] = [
  { icon: "paw", title: "Name an SPCA animal", body: "Choose a name for an animal in our care, and we'll send you their story." },
  { icon: "home", title: "Exclusive centre visits", body: "Behind-the-scenes visits to see the work your gift will carry on." },
  { icon: "heart", title: "Pet Legacy Plan", body: "Peace of mind that your own pets will be cared for and rehomed if they outlive you." },
];

const FAQ = [
  ["Do I need a lawyer?", "We recommend one, but adding a gift can be a small change to an existing Will. The pack includes suggested wording."],
  ["Does the size of the gift matter?", "No. Gifts of every size — a set amount, a share of what's left, or a specific item — add up to a big part of what SPCA can do."],
  ["Can I choose what it's used for?", "Yes. You can leave it for general use, a local centre or a type of work. Talk to us first so we can make sure your wishes can be met."],
  ["Do I have to tell you?", "Not at all. But if you do, we can thank you now — and welcome you to Giving Hearts."],
];

export default function WillsPage() {
  return (
    <div className="pb-4">
      <section className="bg-navy text-cream on-dark">
        <div className={`${container} grid gap-6 py-10 md:grid-cols-2 md:items-center`}>
          <div>
            <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-orange">Gifts in Wills</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-cream sm:text-5xl">A kindness that outlives us all.</h1>
            <p className="mt-4 text-lg text-mist">
              Many of the animals in our care today are here thanks to someone who remembered SPCA in their Will. The first
              step is small, free and has no strings attached.
            </p>
            <a href="#pack" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-orange px-5 font-extrabold text-navy">
              Get the free information pack <Icon name="arrow-right" />
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Photo photo="hero-lap-cat" sizes="(min-width: 768px) 50vw, 100vw" priority />
          </div>
        </div>
      </section>

      <div className={container}>
        <section aria-labelledby="hearts" className="mt-10">
          <p className={eyebrow}>Giving Hearts</p>
          <h2 id="hearts" className="font-serif text-2xl font-bold sm:text-3xl">
            What you get back, starting now
          </h2>
          <p className="mt-2 max-w-2xl">
            Tell us you&apos;ve included SPCA in your Will and you join Giving Hearts — our way of saying thank you while
            you&apos;re here to hear it.
          </p>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <li key={b.title} className="rounded-3xl border border-line bg-paper p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-orange-soft text-rust">
                  <Icon name={b.icon} className="size-6" />
                </span>
                <h3 className="mt-3 font-serif text-lg font-bold">{b.title}</h3>
                <p className="mt-1 text-[15px]">{b.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section id="pack" aria-labelledby="pack-heading" className="scroll-mt-20 rounded-3xl border-2 border-blue bg-paper p-5 sm:p-6">
            <p className={eyebrow}>Your one next step</p>
            <h2 id="pack-heading" className="font-serif text-2xl font-bold">
              Request your free information pack
            </h2>
            <p className="mt-1 mb-5">Suggested wording for your Will, how gifts are used, and the Pet Legacy Plan.</p>
            <BequestPackForm />
          </section>

          <aside aria-labelledby="contact" className="h-fit rounded-3xl bg-sand p-5">
            <p className={eyebrow}>Talk to a real person</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-navy font-serif text-xl font-bold text-orange" aria-hidden>
                ST
              </span>
              <div>
                <h2 id="contact" className="font-serif text-lg font-bold">Sam Taylor</h2>
                <p className="text-sm">Gifts in Wills Manager</p>
                <p className="text-xs font-bold text-rust">Placeholder person for the demo</p>
              </div>
            </div>
            <p className="mt-4 text-[15px]">
              “Happy to answer any question, big or small — even if you&apos;re not sure yet. No pressure, ever.”
            </p>
            <div className="mt-4 grid gap-2">
              <CallButton who="the Gifts in Wills team (placeholder contact)" number="0800 000 000" label="Call Sam" variant="dark" />
              <MockNotice label={<><Icon name="mail" /> Email Sam</>} title="Email — demo" track="bequest_email_tap">
                <p>On the live site this would open an email to the Gifts in Wills team. No email is sent from the demo.</p>
              </MockNotice>
            </div>
          </aside>
        </div>

        <section aria-labelledby="faq" className="mt-10 max-w-3xl">
          <h2 id="faq" className="font-serif text-2xl font-bold">
            Good questions
          </h2>
          <div className="mt-4 divide-y divide-line rounded-3xl border border-line bg-paper">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group px-5 py-2">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 font-extrabold text-navy">
                  {q}
                  <Icon name="chevron-down" className="size-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-3">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
