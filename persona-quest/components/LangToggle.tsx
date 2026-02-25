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
      className="fixed top-4 right-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-purple-200 text-sm font-semibold shadow-sm cursor-pointer hover:bg-white/90 transition-colors"
    >
      <span className={lang === "en" ? "text-purple-500" : "text-gray-400"}>EN</span>
      <span className="text-gray-300">/</span>
      <span className={lang === "zh" ? "text-purple-500" : "text-gray-400"}>中文</span>
    </motion.button>
  );
}
