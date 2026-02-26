"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "@/components/profile/PersonalityBadge";
import type { PublicUser } from "@/lib/types";

interface SuggestedUser extends PublicUser {
  matchScore?: number;
  matchEmoji?: string;
}

function SuggestionSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-soft)]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-24 rounded bg-[var(--color-bg-soft)]" />
            <div className="h-3 w-16 rounded bg-[var(--color-bg-soft)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RightSidebar() {
  const { user } = useAuth();
  const { t } = useLang();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/users?limit=6");
        if (res.ok) {
          const data = await res.json();
          const others = (data.users as PublicUser[]).filter((u) => u.id !== user.id).slice(0, 5);
          const withScores = await Promise.all(
            others.map(async (u) => {
              try {
                const matchRes = await fetch(`/api/users/${u.id}/match`);
                if (matchRes.ok) {
                  const matchData = await matchRes.json();
                  return { ...u, matchScore: matchData.score, matchEmoji: matchData.category?.emoji };
                }
              } catch { /* ignore */ }
              return u;
            })
          );
          setSuggestions(withScores);
        }
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchSuggestions();
  }, [user]);

  if (!user) return null;

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-0 h-screen overflow-y-auto p-4 space-y-4">
      {/* People You May Know */}
      <div className="bg-[var(--color-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text)] mb-3">
          {t("People You May Know", "你可能认识的人")}
        </h3>
        {loading && <SuggestionSkeleton />}
        {!loading && suggestions.length === 0 && (
          <p className="text-xs text-[var(--color-text-muted)] py-2">
            {t("No suggestions yet", "暂无推荐")}
          </p>
        )}
        {!loading && suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.id}`}
                className="flex items-center gap-3 group p-1.5 -mx-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-soft)] transition-colors"
              >
                <Avatar emoji={u.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-purple)] transition-colors">
                    {u.displayName}
                  </p>
                  {u.personalityCode && <PersonalityBadge code={u.personalityCode} size="sm" />}
                </div>
                {u.matchScore != null && (
                  <span className="text-xs font-semibold text-[var(--color-purple)] flex-shrink-0">
                    {u.matchEmoji} {u.matchScore}%
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* About card */}
      <div className="bg-[var(--color-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text)] mb-2">
          {t("About", "关于")}
        </h3>
        <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
          {t(
            "Discover your personality type, connect with like-minded people, and explore courses tailored to your strengths.",
            "发现你的人格类型，与志同道合的人建立连接，探索适合你的课程。"
          )}
        </p>
      </div>
    </aside>
  );
}
