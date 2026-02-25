"use client";

import { motion } from "framer-motion";

interface GameButtonProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  onClick: () => void;
  delay?: number;
}

export default function GameButton({ label, sublabel, selected, onClick, delay = 0 }: GameButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        game-btn relative w-full rounded-2xl px-4 py-4 text-center cursor-pointer
        transition-colors duration-150 select-none overflow-hidden
        ${selected
          ? "bg-primary text-bg-deep font-bold"
          : "bg-surface hover:bg-surface-hover text-text border border-border"
        }
      `}
    >
      {selected && (
        <span className="absolute inset-0 rounded-2xl border-2 border-primary ring-burst pointer-events-none" />
      )}

      <div className="relative z-10">
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {sublabel && (
        <div className={`relative z-10 text-xs mt-0.5 ${selected ? "text-bg-deep/70" : "text-text-dim"}`}>
          {sublabel}
        </div>
      )}
    </motion.button>
  );
}
