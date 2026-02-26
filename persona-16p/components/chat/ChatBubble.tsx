"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  content: string;
  isMine: boolean;
  time: string;
}

export default function ChatBubble({ content, isMine, time }: ChatBubbleProps) {
  const t = new Date(time);
  const timeStr = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[75%] px-3.5 py-2 rounded-[var(--radius-lg)] ${
          isMine
            ? "bg-[var(--color-purple)] text-white rounded-br-sm"
            : "bg-[var(--color-bg-soft)] text-[var(--color-text)] rounded-bl-sm"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-[var(--color-text-muted)]"} text-right`}>
          {timeStr}
        </p>
      </div>
    </motion.div>
  );
}
