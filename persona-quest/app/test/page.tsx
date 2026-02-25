"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import questions from "@/data/questions";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import Mascot from "@/components/Mascot";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";
import type { Answers } from "@/lib/scoring";

const encouragementsEn = [
  "You're doing great!",
  "Keep going!",
  "Almost halfway!",
  "On fire!",
  "Almost done!",
];

const encouragementsZh = [
  "做得好！",
  "继续加油！",
  "快到一半了！",
  "太棒了！",
  "马上完成！",
];

export default function TestPage() {
  const router = useRouter();
  const { t } = useLang();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encourageText, setEncourageText] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load progress
  useEffect(() => {
    const load = async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sessionId=${sid}`);
        const data = await res.json();
        if (data.answers) setAnswers(data.answers);
        if (data.currentIndex) setCurrentIndex(data.currentIndex);
      } catch {}
      setLoaded(true);
    };
    load();
  }, []);

  // Save progress
  const saveProgress = useCallback(
    async (newAnswers: Answers, newIndex: number) => {
      const sid = getSessionId();
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            answers: newAnswers,
            currentIndex: newIndex,
          }),
        });
      } catch {}
    },
    []
  );

  const handleAnswer = useCallback(
    (questionId: number, value: number) => {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);

      const nextIndex = currentIndex + 1;

      if (nextIndex === 3 || nextIndex === 5 || nextIndex === 8) {
        const idx = Math.floor(Math.random() * encouragementsEn.length);
        const msg = t(encouragementsEn[idx], encouragementsZh[idx]);
        setEncourageText(msg);
        setShowEncouragement(true);
        setTimeout(() => {
          setShowEncouragement(false);
          if (nextIndex >= questions.length) {
            saveProgress(newAnswers, nextIndex);
            router.push("/result");
          } else {
            setCurrentIndex(nextIndex);
            saveProgress(newAnswers, nextIndex);
          }
        }, 1500);
      } else if (nextIndex >= questions.length) {
        saveProgress(newAnswers, nextIndex);
        router.push("/result");
      } else {
        setCurrentIndex(nextIndex);
        saveProgress(newAnswers, nextIndex);
      }
    },
    [answers, currentIndex, router, saveProgress, t]
  );

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Mascot mood="sleeping" size={100} />
      </div>
    );
  }

  const question = questions[currentIndex];
  const mascotMood = currentIndex < 3 ? "happy" : currentIndex < 7 ? "thinking" : "excited";
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Persona Quest
        </h2>
      </motion.div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-6">
        <ProgressBar current={answeredCount} total={questions.length} />
      </div>

      {/* Mascot (small) */}
      <div className="mb-4">
        <Mascot mood={mascotMood} size={80} />
      </div>

      {/* Encouragement overlay */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm"
          >
            <div className="bg-white/90 rounded-3xl px-10 py-8 shadow-2xl text-center">
              <Mascot mood="excited" size={100} />
              <p className="text-2xl font-bold text-purple-500 mt-4">
                {encourageText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      {question && (
        <QuestionCard
          question={question}
          index={currentIndex}
          selectedValue={answers[question.id]}
          onAnswer={handleAnswer}
        />
      )}

      {/* Back button */}
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="mt-6 px-6 py-2 rounded-full bg-white/60 text-purple-400 font-semibold text-sm border border-purple-200 cursor-pointer"
        >
          &larr; {t("Back", "返回")}
        </motion.button>
      )}
    </div>
  );
}
