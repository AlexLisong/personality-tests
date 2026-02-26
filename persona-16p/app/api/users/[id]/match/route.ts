import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { calculateMatch } from "@/lib/matching";
import type { User } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await db.readById<User>("users.json", session.user.id);
  const other = await db.readById<User>("users.json", id);

  if (!me || !other) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!me.dimensionScores || !other.dimensionScores) {
    return NextResponse.json({ error: "Both users need personality test results" }, { status: 400 });
  }

  const result = calculateMatch(me.dimensionScores, other.dimensionScores);
  return NextResponse.json(result);
}
