"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useLang();
  const pct = Math.round((current / total) * 100);
  const hearts = Array.from({ length: total }, (_, i) => i < current);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Numeric label */}
      <div className="flex justify-between items-center mb-2 text-sm font-semibold text-purple-400">
        <span>{t(`Question ${Math.min(current + 1, total)} / ${total}`, `问题 ${Math.min(current + 1, total)} / ${total}`)}</span>
        <span>{pct}%</span>
      </div>

      {/* Bar */}
      <div className="h-4 rounded-full bg-purple-100 overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />
      </div>

      {/* Heart dots */}
      <div className="flex justify-center gap-1 mt-2 flex-wrap">
        {hearts.map((filled, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: filled ? 1 : 0.6, opacity: filled ? 1 : 0.3 }}
            transition={{ delay: i * 0.02, type: "spring" }}
            className="text-xs"
          >
            {filled ? "💜" : "🤍"}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
