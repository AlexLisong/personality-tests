"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, toggle } = useLang();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={toggle}
      className="fixed top-5 right-5 z-50 flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-pill)] bg-white border border-[var(--color-border)] text-sm font-medium shadow-[var(--shadow-sm)] cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow"
    >
      <span className={lang === "en" ? "text-[var(--color-purple)] font-semibold" : "text-[var(--color-text-muted)]"}>EN</span>
      <span className="text-[var(--color-border)]">|</span>
      <span className={lang === "zh" ? "text-[var(--color-purple)] font-semibold" : "text-[var(--color-text-muted)]"}>中文</span>
    </motion.button>
  );
}
