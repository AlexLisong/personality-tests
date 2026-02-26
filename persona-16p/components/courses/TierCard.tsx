"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { SubscriptionTier } from "@/lib/types";

interface TierCardProps {
  tier: SubscriptionTier;
  featured?: boolean;
  index?: number;
}

export default function TierCard({ tier, featured = false, index = 0 }: TierCardProps) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-[var(--radius-lg)] border p-5 ${
        featured
          ? "border-[var(--color-purple)] shadow-[var(--shadow-md)] bg-[var(--color-bg)]"
          : "border-[var(--color-border-light)] shadow-[var(--shadow-sm)] bg-[var(--color-bg)]"
      }`}
    >
      {featured && (
        <span className="text-[10px] font-bold text-white bg-[var(--color-purple)] px-2 py-0.5 rounded-[var(--radius-pill)] uppercase">
          {t("Popular", "热门")}
        </span>
      )}
      <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)] mt-2">
        {t(tier.name, tier.nameZh)}
      </h3>
      <div className="mt-2">
        <span className="text-2xl font-extrabold text-[var(--color-purple)]">¥{tier.price}</span>
        <span className="text-sm text-[var(--color-text-muted)]">/{t(tier.period, tier.periodZh)}</span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {(t("en", "zh") === "en" ? tier.features : tier.featuresZh).map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-dim)]">
            <span className="text-[var(--color-green)] mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
