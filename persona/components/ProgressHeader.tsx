"use client";

import { motion, AnimatePresence } from "framer-motion";
import { dimensionMeta, type Dimension } from "@/data/questions";
import { useLang } from "@/lib/i18n";

interface ProgressHeaderProps {
  current: number;
  total: number;
  xp: number;
  dimension?: Dimension;
  showXpGain?: boolean;
}

export default function ProgressHeader({ current, total, xp, dimension, showXpGain }: ProgressHeaderProps) {
  const { t } = useLang();
  const pct = Math.min((current / total) * 100, 100);
  const meta = dimension ? dimensionMeta[dimension] : null;

  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="flex items-center justify-between mb-3">
        {meta ? (
          <motion.div
            key={dimension}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm"
          >
            <span>{meta.icon}</span>
            <span className="font-semibold" style={{ color: meta.color }}>{t(meta.label, meta.labelZh)}</span>
          </motion.div>
        ) : <div />}

        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-sm">
          <span className="text-primary font-bold">{xp}</span>
          <span className="text-text-dim font-medium">XP</span>
          <AnimatePresence>
            {showXpGain && (
              <motion.span
                key="xp-gain"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute -top-1 right-0 text-primary font-bold text-sm pointer-events-none"
              >
                +10
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative h-3 rounded-full bg-surface overflow-hidden border border-border">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #a3e635, #4ade80)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        />
        <div className="absolute inset-0 shimmer rounded-full" />
      </div>

      <div className="flex justify-between mt-1.5 text-xs text-text-dim font-medium">
        <span>{t(`${current} / ${total} done`, `已完成 ${current} / ${total}`)}</span>
        <span>{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
