import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { Post } from "@/lib/types";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await db.readById<Post>("posts.json", id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userId = session.user.id;
  const likes = post.likes.includes(userId)
    ? post.likes.filter((lid) => lid !== userId)
    : [...post.likes, userId];

  await db.update<Post>("posts.json", id, { likes });
  return NextResponse.json({ likes });
}
