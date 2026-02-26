"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import ProfileCard from "@/components/profile/ProfileCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PublicUser } from "@/lib/types";
import type { MatchResult } from "@/lib/matching";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/users/${id}`).then((r) => r.json()),
      fetch(`/api/users/${id}/match`).then((r) => (r.ok ? r.json() : null)),
    ]).then(([userData, matchData]) => {
      setProfile(userData.user ?? null);
      setMatch(matchData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleChat = async () => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/chat/${data.conversation.id}`);
    }
  };

  return (
    <AuthGuard>
      <TopBar title={profile?.displayName ?? t("Profile", "资料")} showBack />
      <main className="px-4 py-6">
        {loading && <div className="py-16"><LoadingSpinner /></div>}
        {!loading && !profile && (
          <p className="text-center text-[var(--color-text-dim)] py-16">{t("User not found", "用户不存在")}</p>
        )}
        {profile && (
          <>
            <ProfileCard user={profile} />

            {match && me?.personalityCode && profile.personalityCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5 text-center"
              >
                <div className="text-3xl mb-1">{match.category.emoji}</div>
                <div className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--color-purple)]">
                  {match.score}%
                </div>
                <div className="text-sm font-medium text-[var(--color-text-mid)] mt-1">
                  {t(match.category.label, match.category.labelZh)}
                </div>
                <div className="mt-3 space-y-1.5">
                  {match.dimensions.map((d) => (
                    <div key={d.dimension} className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
                      <span className="font-semibold w-6">{d.dimension}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-soft)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--color-purple)]"
                          style={{ width: `${d.similarity}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{Math.round(d.similarity)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {me && me.id !== profile.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <Button fullWidth onClick={handleChat}>
                  {t("Send Message", "发送消息")}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
