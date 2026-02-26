"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import PostComposer from "@/components/feed/PostComposer";
import PostCard from "@/components/feed/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Post, PostType, PublicUser } from "@/lib/types";

interface PostWithMeta extends Post {
  author?: PublicUser;
  commentCount?: number;
  matchScore?: number;
  matchEmoji?: string;
}

export default function FeedPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (cursorParam?: string | null) => {
    const url = cursorParam ? `/api/posts?cursor=${cursorParam}` : "/api/posts";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (cursorParam) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePost = async (content: string, type: PostType) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type }),
    });
    if (res.ok) {
      fetchPosts();
    }
  };

  const handleLikeToggle = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
      );
    }
  };

  return (
    <AuthGuard>
      <TopBar title={t("Feed", "动态")} />
      <main className="px-4 py-4 space-y-4">
        <PostComposer onPost={handlePost} />

        {loading && <div className="py-8"><LoadingSpinner /></div>}

        {!loading && posts.length === 0 && (
          <EmptyState
            icon="📝"
            title={t("No posts yet", "暂无动态")}
            description={t("Be the first to share something!", "成为第一个分享的人吧！")}
          />
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
        ))}

        {hasMore && !loading && posts.length > 0 && (
          <button
            onClick={() => fetchPosts(cursor)}
            className="w-full py-3 text-sm text-[var(--color-purple)] font-medium"
          >
            {t("Load more", "加载更多")}
          </button>
        )}
      </main>
    </AuthGuard>
  );
}
