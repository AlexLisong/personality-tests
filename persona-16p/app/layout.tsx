import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import LangToggle from "@/components/LangToggle";
import ThemeToggle from "@/components/ThemeToggle";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "TypeQuest — Discover Your Personality Type",
  description: "A beautiful personality test inspired by 16personalities. Discover who you really are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="classic" className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        <ThemeProvider>
          <I18nProvider>
            <LangToggle />
            <ThemeToggle />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
