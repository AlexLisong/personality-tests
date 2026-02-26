"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import questions from "@/data/questions";
import personalities, { groupColors } from "@/data/personalities";
import { calculateScores, getPersonalityCode } from "@/lib/scoring";
import { getSessionId, clearSession } from "@/lib/session";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import DimensionBar from "@/components/DimensionBar";
import type { Answers, DimensionScore } from "@/lib/scoring";

export default function ResultPage() {
  const router = useRouter();
  const { t } = useLang();
  const { user, updateUser } = useAuth();
  const [scores, setScores] = useState<DimensionScore[] | null>(null);
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

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

  const handleSaveToProfile = async () => {
    if (!user || !scores || !code) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalityCode: code, dimensionScores: scores }),
    });
    if (res.ok) {
      const data = await res.json();
      updateUser(data.user);
      setSaved(true);
    }
  };

  const handleShareToFeed = async () => {
    if (!user || !scores || !code) return;
    // First save to profile if not saved
    if (!saved && !user.personalityCode) {
      await handleSaveToProfile();
    }
    const personality = personalities[code];
    const content = t(
      `I just discovered I'm a ${code} - ${personality?.name ?? "Unknown"}! ${personality?.tagline ?? ""}`,
      `我刚刚发现我是 ${code} - ${personality?.nameZh ?? "未知"}！${personality?.taglineZh ?? ""}`
    );
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type: "result_share" }),
    });
    if (res.ok) setShared(true);
  };

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
        className="w-full max-w-lg bg-[var(--color-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-lg)] overflow-hidden mb-10"
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

      {/* Social actions (logged in users) */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="w-full max-w-lg mt-8 space-y-3"
        >
          {!saved && !user.personalityCode && (
            <button
              onClick={handleSaveToProfile}
              className="btn-pill w-full px-6 py-3 text-sm text-white"
              style={{ backgroundColor: gc.color }}
            >
              {t("Save to Profile", "保存到个人资料")}
            </button>
          )}
          {saved && (
            <p className="text-center text-sm text-[var(--color-green)] font-medium">
              {t("Saved to your profile!", "已保存到个人资料！")}
            </p>
          )}
          {!shared && (
            <button
              onClick={handleShareToFeed}
              className="btn-pill w-full px-6 py-3 text-sm border border-[var(--color-border)] text-[var(--color-text-mid)] bg-[var(--color-bg)]"
            >
              {t("Share to Feed", "分享到动态")}
            </button>
          )}
          {shared && (
            <p className="text-center text-sm text-[var(--color-purple)] font-medium">
              {t("Shared to feed!", "已分享到动态！")}
            </p>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex gap-4 mt-8"
      >
        <button
          onClick={handleRetake}
          className="btn-pill px-6 py-3 text-sm border border-[var(--color-border)] text-[var(--color-text-mid)] bg-[var(--color-bg)]"
        >
          {t("Retake Test", "重新测试")}
        </button>
        <Link href={user ? "/feed" : "/"}>
          <button
            className="btn-pill px-6 py-3 text-sm text-white"
            style={{ backgroundColor: gc.color }}
          >
            {user ? t("Go to Feed", "进入动态") : t("Back Home", "返回首页")}
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
