"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import questions from "@/data/questions";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import type { Answers } from "@/lib/scoring";

const encouragements = [
  { en: "Great start!", zh: "好的开始！" },
  { en: "You're doing great!", zh: "做得不错！" },
  { en: "Halfway there!", zh: "已经过半啦！" },
  { en: "Almost done!", zh: "快完成了！" },
  { en: "Last stretch!", zh: "最后冲刺！" },
];

function getEncouragement(index: number, total: number) {
  const pct = index / total;
  if (pct < 0.2) return encouragements[0];
  if (pct < 0.4) return encouragements[1];
  if (pct < 0.6) return encouragements[2];
  if (pct < 0.8) return encouragements[3];
  return encouragements[4];
}

export default function TestPage() {
  const router = useRouter();
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved progress
  useEffect(() => {
    const sid = getSessionId();
    if (!sid) { setLoaded(true); return; }

    fetch(`/api/progress?sid=${sid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.answers && Object.keys(data.answers).length > 0) {
          setAnswers(data.answers);
          // Resume from the first unanswered question
          const answered = new Set(Object.keys(data.answers).map(Number));
          const next = questions.findIndex((q) => !answered.has(q.id));
          if (next === -1) {
            router.push("/result");
          } else {
            setCurrent(next);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [router]);

  const saveProgress = useCallback((newAnswers: Answers) => {
    const sid = getSessionId();
    if (!sid) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sid, answers: newAnswers }),
    }).catch(() => {});
  }, []);

  const handleAnswer = useCallback(
    (_qid: number, value: number) => {
      const q = questions[current];
      const newAnswers = { ...answers, [q.id]: value };
      setAnswers(newAnswers);
      saveProgress(newAnswers);

      // Show encouragement at milestones
      const nextIdx = current + 1;
      if (nextIdx % 3 === 0 && nextIdx < questions.length) {
        setShowEncouragement(true);
        setTimeout(() => {
          setShowEncouragement(false);
          if (nextIdx >= questions.length) {
            router.push("/result");
          } else {
            setCurrent(nextIdx);
          }
        }, 1200);
      } else {
        setTimeout(() => {
          if (nextIdx >= questions.length) {
            router.push("/result");
          } else {
            setCurrent(nextIdx);
          }
        }, 350);
      }
    },
    [current, answers, saveProgress, router]
  );

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="shimmer w-80 h-48 rounded-[var(--radius-lg)]" />
      </main>
    );
  }

  const question = questions[current];
  const enc = getEncouragement(current, questions.length);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Progress */}
      <div className="w-full max-w-2xl mb-10">
        <ProgressBar current={current} total={questions.length} />
      </div>

      {/* Encouragement overlay */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-5xl mb-4"
              >
                ✨
              </motion.div>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-purple)]">
                {t(enc.en, enc.zh)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question */}
      <QuestionCard
        question={question}
        index={current}
        total={questions.length}
        selectedValue={answers[question.id]}
        onAnswer={handleAnswer}
      />

      {/* Navigation hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-[var(--color-text-muted)] text-sm"
      >
        {t(
          "Select a circle to respond and move forward",
          "选择一个圆圈来作答并继续"
        )}
      </motion.p>
    </main>
  );
}
