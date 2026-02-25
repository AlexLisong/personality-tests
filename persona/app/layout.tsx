import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Persona — Discover Your Personality",
  description: "A beautifully crafted personality quest. Find out who you really are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased relative z-10">
        <I18nProvider>
          <LangToggle />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
