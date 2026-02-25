import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Persona Quest - Discover Your Personality!",
  description: "A fun, kawaii personality test to discover your true self!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <I18nProvider>
          <LangToggle />
          {/* Floating decorations */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {["🌸", "✨", "💫", "🌙", "⭐", "🦋"].map((emoji, i) => (
              <span
                key={i}
                className="floating-particle absolute text-2xl opacity-40"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${5 + (i * 17) % 80}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${5 + i}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
