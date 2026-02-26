import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { getSession, toPublicUser } from "@/lib/auth";
import type { Conversation, Message, User } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = await db.readById<Conversation>("conversations.json", id);
  if (!conv || !conv.participants.includes(session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await db.findMany<Message>("messages.json", (m) => m.conversationId === id);
  messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const otherId = conv.participants.find((p) => p !== session.user.id)!;
  const otherUserRaw = await db.readById<User>("users.json", otherId);
  const otherUser = otherUserRaw ? toPublicUser(otherUserRaw) : null;

  return NextResponse.json({ messages, otherUser });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = await db.readById<Conversation>("conversations.json", id);
  if (!conv || !conv.participants.includes(session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const message: Message = {
    id: randomUUID(),
    conversationId: id,
    senderId: session.user.id,
    content: content.trim(),
    readAt: null,
    createdAt: new Date().toISOString(),
  };

  await db.create("messages.json", message);
  await db.update<Conversation>("conversations.json", id, { lastMessageAt: message.createdAt });

  return NextResponse.json({ message });
}
