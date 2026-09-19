import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Versicherungsplattform — Heute sicher. Morgen größer.",
  description: "Konzeptdemo für eine digitale Plattform rund um Versicherungen, Vorsorge und Vermögensplanung.",
};

export const viewport: Viewport = {
  themeColor: "#f4f6f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
