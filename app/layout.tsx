import type { Metadata, Viewport } from "next";
import { Domine, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const domine = Domine({ subsets: ["latin"], variable: "--font-domine", display: "swap", weight: ["600", "700"] });

export const metadata: Metadata = {
  title: { default: "SPCA website concept — demo", template: "%s · SPCA concept demo" },
  description:
    "An independent concept demo by Mikhail Gorbunov for the spca.nz replatform. Not affiliated with or endorsed by SPCA. No real payments or data.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#13233a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${nunito.variable} ${domine.variable}`}>
      <body className="min-h-dvh font-sans text-[16px] leading-relaxed antialiased">{children}</body>
    </html>
  );
}
