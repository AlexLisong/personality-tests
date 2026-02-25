"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import questions from "@/data/questions";
import personalities from "@/data/personalities";
import { calculateScores, getPersonalityCode, type Answers, type DimensionScore } from "@/lib/scoring";
import DimensionBar from "@/components/DimensionBar";
import Orb from "@/components/Orb";
import { getSessionId, clearSession } from "@/lib/session";
import { useLang } from "@/lib/i18n";

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLang();
  const [scores, setScores] = useState<DimensionScore[] | null>(null);
  const [code, setCode] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    (async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sid=${sid}`);
        const data = await res.json();
        const a: Answers = data.answers ?? {};
        if (Object.keys(a).length < questions.length) { router.push("/test"); return; }
        const s = calculateScores(questions, a);
        setScores(s);
        setCode(getPersonalityCode(s));
        setTimeout(() => setRevealed(true), 1200);
      } catch { router.push("/"); }
    })();
  }, [router]);

  if (!scores) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Orb size={100} mood="thinking" />
        <p className="text-text-dim font-medium shimmer inline-block px-4 py-2 rounded-lg">
          {t("Analyzing...", "分析中...")}
        </p>
      </div>
    );
  }

  const p = personalities[code];

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      {!revealed ? (
        <motion.div
          className="flex flex-col items-center justify-center flex-1 gap-4"
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Orb size={120} mood="thinking" />
          <p className="text-text-dim font-semibold text-lg">{t("Analyzing your personality...", "分析你的人格中...")}</p>
          <div className="w-48 h-1.5 rounded-full bg-surface overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          {/* Quest complete badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 uppercase tracking-wider">
              {t("Quest Complete", "探索完成")}
            </span>
          </motion.div>

          {/* Type card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
            className="w-full"
          >
            <div className={`rounded-3xl overflow-hidden bg-gradient-to-br ${p?.gradient ?? "from-primary to-emerald-600"} p-px`}>
              <div className="rounded-3xl bg-bg-deep/90 backdrop-blur-sm p-8 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-6xl block mb-4"
                >
                  {p?.emoji ?? "✦"}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-extrabold tracking-tight text-text"
                >
                  {code}
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="text-text-dim/70 font-semibold text-base mt-0.5"
                >
                  {t(p?.name ?? "Explorer", p?.nameZh ?? "探索者")}
                </motion.h2>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-primary font-bold text-xl mt-2"
                >
                  {t(p?.tagline ?? "The Explorer", p?.taglineZh ?? "探索者")}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-text-dim text-sm leading-relaxed mt-4"
                >
                  {t(p?.description ?? "A unique personality type.", p?.descriptionZh ?? "独特的人格类型。")}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Dimension breakdown */}
          <div className="w-full mt-8 space-y-3">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs font-bold uppercase tracking-wider text-text-dim text-center mb-4"
            >
              {t("Your Dimensions", "你的维度")}
            </motion.h3>
            {scores.map((s, i) => (
              <DimensionBar key={s.dimension} score={s} delay={0.9 + i * 0.1} />
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10 w-full flex flex-col gap-3"
          >
            <button
              onClick={() => { clearSession(); router.push("/"); }}
              className="game-btn w-full py-4 rounded-2xl bg-primary text-bg-deep font-bold text-lg cursor-pointer"
            >
              {t("Take Again", "再测一次")}
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl bg-surface text-text-dim font-semibold text-sm border border-border cursor-pointer hover:bg-surface-hover transition-colors"
            >
              {t("Home", "首页")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
