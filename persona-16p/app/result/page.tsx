"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import questions from "@/data/questions";
import personalities, { groupColors } from "@/data/personalities";
import { calculateScores, getPersonalityCode } from "@/lib/scoring";
import { getSessionId, clearSession } from "@/lib/session";
import { useLang } from "@/lib/i18n";
import DimensionBar from "@/components/DimensionBar";
import type { Answers, DimensionScore } from "@/lib/scoring";

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLang();
  const [scores, setScores] = useState<DimensionScore[] | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    const sid = getSessionId();
    if (!sid) { router.push("/"); return; }

    fetch(`/api/progress?sid=${sid}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.answers || Object.keys(data.answers).length < questions.length) {
          router.push("/test");
          return;
        }
        const ans: Answers = {};
        for (const [k, v] of Object.entries(data.answers)) {
          ans[Number(k)] = v as number;
        }
        const s = calculateScores(questions, ans);
        setScores(s);
        setCode(getPersonalityCode(s));
      })
      .catch(() => router.push("/"));
  }, [router]);

  if (!scores) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="shimmer w-80 h-48 rounded-[var(--radius-lg)]" />
      </main>
    );
  }

  const personality = personalities[code];
  const group = personality?.group ?? "analyst";
  const gc = groupColors[group];

  const handleRetake = () => {
    clearSession();
    router.push("/test");
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      {/* Type card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-lg bg-white rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-lg)] overflow-hidden mb-10"
      >
        {/* Color header */}
        <div
          className="py-8 px-6 text-center text-white"
          style={{ backgroundColor: gc.color }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
            className="text-5xl mb-3"
          >
            {personality?.emoji ?? "🧩"}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-[family-name:var(--font-display)] text-3xl font-extrabold"
          >
            {code}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg font-medium mt-1"
          >
            {personality ? t(personality.name, personality.nameZh) : ""}
          </motion.p>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)] mb-2">
            {personality ? t(personality.tagline, personality.taglineZh) : ""}
          </p>
          <p className="text-[var(--color-text-dim)] text-sm leading-relaxed">
            {personality ? t(personality.description, personality.descriptionZh) : ""}
          </p>
        </div>
      </motion.div>

      {/* Dimension breakdown */}
      <div className="w-full max-w-lg">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text)] mb-5 text-center"
        >
          {t("Your Dimensions", "你的维度")}
        </motion.h2>

        <div className="space-y-4">
          {scores.map((s, i) => (
            <DimensionBar key={s.dimension} score={s} delay={0.5 + i * 0.1} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4 mt-12"
      >
        <button
          onClick={handleRetake}
          className="btn-pill px-6 py-3 text-sm border border-[var(--color-border)] text-[var(--color-text-mid)] bg-white"
        >
          {t("Retake Test", "重新测试")}
        </button>
        <Link href="/">
          <button
            className="btn-pill px-6 py-3 text-sm text-white"
            style={{ backgroundColor: gc.color }}
          >
            {t("Back Home", "返回首页")}
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
