"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const { t } = useLang();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    await onSend(content.trim());
    setContent("");
    setSending(false);
  };

  return (
    <div className="sticky bottom-0 bg-[var(--color-bg)] border-t border-[var(--color-border-light)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:pb-3">
      <div className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={t("Type a message...", "输入消息...")}
          className="flex-1 px-4 py-2.5 text-sm rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-bg-soft)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple)]"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="w-10 h-10 rounded-full bg-[var(--color-purple)] text-white flex items-center justify-center disabled:opacity-40"
        >
          ↑
        </motion.button>
      </div>
    </div>
  );
}
