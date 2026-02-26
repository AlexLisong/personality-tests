"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import type { PostType } from "@/lib/types";

interface PostComposerProps {
  onPost: (content: string, type: PostType) => Promise<void>;
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const { user } = useAuth();
  const { t } = useLang();
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>("text");
  const [expanded, setExpanded] = useState(false);
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim() || posting) return;
    setPosting(true);
    await onPost(content.trim(), type);
    setContent("");
    setType("text");
    setExpanded(false);
    setPosting(false);
  };

  if (!user) return null;

  return (
    <motion.div
      layout
      className="bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4"
    >
      <div className="flex gap-3">
        <Avatar emoji={user.avatar} size="md" />
        <div className="flex-1">
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-left text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-soft)] rounded-[var(--radius-md)] px-4 py-2.5"
            >
              {t("What's on your mind?", "分享你的想法...")}
            </button>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <textarea
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t("Share your thoughts...", "分享你的想法...")}
                  className="w-full text-sm text-[var(--color-text)] bg-transparent resize-none focus:outline-none min-h-[80px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(["text", ...(user.role === "founder" ? ["announcement"] : [])] as PostType[]).map((pt) => (
                      <button
                        key={pt}
                        onClick={() => setType(pt)}
                        className={`text-xs px-2.5 py-1 rounded-[var(--radius-pill)] ${
                          type === pt
                            ? "bg-[var(--color-purple)] text-white"
                            : "bg-[var(--color-bg-soft)] text-[var(--color-text-dim)]"
                        }`}
                      >
                        {pt === "text" ? t("Post", "帖子") : t("Announcement", "公告")}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setExpanded(false)}>
                      {t("Cancel", "取消")}
                    </Button>
                    <Button onClick={handlePost} loading={posting} disabled={!content.trim()}>
                      {t("Publish", "发布")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
