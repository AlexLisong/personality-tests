"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import questions from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { getSessionId, clearSession } from "@/lib/session";
import { useLang } from "@/lib/i18n";

const encouragements = [
  { en: "Great start!", zh: "好的开始！" },
  { en: "You're doing great!", zh: "做得不错！" },
  { en: "Halfway there!", zh: "已经过半啦！" },
  { en: "Almost done!", zh: "快完成了！" },
  { en: "Last stretch!", zh: "最后冲刺！" },
];

const defer = (cb: () => void) => {
  if (typeof queueMicrotask === "function") queueMicrotask(cb);
  else setTimeout(cb, 0);
};

export default function TestPage() {
  const router = useRouter();
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showCongrats, setShowCongrats] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sid = getSessionId();
    if (!sid) {
      defer(() => setLoaded(true));
      return;
    }

    fetch(`/api/progress?sid=${sid}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.answers || Object.keys(data.answers).length === 0) return;
        setAnswers(data.answers);
        const answeredIds = new Set(Object.keys(data.answers).map(Number));
        const nextIndex = questions.findIndex((q) => !answeredIds.has(q.id));
        if (nextIndex === -1) router.push("/result");
        else setCurrent(nextIndex);
      })
      .finally(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [router]);

  const saveProgress = useCallback((payload: Record<number, number>) => {
    const sid = getSessionId();
    if (!sid) return;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sid, answers: payload }),
    }).catch(() => {});
  }, []);

  const handleAnswer = useCallback(
    (questionId: number, value: number) => {
      const updated = { ...answers, [questionId]: value };
      setAnswers(updated);
      saveProgress(updated);

      const nextIndex = current + 1;
      if ((nextIndex % 3 === 0 && nextIndex < questions.length) || nextIndex === questions.length) {
        setShowCongrats(true);
        setTimeout(() => {
          setShowCongrats(false);
          if (nextIndex >= questions.length) router.push("/result");
          else setCurrent(nextIndex);
        }, 1200);
      } else {
        setTimeout(() => {
          if (nextIndex >= questions.length) router.push("/result");
          else setCurrent(nextIndex);
        }, 350);
      }
    },
    [answers, current, router, saveProgress]
  );

  const encouragement = useMemo(() => {
    const progress = current / questions.length;
    if (progress < 0.2) return encouragements[0];
    if (progress < 0.4) return encouragements[1];
    if (progress < 0.6) return encouragements[2];
    if (progress < 0.8) return encouragements[3];
    return encouragements[4];
  }, [current]);

  if (!loaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="shimmer w-80 h-48 rounded-[var(--radius-lg)]" />
      </main>
    );
  }

  const question = questions[current];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl mb-10">
        <ProgressBar current={current} total={questions.length} />
      </div>

      {showCongrats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl mb-4">
              ✨
            </motion.div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold" style={{ color: "var(--color-purple)" }}>
              {t(encouragement.en, encouragement.zh)}
            </p>
          </div>
        </motion.div>
      )}

      {question && (
        <QuestionCard
          key={question.id}
          question={question}
          index={current}
          total={questions.length}
          selectedValue={answers[question.id]}
          onAnswer={handleAnswer}
        />
      )}

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 text-[var(--color-text-muted)] text-sm">
        {t("Select a circle to respond and move forward", "选择一个圆圈来作答并继续")}
      </motion.p>
    </main>
  );
}
