import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Conversation, Message } from "@/lib/types";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conv = await db.readById<Conversation>("conversations.json", id);
  if (!conv || !conv.participants.includes(session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allMessages = await db.readAll<Message>("messages.json");
  const now = new Date().toISOString();
  let updated = false;

  const patched = allMessages.map((m) => {
    if (m.conversationId === id && m.senderId !== session.user.id && !m.readAt) {
      updated = true;
      return { ...m, readAt: now };
    }
    return m;
  });

  if (updated) {
    await db.writeStructured("messages.json", patched);
  }

  return NextResponse.json({ ok: true });
}
