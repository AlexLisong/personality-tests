"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";

export default function ThemeToggle() {
  const { theme, setTheme, options } = useTheme();
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-5 z-50 flex w-[min(20rem,calc(100vw-2.5rem))] flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white/95 shadow-[var(--shadow-md)] p-3 backdrop-blur-sm"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {t("Theme", "配色")}
      </p>
      <div className="flex gap-2">
        {options.map((option) => {
          const isActive = option.id === theme;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(option.id)}
              className={`flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-left transition-all ${
                isActive
                  ? "border-transparent bg-[var(--color-bg-soft)] shadow-[var(--shadow-sm)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-light)]"
              }`}
            >
              <p className="text-xs font-semibold text-[var(--color-text)]">
                {t(option.label, option.labelZh)}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-2">
                {t(option.description, option.descriptionZh)}
              </p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
