"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { dimensionColors } from "@/data/questions";

const dims = ["EI", "SN", "TF", "JP", "AT"] as const;

const stepCards = [
  { step: 1, icon: "📝", title: "Answer Honestly", titleZh: "诚实作答", desc: "Respond to each statement based on your natural tendencies.", descZh: "根据你的自然倾向回答每个问题。" },
  { step: 2, icon: "🧠", title: "Get Your Type", titleZh: "获取类型", desc: "Discover which of the 32 personality types fits you best.", descZh: "发现最适合你的32种人格类型。" },
  { step: 3, icon: "🔍", title: "Explore Results", titleZh: "探索结果", desc: "Understand your strengths across all five personality dimensions.", descZh: "了解你在五个人格维度上的优势。" },
];

export default function HomePage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Dimension color pills */}
          <div className="flex justify-center gap-2 mb-8">
            {dims.map((d, i) => {
              const dc = dimensionColors[d];
              return (
                <motion.span
                  key={d}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="text-xs font-semibold px-3 py-1 rounded-[var(--radius-pill)]"
                  style={{ color: dc.color, backgroundColor: dc.colorLight }}
                >
                  {t(dc.label, dc.labelZh)}
                </motion.span>
              );
            })}
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-extrabold text-[var(--color-text)] leading-tight mb-5">
            {t("Discover Your", "发现你的")}
            <br />
            <span className="text-[var(--color-purple)]">{t("Personality Type", "人格类型")}</span>
          </h1>

          <p className="text-[var(--color-text-mid)] text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            {t(
              "Take our quick personality test and uncover who you really are across five key dimensions.",
              "参加我们的快速人格测试，从五个关键维度揭示真实的你。"
            )}
          </p>

          <Link href="/test">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-pill px-10 py-4 text-lg text-white"
              style={{ backgroundColor: "var(--color-purple)" }}
            >
              {t("Take the Test", "开始测试")}
            </motion.button>
          </Link>

          <p className="text-[var(--color-text-muted)] text-sm mt-4">
            {t("Only 10 questions · Takes 2 minutes", "仅10个问题 · 2分钟完成")}
          </p>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-[family-name:var(--font-display)] text-2xl font-bold text-center text-[var(--color-text)] mb-10"
        >
          {t("How It Works", "测试流程")}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {stepCards.map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white rounded-[var(--radius-lg)] p-6 border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] text-center"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <div className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                {t(`Step ${card.step}`, `第${card.step}步`)}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)] mb-2">
                {t(card.title, card.titleZh)}
              </h3>
              <p className="text-[var(--color-text-dim)] text-sm leading-relaxed">
                {t(card.desc, card.descZh)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dimension preview */}
      <section className="w-full bg-[var(--color-bg-soft)] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-center text-[var(--color-text)] mb-10">
            {t("Five Dimensions", "五大维度")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dims.map((d, i) => {
              const dc = dimensionColors[d];
              return (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-[var(--radius-md)] p-4 text-center border border-[var(--color-border-light)] shadow-[var(--shadow-sm)]"
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: dc.color }}
                  >
                    {d}
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-text)]">
                    {t(dc.label, dc.labelZh)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-[var(--color-text-muted)] text-xs">
        TypeQuest — {t("A personality test demo", "人格测试演示")}
      </footer>
    </main>
  );
}
