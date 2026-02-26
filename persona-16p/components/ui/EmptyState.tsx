"use client";

import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-dim)] max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
