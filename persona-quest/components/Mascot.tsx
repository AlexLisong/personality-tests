"use client";

import { motion } from "framer-motion";

interface MascotProps {
  mood?: "happy" | "thinking" | "excited" | "sleeping";
  size?: number;
}

export default function Mascot({ mood = "happy", size = 120 }: MascotProps) {
  const faces: Record<string, { eyes: string; mouth: string; blush: boolean }> = {
    happy: { eyes: "◕ ◕", mouth: "◡", blush: true },
    thinking: { eyes: "◑ ◑", mouth: "〰", blush: false },
    excited: { eyes: "★ ★", mouth: "▽", blush: true },
    sleeping: { eyes: "－ －", mouth: "з", blush: true },
  };

  const face = faces[mood];

  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: mood === "excited" ? [0, -3, 3, 0] : 0,
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 0.5, repeat: Infinity },
      }}
      className="select-none"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        {/* Body */}
        <ellipse cx="60" cy="65" rx="45" ry="42" fill="#F8BBD0" />
        {/* Ears */}
        <ellipse cx="30" cy="30" rx="15" ry="20" fill="#F48FB1" transform="rotate(-15 30 30)" />
        <ellipse cx="90" cy="30" rx="15" ry="20" fill="#F48FB1" transform="rotate(15 90 30)" />
        <ellipse cx="30" cy="28" rx="9" ry="13" fill="#FCE4EC" transform="rotate(-15 30 28)" />
        <ellipse cx="90" cy="28" rx="9" ry="13" fill="#FCE4EC" transform="rotate(15 90 28)" />
        {/* Blush */}
        {face.blush && (
          <>
            <ellipse cx="30" cy="68" rx="10" ry="6" fill="#FFCDD2" opacity="0.6" />
            <ellipse cx="90" cy="68" rx="10" ry="6" fill="#FFCDD2" opacity="0.6" />
          </>
        )}
        {/* Eyes */}
        <text x="60" y="60" textAnchor="middle" fontSize="16" fill="#4A148C">
          {face.eyes}
        </text>
        {/* Mouth */}
        <text x="60" y="80" textAnchor="middle" fontSize="18" fill="#4A148C">
          {face.mouth}
        </text>
      </svg>
    </motion.div>
  );
}
