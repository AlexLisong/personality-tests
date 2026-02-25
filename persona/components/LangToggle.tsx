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
      className="fixed top-4 right-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface border border-border text-sm font-semibold cursor-pointer hover:bg-surface-hover transition-colors"
    >
      <span className={lang === "en" ? "text-primary" : "text-text-dim"}>EN</span>
      <span className="text-text-dim/40">/</span>
      <span className={lang === "zh" ? "text-primary" : "text-text-dim"}>中文</span>
    </motion.button>
  );
}
