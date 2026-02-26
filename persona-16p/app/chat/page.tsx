"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import ConversationItem from "@/components/chat/ConversationItem";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { PublicUser } from "@/lib/types";

interface ConversationWithMeta {
  id: string;
  otherUser: PublicUser;
  lastMessage?: string;
  lastMessageAt: string;
  unread: boolean;
}

export default function ChatListPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
      setLoading(false);
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthGuard>
      <TopBar title={t("Messages", "消息")} />
      <main className="max-w-lg mx-auto">
        {loading && <div className="py-16"><LoadingSpinner /></div>}

        {!loading && conversations.length === 0 && (
          <EmptyState
            icon="💬"
            title={t("No messages yet", "暂无消息")}
            description={t("Visit someone's profile to start chatting!", "访问其他用户的资料页开始聊天吧！")}
          />
        )}

        <div className="divide-y divide-[var(--color-border-light)]">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              id={conv.id}
              otherUser={conv.otherUser}
              lastMessage={conv.lastMessage}
              lastMessageAt={conv.lastMessageAt}
              unread={conv.unread}
            />
          ))}
        </div>
      </main>
    </AuthGuard>
  );
}
