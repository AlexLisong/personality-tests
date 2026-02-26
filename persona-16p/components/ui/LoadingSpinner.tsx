"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: size, height: size }}
        className="rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-purple)]"
      />
    </div>
  );
}
