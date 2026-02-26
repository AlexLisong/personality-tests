import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { hashPassword, createSession, toPublicUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { username, password, displayName } = await req.json();

    if (!username || !password || !displayName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await db.findOne<User>("users.json", (u) => u.username === username);
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const user: User = {
      id: randomUUID(),
      username,
      passwordHash: await hashPassword(password),
      displayName,
      bio: "",
      avatar: "😊",
      role: "user",
      personalityCode: null,
      dimensionScores: null,
      createdAt: new Date().toISOString(),
    };

    await db.create("users.json", user);
    await createSession(user.id);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
