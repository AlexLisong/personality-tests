import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "data", "progress");

function safePath(sid: string) {
  return path.join(DIR, `${sid.replace(/[^a-zA-Z0-9-]/g, "")}.json`);
}

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid");
  if (!sid) return NextResponse.json({ error: "Missing sid" }, { status: 400 });
  try {
    await fs.mkdir(DIR, { recursive: true });
    const raw = await fs.readFile(safePath(sid), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ answers: {}, currentIndex: 0 });
  }
}

export async function POST(req: NextRequest) {
  const { sid, answers, currentIndex } = await req.json();
  if (!sid) return NextResponse.json({ error: "Missing sid" }, { status: 400 });
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(safePath(sid), JSON.stringify({ answers, currentIndex, ts: Date.now() }), "utf-8");
  return NextResponse.json({ ok: true });
}
