"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
  const { t } = useLang();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    await onSubmit(content.trim());
    setContent("");
    setSending(false);
  };

  return (
    <div className="flex gap-2 items-end">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder={t("Write a comment...", "写下评论...")}
        className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple)]"
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || sending}
        className="text-sm font-medium text-[var(--color-purple)] disabled:opacity-40 px-2 py-2"
      >
        {t("Send", "发送")}
      </button>
    </div>
  );
}
