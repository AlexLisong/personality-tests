import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { getSession, toPublicUser } from "@/lib/auth";
import { calculateMatch } from "@/lib/matching";
import type { Post, Comment, User } from "@/lib/types";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = 20;

  const allPosts = await db.readAll<Post>("posts.json");
  const comments = await db.readAll<Comment>("comments.json");
  const users = await db.readAll<User>("users.json");

  // Sort newest first
  const sorted = [...allPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  let startIdx = 0;
  if (cursor) {
    const idx = sorted.findIndex((p) => p.id === cursor);
    if (idx !== -1) startIdx = idx + 1;
  }

  const page = sorted.slice(startIdx, startIdx + limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;

  // Enrich with author info, comment count, and match scores
  const me = users.find((u) => u.id === session.user.id);
  const enriched = page.map((post) => {
    const author = users.find((u) => u.id === post.authorId);
    const commentCount = comments.filter((c) => c.postId === post.id).length;

    let matchScore: number | undefined;
    let matchEmoji: string | undefined;
    if (me?.dimensionScores && author?.dimensionScores && me.id !== author.id) {
      const match = calculateMatch(me.dimensionScores, author.dimensionScores);
      matchScore = match.score;
      matchEmoji = match.category.emoji;
    }

    return {
      ...post,
      author: author ? toPublicUser(author) : undefined,
      commentCount,
      matchScore,
      matchEmoji,
    };
  });

  return NextResponse.json({ posts: enriched, nextCursor });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, type } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  // Only founders can make announcements
  if (type === "announcement" && session.user.role !== "founder") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const user = await db.readById<User>("users.json", session.user.id);

  const post: Post = {
    id: randomUUID(),
    authorId: session.user.id,
    type: type ?? "text",
    content: content.trim(),
    personalityCode: type === "result_share" ? (user?.personalityCode ?? null) : null,
    dimensionScores: type === "result_share" ? (user?.dimensionScores ?? null) : null,
    likes: [],
    createdAt: new Date().toISOString(),
  };

  await db.create("posts.json", post);
  return NextResponse.json({ post });
}
