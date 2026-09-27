import type { Metadata } from "next";
import Link from "next/link";
import { ReportForm } from "@/components/help/ReportForm";
import { Icon } from "@/components/Icon";
import { getDemoState } from "@/lib/demo-server";
import { LocationService } from "@/lib/services/location";
import { container, eyebrow } from "@/lib/ui";

export const metadata: Metadata = { title: "Report a concern" };

export default async function ReportPage() {
  const demo = await getDemoState();
  const centre = LocationService.getCentre(demo.location?.centreId);
  return (
    <div className={`${container} max-w-2xl pt-6`}>
      <Link href="/get-help" className="inline-flex min-h-11 items-center gap-1 font-extrabold text-blue">
        <Icon name="chevron-left" className="size-4" /> Get help
      </Link>
      <p className={`${eyebrow} mt-3`}>Not urgent</p>
      <h1 className="mt-1 font-serif text-3xl font-bold">Tell us what you&apos;ve seen</h1>
      <p className="mt-2 text-lg">About two minutes. If an animal is in danger right now, <Link href="/get-help" className="font-bold text-blue underline">call instead</Link>.</p>
      <div className="mt-6">
        <ReportForm centreName={centre?.name ?? null} />
      </div>
    </div>
  );
}
