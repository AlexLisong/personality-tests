"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

// Segment colors from 16personalities palette
const segmentColors = [
  "#88619A", "#88619A", // EI - purple
  "#E4AE3A", "#E4AE3A", // SN - yellow
  "#33A474", "#33A474", // TF - green
  "#4298B4", "#4298B4", // JP - blue
  "#88619A", "#88619A", // AT - purple
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
              backgroundColor: i < current ? segmentColors[i] : "var(--color-border-light)",
              opacity: i < current ? 1 : 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
