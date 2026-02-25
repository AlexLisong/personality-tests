"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Lang = "en" | "zh";

interface I18nContext {
  lang: Lang;
  toggle: () => void;
  t: (en: string, zh: string) => string;
}

const Ctx = createContext<I18nContext>({ lang: "en", toggle: () => {}, t: (en) => en });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("persona-lang") as Lang | null;
    if (saved === "en" || saved === "zh") setLang(saved);
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "zh" : "en";
      localStorage.setItem("persona-lang", next);
      return next;
    });
  }, []);

  const t = useCallback((en: string, zh: string) => (lang === "zh" ? zh : en), [lang]);

  return <Ctx.Provider value={{ lang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
