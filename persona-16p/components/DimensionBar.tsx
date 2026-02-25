"use client";

import { motion } from "framer-motion";
import type { DimensionScore } from "@/lib/scoring";
import { dimensionColors } from "@/data/questions";
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
  const dimColor = dimensionColors[score.dimension];
  const leftWins = score.percentage >= 50;
  const zh = labelZhMap[score.dimension] ?? ["", ""];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-[var(--radius-lg)] p-5 border border-[var(--color-border-light)] shadow-[var(--shadow-sm)]"
    >
      <div className="flex justify-between text-sm font-semibold mb-3">
        <span style={{ color: leftWins ? dimColor.color : "var(--color-text-muted)" }}>
          {t(score.labels[0], zh[0])}
        </span>
        <span style={{ color: !leftWins ? dimColor.color : "var(--color-text-muted)" }}>
          {t(score.labels[1], zh[1])}
        </span>
      </div>

      <div className="relative h-2.5 rounded-full bg-[var(--color-bg-soft)] overflow-hidden">
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${score.percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: dimColor.color }}
        />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)] -translate-x-1/2" />
      </div>

      <div className="text-center mt-2">
        <span className="font-[family-name:var(--font-display)] text-xl font-bold" style={{ color: dimColor.color }}>
          {score.percentage}%
        </span>
        <span className="text-[var(--color-text-muted)] text-xs ml-1.5">
          {t(score.labels[leftWins ? 0 : 1], zh[leftWins ? 0 : 1])}
        </span>
      </div>
    </motion.div>
  );
}
