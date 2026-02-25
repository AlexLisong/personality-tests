import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const PROGRESS_DIR = path.join(process.cwd(), "data", "progress");

async function ensureDir() {
  await fs.mkdir(PROGRESS_DIR, { recursive: true });
}

function filePath(sessionId: string): string {
  // Sanitize to prevent path traversal
  const safe = sessionId.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(PROGRESS_DIR, `${safe}.json`);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    await ensureDir();
    const data = await fs.readFile(filePath(sessionId), "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ answers: {}, currentIndex: 0 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, answers, currentIndex } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  await ensureDir();
  const data = JSON.stringify({ answers, currentIndex, updatedAt: new Date().toISOString() });
  await fs.writeFile(filePath(sessionId), data, "utf-8");

  return NextResponse.json({ ok: true });
}
