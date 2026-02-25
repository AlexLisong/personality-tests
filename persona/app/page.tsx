"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Orb from "@/components/Orb";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useLang();
  const [hasProgress, setHasProgress] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sid=${sid}`);
        const data = await res.json();
        if (data.answers && Object.keys(data.answers).length > 0) setHasProgress(true);
      } catch {}
      setReady(true);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      {/* Background accent shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-500/[0.03] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <Orb size={140} mood="idle" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mt-8"
        >
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="text-primary">Persona</span>
          </h1>
          <p className="mt-3 text-text-dim text-lg font-medium">
            {t("Discover your personality type", "探索你的人格类型")}
          </p>
        </motion.div>

        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 w-full bg-surface rounded-2xl border border-border p-5"
        >
          <p className="text-text-dim text-sm leading-relaxed text-center">
            {t(
              "10 quick questions. No sign-up. Your progress saves automatically.",
              "10 个快速问题，无需注册，进度自动保存。"
            )}
          </p>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 mt-4">
            {[
              { label: t("Questions", "问题"), value: "10" },
              { label: t("Minutes", "分钟"), value: "~2" },
              { label: t("Types", "类型"), value: "16" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-text">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-text-dim font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full flex flex-col gap-3"
        >
          <button
            onClick={() => router.push("/test")}
            className="game-btn glow-cta w-full py-4 rounded-2xl bg-primary text-bg-deep font-bold text-lg cursor-pointer"
          >
            {hasProgress ? t("Continue", "继续") : t("Begin Quest", "开始探索")}
          </button>

          {hasProgress && ready && (
            <button
              onClick={() => {
                localStorage.removeItem("persona-session-id");
                window.location.reload();
              }}
              className="w-full py-3 rounded-2xl bg-surface text-text-dim font-semibold text-sm border border-border cursor-pointer hover:bg-surface-hover transition-colors"
            >
              {t("Start over", "重新开始")}
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-xs text-text-dim/50 tracking-wider uppercase"
        >
          {t("Free", "免费")} &middot; {t("No sign-up", "无需注册")} &middot; {t("Science-based", "科学依据")}
        </motion.p>
      </div>
    </div>
  );
}
