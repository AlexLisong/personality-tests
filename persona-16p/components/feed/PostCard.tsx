"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "@/components/profile/PersonalityBadge";
import DimensionSummary from "@/components/profile/DimensionSummary";
import LikeButton from "./LikeButton";
import CommentList from "./CommentList";
import CompatibilityBadge from "./CompatibilityBadge";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import type { Post, PublicUser } from "@/lib/types";

interface PostCardProps {
  post: Post & { author?: PublicUser; commentCount?: number; matchScore?: number; matchEmoji?: string };
  onLikeToggle: (postId: string) => void;
}

function timeAgo(date: string, t: (en: string, zh: string) => string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("just now", "刚刚");
  if (mins < 60) return t(`${mins}m ago`, `${mins}分钟前`);
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t(`${hrs}h ago`, `${hrs}小时前`);
  const days = Math.floor(hrs / 24);
  return t(`${days}d ago`, `${days}天前`);
}

export default function PostCard({ post, onLikeToggle }: PostCardProps) {
  const { user } = useAuth();
  const { t } = useLang();
  const [showComments, setShowComments] = useState(false);

  const liked = user ? post.likes.includes(user.id) : false;
  const isAnnouncement = post.type === "announcement";
  const isResultShare = post.type === "result_share";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[var(--color-bg)] rounded-[var(--radius-lg)] border shadow-[var(--shadow-sm)] p-4 ${
        isAnnouncement ? "border-[var(--color-purple)]/30 bg-[var(--color-purple-light)]/30" : "border-[var(--color-border-light)]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Link href={`/profile/${post.authorId}`}>
          <Avatar emoji={post.author?.avatar ?? "😊"} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${post.authorId}`} className="text-sm font-semibold text-[var(--color-text)] truncate">
              {post.author?.displayName ?? "User"}
            </Link>
            {post.author?.personalityCode && (
              <PersonalityBadge code={post.author.personalityCode} size="sm" />
            )}
            {post.matchScore !== undefined && post.matchEmoji && (
              <CompatibilityBadge score={post.matchScore} emoji={post.matchEmoji} />
            )}
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            {timeAgo(post.createdAt, t)}
            {isAnnouncement && <span className="ml-1 text-[var(--color-purple)]">· {t("Announcement", "公告")}</span>}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap mb-3">{post.content}</p>

      {/* Result share card */}
      {isResultShare && post.personalityCode && post.dimensionScores && (
        <div className="bg-[var(--color-bg-soft)] rounded-[var(--radius-md)] p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <PersonalityBadge code={post.personalityCode} />
          </div>
          <DimensionSummary scores={post.dimensionScores} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <LikeButton liked={liked} count={post.likes.length} onToggle={() => onLikeToggle(post.id)} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]"
        >
          💬 {(post.commentCount ?? 0) > 0 ? post.commentCount : ""}
        </button>
      </div>

      {/* Comments */}
      {showComments && <CommentList postId={post.id} />}
    </motion.div>
  );
}
