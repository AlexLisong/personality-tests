"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import CommentInput from "./CommentInput";
import type { Comment, PublicUser } from "@/lib/types";

interface CommentListProps {
  postId: string;
}

interface CommentWithAuthor extends Comment {
  author?: PublicUser;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);

  const fetchComments = async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (content: string) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) fetchComments();
  };

  return (
    <div className="space-y-3 mt-3 pt-3 border-t border-[var(--color-border-light)]">
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2">
          <Avatar emoji={c.author?.avatar ?? "😊"} size="sm" />
          <div>
            <span className="text-xs font-semibold text-[var(--color-text)]">
              {c.author?.displayName ?? "User"}
            </span>
            <p className="text-sm text-[var(--color-text-dim)]">{c.content}</p>
          </div>
        </div>
      ))}
      <CommentInput onSubmit={handleSubmit} />
    </div>
  );
}
