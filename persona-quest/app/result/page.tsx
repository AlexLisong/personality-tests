"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import questions from "@/data/questions";
import personalities from "@/data/personalities";
import { calculateScores, getPersonalityCode, type Answers, type DimensionScore } from "@/lib/scoring";
import Mascot from "@/components/Mascot";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLang();
  const [scores, setScores] = useState<DimensionScore[] | null>(null);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sessionId=${sid}`);
        const data = await res.json();
        const answers: Answers = data.answers ?? {};

        if (Object.keys(answers).length < questions.length) {
          router.push("/test");
          return;
        }

        const s = calculateScores(questions, answers);
        const c = getPersonalityCode(s);
        setScores(s);
        setCode(c);
      } catch {
        router.push("/");
      }
    };
    load();
  }, [router]);

  if (!scores) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Mascot mood="thinking" size={100} />
      </div>
    );
  }

  const personality = personalities[code];

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {t("Your Result!", "你的结果！")}
        </h1>
        <p className="text-purple-400 mt-2 font-semibold">{t("The quest is complete!", "探索完成！")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Mascot mood="excited" size={120} />
      </motion.div>

      {/* Personality card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateY: 90 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="mt-6 w-full max-w-md"
      >
        <div
          className="rounded-3xl p-8 text-center shadow-xl border-2 border-white/50"
          style={{
            background: `linear-gradient(135deg, ${personality?.color ?? "#88619A"}22, ${personality?.color ?? "#88619A"}44)`,
          }}
        >
          <span className="text-6xl">{personality?.emoji ?? "🌟"}</span>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-4">{code}</h2>
          <h3
            className="text-2xl font-bold mt-1"
            style={{ color: personality?.color ?? "#88619A" }}
          >
            {t(`The ${personality?.name ?? "Explorer"}`, personality?.nameZh ?? "探索者")}
          </h3>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {t(personality?.description ?? "A unique personality type!", personality?.descriptionZh ?? "独特的人格类型！")}
          </p>
        </div>
      </motion.div>

      {/* Dimension breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 w-full max-w-md space-y-4"
      >
        <h3 className="text-lg font-bold text-purple-500 text-center">{t("Your Dimensions", "你的维度")}</h3>
        {scores.map((s, i) => (
          <motion.div
            key={s.dimension}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-100"
          >
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className={s.percentage >= 50 ? "text-purple-600" : "text-gray-400"}>
                {s.labels[0]}
              </span>
              <span className={s.percentage < 50 ? "text-purple-600" : "text-gray-400"}>
                {s.labels[1]}
              </span>
            </div>
            <div className="h-3 rounded-full bg-purple-100 overflow-hidden">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: `${s.percentage}%` }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-pink-300 to-purple-400"
              />
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">{s.percentage}%</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 flex flex-col gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            localStorage.removeItem("persona-quest-session");
            router.push("/");
          }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold shadow-lg cursor-pointer"
        >
          {t("Take Again", "再测一次")}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-full bg-white/60 text-purple-400 font-semibold text-sm border border-purple-200 cursor-pointer"
        >
          {t("Home", "首页")}
        </motion.button>
      </motion.div>

      <p className="mt-8 text-sm text-purple-300">{t("Made with love and sparkles", "用爱与星光制作")}</p>
    </div>
  );
}
