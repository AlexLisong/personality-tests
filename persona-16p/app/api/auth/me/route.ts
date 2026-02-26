import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import * as db from "@/lib/db";
import type { Message, Conversation } from "@/lib/types";

export async function GET() {
  const result = await getSession();
  if (!result) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Count unread messages
  const conversations = await db.findMany<Conversation>(
    "conversations.json",
    (c) => c.participants.includes(result.user.id)
  );
  const allMessages = await db.readAll<Message>("messages.json");
  let unreadCount = 0;
  for (const conv of conversations) {
    for (const msg of allMessages) {
      if (msg.conversationId === conv.id && msg.senderId !== result.user.id && !msg.readAt) {
        unreadCount++;
      }
    }
  }

  return NextResponse.json({ user: result.user, unreadCount });
}
