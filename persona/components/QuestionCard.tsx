"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/data/questions";
import { useLang } from "@/lib/i18n";
import GameButton from "./GameButton";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedValue?: number;
  onAnswer: (questionId: number, value: number) => void;
  direction: number;
}

const options = [
  { value: -2, label: "Nah", labelZh: "不是", sublabel: "Strongly disagree", sublabelZh: "非常不同意" },
  { value: -1, label: "Not really", labelZh: "不太是", sublabel: "Disagree", sublabelZh: "不同意" },
  { value: 0, label: "Hmm", labelZh: "一般", sublabel: "Neutral", sublabelZh: "中立" },
  { value: 1, label: "Yeah", labelZh: "有点是", sublabel: "Agree", sublabelZh: "同意" },
  { value: 2, label: "Totally!", labelZh: "完全是!", sublabel: "Strongly agree", sublabelZh: "非常同意" },
];

const cardVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
};

export default function QuestionCard({ question, index, selectedValue, onAnswer, direction }: QuestionCardProps) {
  const { t } = useLang();

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 250, damping: 28 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="rounded-3xl bg-surface backdrop-blur-md border border-border p-6 md:p-8">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
              Q{index + 1}
            </span>
          </div>

          <p className="text-lg md:text-xl font-semibold text-center leading-relaxed text-text mb-8">
            {t(question.text, question.textZh)}
          </p>

          <div className="flex flex-col gap-2.5">
            {options.map((opt, i) => (
              <GameButton
                key={opt.value}
                label={t(opt.label, opt.labelZh)}
                sublabel={t(opt.sublabel, opt.sublabelZh)}
                selected={selectedValue === opt.value}
                onClick={() => onAnswer(question.id, opt.value)}
                delay={i * 0.04}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
