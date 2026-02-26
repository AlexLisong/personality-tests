"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import PersonalityHeader from "@/components/chat/PersonalityHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Message, PublicUser } from "@/lib/types";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/conversations/${id}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages);
      if (data.otherUser) setOtherUser(data.otherUser);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!id || !user) return;
    fetchMessages();
    // Mark as read
    fetch(`/api/conversations/${id}/messages/read`, { method: "POST" });
    const interval = setInterval(() => {
      fetchMessages();
      fetch(`/api/conversations/${id}/messages/read`, { method: "POST" });
    }, 5000);
    return () => clearInterval(interval);
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    const res = await fetch(`/api/conversations/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) fetchMessages();
  };

  return (
    <AuthGuard>
      <TopBar
        title={otherUser?.displayName ?? t("Chat", "聊天")}
        showBack
        action={otherUser ? <PersonalityHeader user={otherUser} /> : undefined}
      />
      <main className="flex flex-col h-[calc(100vh-3rem)] max-w-lg mx-auto">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && <div className="py-16"><LoadingSpinner /></div>}
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              content={msg.content}
              isMine={msg.senderId === user?.id}
              time={msg.createdAt}
            />
          ))}
          <div ref={bottomRef} />
        </div>
        <ChatInput onSend={handleSend} />
      </main>
    </AuthGuard>
  );
}
