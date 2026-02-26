import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { getSession, toPublicUser } from "@/lib/auth";
import type { Comment, User } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await db.findMany<Comment>("comments.json", (c) => c.postId === id);
  const users = await db.readAll<User>("users.json");

  const enriched = comments
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((c) => {
      const author = users.find((u) => u.id === c.authorId);
      return { ...c, author: author ? toPublicUser(author) : undefined };
    });

  return NextResponse.json({ comments: enriched });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const comment: Comment = {
    id: randomUUID(),
    postId: id,
    authorId: session.user.id,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  await db.create("comments.json", comment);
  return NextResponse.json({ comment });
}
