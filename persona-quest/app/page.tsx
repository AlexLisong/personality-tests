"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Mascot from "@/components/Mascot";
import { getSessionId } from "@/lib/session";
import { useLang } from "@/lib/i18n";

export default function Home() {
  const router = useRouter();
  const { t } = useLang();
  const [hasProgress, setHasProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProgress = async () => {
      const sid = getSessionId();
      try {
        const res = await fetch(`/api/progress?sessionId=${sid}`);
        const data = await res.json();
        if (data.answers && Object.keys(data.answers).length > 0) {
          setHasProgress(true);
        }
      } catch {}
      setLoading(false);
    };
    checkProgress();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-sparkle bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Persona Quest
        </h1>
        <p className="mt-4 text-lg text-purple-400 font-semibold">
          {t("Discover your true personality type!", "探索你的真实人格类型！")}
        </p>
      </motion.div>

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <Mascot mood="excited" size={160} />
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 max-w-md text-center"
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-purple-100/30 border border-purple-100">
          <p className="text-gray-600 leading-relaxed">
            {t(
              "Answer 10 fun questions and unlock your personality type! It only takes a couple of minutes. Your progress is saved automatically, so you can take a break anytime.",
              "回答10个有趣的问题，解锁你的人格类型！只需几分钟，进度自动保存，随时可以休息。"
            )}
          </p>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-col gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/test")}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold text-lg shadow-lg shadow-purple-200/50 glow-soft cursor-pointer"
        >
          {hasProgress ? t("Continue Quest", "继续探索") : t("Start Quest", "开始探索")}
        </motion.button>

        {hasProgress && !loading && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              localStorage.removeItem("persona-quest-session");
              window.location.reload();
            }}
            className="px-6 py-2 rounded-full bg-white/60 text-purple-400 font-semibold text-sm border border-purple-200 cursor-pointer"
          >
            {t("Start Fresh", "重新开始")}
          </motion.button>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-sm text-purple-300"
      >
        {t("Made with love and sparkles", "用爱与星光制作")}
      </motion.p>
    </div>
  );
}
