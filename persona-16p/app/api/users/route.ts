import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { toPublicUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const users = await db.readAll<User>("users.json");
  let startIdx = 0;
  if (cursor) {
    const idx = users.findIndex((u) => u.id === cursor);
    if (idx !== -1) startIdx = idx + 1;
  }

  const page = users.slice(startIdx, startIdx + limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;

  return NextResponse.json({
    users: page.map(toPublicUser),
    nextCursor,
  });
}
