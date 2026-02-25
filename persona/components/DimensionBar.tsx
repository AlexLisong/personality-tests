"use client";

import { motion } from "framer-motion";
import type { DimensionScore } from "@/lib/scoring";
import { dimensionMeta } from "@/data/questions";
import { useLang } from "@/lib/i18n";

const labelZhMap: Record<string, [string, string]> = {
  EI: ["外向", "内向"],
  SN: ["实感", "直觉"],
  TF: ["理性", "感性"],
  JP: ["计划", "展望"],
  AT: ["坚定", "起伏"],
};

interface DimensionBarProps {
  score: DimensionScore;
  delay?: number;
}

export default function DimensionBar({ score, delay = 0 }: DimensionBarProps) {
  const { t } = useLang();
  const meta = dimensionMeta[score.dimension];
  const leftWins = score.percentage >= 50;
  const zh = labelZhMap[score.dimension] ?? ["", ""];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="bg-surface rounded-2xl p-4 border border-border"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{meta.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider text-text-dim">{t(meta.label, meta.labelZh)}</span>
      </div>

      <div className="flex justify-between text-sm font-semibold mb-2">
        <span className={leftWins ? "text-primary" : "text-text-dim"}>
          {t(score.labels[0], zh[0])}
        </span>
        <span className={!leftWins ? "text-primary" : "text-text-dim"}>
          {t(score.labels[1], zh[1])}
        </span>
      </div>

      <div className="relative h-3 rounded-full bg-bg-deep/50 overflow-hidden">
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${score.percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
        className="text-center mt-2"
      >
        <span className="text-2xl font-[family-name:var(--font-display)] font-extrabold" style={{ color: meta.color }}>
          {score.percentage}%
        </span>
        <span className="text-text-dim text-xs ml-1">{t(score.labels[0], zh[0])}</span>
      </motion.div>
    </motion.div>
  );
}
