import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import * as db from "./db";
import type { Session, User, PublicUser } from "./types";

const SESSION_FILE = "sessions.json";
const USER_FILE = "users.json";
const COOKIE_NAME = "tq-session";
const SESSION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const sessions = await db.readAll<Session>(SESSION_FILE);
  sessions.push({ token, userId, expiresAt });
  await db.writeStructured(SESSION_FILE, sessions);

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
}

export async function getSession(): Promise<{ session: Session; user: PublicUser } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.findOne<Session>(SESSION_FILE, (s) => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    const sessions = await db.readAll<Session>(SESSION_FILE);
    await db.writeStructured(SESSION_FILE, sessions.filter((s) => s.token !== session.token));
    return null;
  }

  const user = await db.readById<User>(USER_FILE, session.userId);
  if (!user) return null;

  return { session, user: toPublicUser(user) };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    const sessions = await db.readAll<Session>(SESSION_FILE);
    const filtered = sessions.filter((s) => s.token !== token);
    await db.writeStructured(SESSION_FILE, filtered);
  }
  jar.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<{ session: Session; user: PublicUser }> {
  const result = await getSession();
  if (!result) throw new Error("Unauthorized");
  return result;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _, ...pub } = user;
  return pub;
}
