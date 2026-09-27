import { DemoPanel } from "./DemoPanel";

export const DISCLAIMER =
  "Concept demo by Mikhail Gorbunov — not affiliated with or endorsed by SPCA. No real payments or data.";

export function ConceptBanner(props: React.ComponentProps<typeof DemoPanel>) {
  return (
    <div className="on-dark sticky top-0 z-40 bg-navy text-cream shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 sm:px-6">
        <p className="text-[12.5px] leading-snug sm:text-[13px]">
          <strong className="mr-1 rounded bg-orange px-1.5 py-px text-[11px] font-extrabold uppercase tracking-wider text-navy">
            Concept
          </strong>
          {DISCLAIMER}
        </p>
        <div className="ml-auto">
          <DemoPanel {...props} />
        </div>
      </div>
    </div>
  );
}
