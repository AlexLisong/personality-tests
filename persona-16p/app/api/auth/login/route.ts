import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { verifyPassword, createSession, toPublicUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const user = await db.findOne<User>("users.json", (u) => u.username === username);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
