"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "@/components/profile/PersonalityBadge";
import { useLang } from "@/lib/i18n";
import type { PublicUser } from "@/lib/types";

interface ConversationItemProps {
  id: string;
  otherUser: PublicUser;
  lastMessage?: string;
  lastMessageAt: string;
  unread: boolean;
}

function formatTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ConversationItem({ id, otherUser, lastMessage, lastMessageAt, unread }: ConversationItemProps) {
  const { t } = useLang();

  return (
    <Link href={`/chat/${id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-soft)] transition-colors">
      <div className="relative">
        <Avatar emoji={otherUser.avatar} size="lg" />
        {unread && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[var(--color-bg)]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm truncate ${unread ? "font-bold text-[var(--color-text)]" : "font-medium text-[var(--color-text)]"}`}>
              {otherUser.displayName}
            </span>
            {otherUser.personalityCode && <PersonalityBadge code={otherUser.personalityCode} size="sm" />}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{formatTime(lastMessageAt)}</span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${unread ? "text-[var(--color-text)] font-medium" : "text-[var(--color-text-dim)]"}`}>
          {lastMessage ?? t("No messages yet", "暂无消息")}
        </p>
      </div>
    </Link>
  );
}
