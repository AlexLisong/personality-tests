import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { getSession, toPublicUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.readById<User>("users.json", id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: toPublicUser(user) });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.user.id !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const allowed: (keyof User)[] = ["displayName", "bio", "avatar", "personalityCode", "dimensionScores"];
  const patch: Partial<User> = {};
  for (const key of allowed) {
    if (key in body) {
      (patch as Record<string, unknown>)[key] = body[key];
    }
  }

  const updated = await db.update<User>("users.json", id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user: toPublicUser(updated) });
}
