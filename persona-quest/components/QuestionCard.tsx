"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "@/data/questions";
import { useLang } from "@/lib/i18n";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedValue?: number;
  onAnswer: (questionId: number, value: number) => void;
}

const scaleOptions = [
  { value: -3, label: "Nope!", labelZh: "才不是!", color: "from-red-200 to-red-300", emoji: "😤" },
  { value: -2, label: "Disagree", labelZh: "不同意", color: "from-orange-200 to-orange-300", emoji: "😕" },
  { value: -1, label: "A little no", labelZh: "有点不是", color: "from-yellow-200 to-yellow-300", emoji: "🤔" },
  { value: 0, label: "Neutral", labelZh: "中立", color: "from-gray-200 to-gray-300", emoji: "😐" },
  { value: 1, label: "A little yes", labelZh: "有点是", color: "from-lime-200 to-lime-300", emoji: "🙂" },
  { value: 2, label: "Agree", labelZh: "同意", color: "from-emerald-200 to-emerald-300", emoji: "😊" },
  { value: 3, label: "Totally!", labelZh: "完全是!", color: "from-green-200 to-green-300", emoji: "🥰" },
];

export default function QuestionCard({
  question,
  index,
  selectedValue,
  onAnswer,
}: QuestionCardProps) {
  const { t } = useLang();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 80, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -80, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-lg mx-auto"
      >
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg shadow-purple-100/50 p-8 border border-purple-100">
          {/* Question number badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-block bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 text-xs font-bold px-4 py-1 rounded-full">
              Q{index + 1}
            </span>
          </div>

          {/* Question text */}
          <p className="text-lg md:text-xl font-semibold text-center text-gray-700 leading-relaxed mb-8">
            {t(question.text, question.textZh)}
          </p>

          {/* 7-point scale */}
          <div className="grid grid-cols-7 gap-2">
            {scaleOptions.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onAnswer(question.id, opt.value)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-2xl cursor-pointer transition-all duration-200
                    ${isSelected
                      ? `bg-gradient-to-b ${opt.color} ring-2 ring-purple-300 shadow-md`
                      : "bg-white/50 hover:bg-white/80"
                    }
                  `}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-[10px] font-medium text-gray-500 leading-tight text-center">
                    {t(opt.label, opt.labelZh)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
