"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

// Segment colors map to the dimension order used in the question list
const segmentColors: string[] = [
  "var(--dimension-ei-color)",
  "var(--dimension-ei-color)",
  "var(--dimension-sn-color)",
  "var(--dimension-sn-color)",
  "var(--dimension-tf-color)",
  "var(--dimension-tf-color)",
  "var(--dimension-jp-color)",
  "var(--dimension-jp-color)",
  "var(--dimension-at-color)",
  "var(--dimension-at-color)",
];

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className="h-1.5 flex-1 rounded-full progress-segment origin-left"
            style={{
              backgroundColor: i < current ? segmentColors[i] ?? "var(--color-purple)" : "var(--color-border-light)",
              opacity: i < current ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
