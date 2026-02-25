"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import questions from "@/data/questions";
import QuestionCard from "@/components/QuestionCard";
import ProgressHeader from "@/components/ProgressHeader";
import LevelUp from "@/components/LevelUp";
import Orb from "@/components/Orb";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";
import type { Answers } from "@/lib/scoring";

// Which question indices trigger a level-up
const levelUpAt: Record<number, { title: string; titleZh: string; subtitle: string; subtitleZh: string; icon: string }> = {
  2: { title: "Nice Start!", titleZh: "开局不错！", subtitle: "You're warming up", subtitleZh: "正在热身中", icon: "🔥" },
  4: { title: "Halfway!", titleZh: "已经过半！", subtitle: "Keep the momentum going", subtitleZh: "继续保持势头", icon: "⚡" },
  6: { title: "On Fire!", titleZh: "太棒了！", subtitle: "Just a few more to go", subtitleZh: "还剩几题就完成了", icon: "🚀" },
  8: { title: "Almost There!", titleZh: "就快到了！", subtitle: "The finish line is close", subtitleZh: "终点就在眼前", icon: "🏁" },
};

export default function TestPage() {
  const router = useRouter();
  const { t } = useLang();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState<{ title: string; titleZh: string; subtitle: string; subtitleZh: string; icon: string } | null>(null);
  const [showXpGain, setShowXpGain] = useState(false);
  const pendingNav = useRef<number | null>(null);

  // Load
  useEffect(() => {
    (async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sid=${sid}`);
        const data = await res.json();
        if (data.answers) setAnswers(data.answers);
        if (typeof data.currentIndex === "number") setCurrentIndex(data.currentIndex);
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Save
  const save = useCallback(async (a: Answers, idx: number) => {
    const sid = getSessionId();
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid, answers: a, currentIndex: idx }),
      });
    } catch {}
  }, []);

  const advance = useCallback((nextIdx: number, newAnswers: Answers) => {
    if (nextIdx >= questions.length) {
      save(newAnswers, nextIdx);
      router.push("/result");
      return;
    }
    setDirection(1);
    setCurrentIndex(nextIdx);
    save(newAnswers, nextIdx);
  }, [save, router]);

  const handleAnswer = useCallback((qid: number, value: number) => {
    const newAnswers = { ...answers, [qid]: value };
    setAnswers(newAnswers);

    // XP animation
    setShowXpGain(true);
    setTimeout(() => setShowXpGain(false), 700);

    const nextIdx = currentIndex + 1;

    // Check for level-up
    const lu = levelUpAt[nextIdx];
    if (lu) {
      pendingNav.current = nextIdx;
      setShowLevelUp(lu);
      setTimeout(() => {
        setShowLevelUp(null);
        const nav = pendingNav.current;
        pendingNav.current = null;
        if (nav !== null) advance(nav, newAnswers);
      }, 1800);
    } else {
      // Brief pause then advance
      setTimeout(() => advance(nextIdx, newAnswers), 350);
    }
  }, [answers, currentIndex, advance]);

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Orb size={80} mood="thinking" />
        <p className="text-text-dim text-sm font-medium">{t("Loading your quest...", "加载中...")}</p>
      </div>
    );
  }

  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const xp = answeredCount * 10;
  const orbMood = showXpGain ? "happy" : (currentIndex > 6 ? "happy" : "thinking");

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      {/* Header */}
      <div className="w-full max-w-lg mb-6">
        <ProgressHeader
          current={answeredCount}
          total={questions.length}
          xp={xp}
          dimension={question?.dimension}
          showXpGain={showXpGain}
        />
      </div>

      {/* Orb (small) */}
      <div className="mb-4">
        <Orb size={56} mood={orbMood} />
      </div>

      {/* Question */}
      {question && (
        <QuestionCard
          question={question}
          index={currentIndex}
          selectedValue={answers[question.id]}
          onAnswer={handleAnswer}
          direction={direction}
        />
      )}

      {/* Back */}
      {currentIndex > 0 && !showLevelUp && (
        <button
          onClick={handleBack}
          className="mt-6 px-5 py-2 rounded-xl bg-surface text-text-dim text-sm font-semibold border border-border cursor-pointer hover:bg-surface-hover transition-colors"
        >
          &larr; {t("Back", "返回")}
        </button>
      )}

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUp title={showLevelUp.title} titleZh={showLevelUp.titleZh} subtitle={showLevelUp.subtitle} subtitleZh={showLevelUp.subtitleZh} icon={showLevelUp.icon} />
        )}
      </AnimatePresence>
    </div>
  );
}
