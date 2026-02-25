"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface LevelUpProps {
  title: string;
  titleZh: string;
  subtitle: string;
  subtitleZh: string;
  icon: string;
}

const confettiColors = ["#a3e635", "#fb7185", "#7dd3fc", "#facc15", "#a78bfa", "#f97316", "#34d399"];

function ConfettiPiece({ index }: { index: number }) {
  const color = confettiColors[index % confettiColors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.6;
  const duration = 1.5 + Math.random() * 1.5;
  const size = 6 + Math.random() * 6;
  const rotation = Math.random() * 720;

  return (
    <motion.div
      initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
      animate={{ y: "105vh", x: (Math.random() - 0.5) * 100, rotate: rotation, opacity: 0 }}
      transition={{ duration, delay, ease: "easeIn" }}
      className="absolute rounded-sm"
      style={{ left: `${left}%`, top: 0, width: size, height: size * (0.6 + Math.random() * 0.8), backgroundColor: color }}
    />
  );
}

export default function LevelUp({ title, titleZh, subtitle, subtitleZh, icon }: LevelUpProps) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>
      <motion.div
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative text-center"
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-7xl block mb-4"
        >
          {icon}
        </motion.span>
        <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-extrabold text-primary mb-1">
          {t(title, titleZh)}
        </h2>
        <p className="text-text-dim text-base font-medium">{t(subtitle, subtitleZh)}</p>
      </motion.div>
    </motion.div>
  );
}
