import { ConceptBanner } from "@/components/ConceptBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDemoState } from "@/lib/demo-server";
import { EventsService } from "@/lib/services/events";
import { LocationService } from "@/lib/services/location";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const demo = await getDemoState();
  const centre = LocationService.getCentre(demo.location?.centreId);
  const campaign = EventsService.campaign(demo.now);
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-navy px-4 py-2 font-bold text-cream focus:not-sr-only focus:fixed focus:left-3 focus:top-12"
      >
        Skip to content
      </a>
      <ConceptBanner
        realToday={demo.realToday}
        simulatedDate={demo.simulatedDate}
        timeMode={demo.timeMode}
        centreId={centre?.id ?? null}
        campaignLabel={campaign.label}
      />
      <SiteHeader centreId={centre?.id ?? null} centreShort={centre ? centre.name.replace(" Centre", "") : null} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
