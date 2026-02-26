"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "./PersonalityBadge";
import DimensionSummary from "./DimensionSummary";
import type { PublicUser } from "@/lib/types";
import { useLang } from "@/lib/i18n";

interface ProfileCardProps {
  user: PublicUser;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] overflow-hidden"
    >
      <div className="flex flex-col items-center pt-8 pb-4 px-6">
        <Avatar emoji={user.avatar} size="xl" />
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-text)] mt-3">
          {user.displayName}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">@{user.username}</p>
        {user.personalityCode && (
          <div className="mt-2">
            <PersonalityBadge code={user.personalityCode} />
          </div>
        )}
        {user.bio && (
          <p className="text-sm text-[var(--color-text-dim)] text-center mt-3 max-w-xs">{user.bio}</p>
        )}
        {!user.bio && (
          <p className="text-sm text-[var(--color-text-muted)] italic text-center mt-3">
            {t("No bio yet", "暂无简介")}
          </p>
        )}
      </div>

      {user.dimensionScores && (
        <div className="px-6 pb-6 pt-2">
          <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            {t("Dimensions", "维度")}
          </h3>
          <DimensionSummary scores={user.dimensionScores} />
        </div>
      )}
    </motion.div>
  );
}
