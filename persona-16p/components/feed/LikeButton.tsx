"use client";

import { motion } from "framer-motion";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export default function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      className="flex items-center gap-1 text-sm"
    >
      <motion.span
        animate={liked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {liked ? "❤️" : "🤍"}
      </motion.span>
      <span className={liked ? "text-red-500 font-medium" : "text-[var(--color-text-muted)]"}>
        {count > 0 ? count : ""}
      </span>
    </motion.button>
  );
}
