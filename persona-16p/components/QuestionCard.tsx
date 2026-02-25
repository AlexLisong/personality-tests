"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/data/questions";
import { dimensionColors } from "@/data/questions";
import { useLang } from "@/lib/i18n";
import ScaleSelector from "./ScaleSelector";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedValue?: number;
  onAnswer: (questionId: number, value: number) => void;
}

export default function QuestionCard({ question, index, total, selectedValue, onAnswer }: QuestionCardProps) {
  const { t } = useLang();
  const dimColor = dimensionColors[question.dimension];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Question number */}
        <div className="text-center mb-3">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-[var(--radius-pill)]"
            style={{ color: dimColor.color, backgroundColor: dimColor.colorLight }}
          >
            {index + 1} / {total}
          </span>
        </div>

        {/* Question text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-center text-[var(--color-text)] leading-relaxed mb-10"
        >
          {t(question.text, question.textZh)}
        </motion.p>

        {/* Scale */}
        <ScaleSelector
          selectedValue={selectedValue}
          onSelect={(value) => onAnswer(question.id, value)}
          color={dimColor.color}
        />
      </motion.div>
    </AnimatePresence>
  );
}
