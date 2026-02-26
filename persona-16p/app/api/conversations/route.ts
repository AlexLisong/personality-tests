import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { getSession, toPublicUser } from "@/lib/auth";
import type { Conversation, Message, User } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const allConvs = await db.readAll<Conversation>("conversations.json");
  const allMsgs = await db.readAll<Message>("messages.json");
  const allUsers = await db.readAll<User>("users.json");

  const myConvs = allConvs
    .filter((c) => c.participants.includes(userId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  const conversations = myConvs.map((conv) => {
    const otherId = conv.participants.find((p) => p !== userId)!;
    const otherUser = allUsers.find((u) => u.id === otherId);
    const convMsgs = allMsgs.filter((m) => m.conversationId === conv.id);
    const lastMsg = convMsgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const unread = convMsgs.some((m) => m.senderId !== userId && !m.readAt);

    return {
      id: conv.id,
      otherUser: otherUser ? toPublicUser(otherUser) : null,
      lastMessage: lastMsg?.content,
      lastMessageAt: conv.lastMessageAt,
      unread,
    };
  });

  return NextResponse.json({ conversations });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { participantId } = await req.json();
  if (!participantId) return NextResponse.json({ error: "participantId required" }, { status: 400 });

  const userId = session.user.id;
  if (participantId === userId) return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });

  // Check if conversation already exists
  const existing = await db.findOne<Conversation>(
    "conversations.json",
    (c) => c.participants.includes(userId) && c.participants.includes(participantId)
  );

  if (existing) return NextResponse.json({ conversation: existing });

  const conversation: Conversation = {
    id: randomUUID(),
    participants: [userId, participantId],
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  await db.create("conversations.json", conversation);
  return NextResponse.json({ conversation });
}
