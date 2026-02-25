import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".progress");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(sid: string) {
  const safe = sid.replace(/[^a-zA-Z0-9-]/g, "");
  return path.join(DATA_DIR, `${safe}.json`);
}

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid");
  if (!sid) return NextResponse.json({ answers: {} });

  ensureDir();
  const fp = filePath(sid);
  if (!fs.existsSync(fp)) return NextResponse.json({ answers: {} });

  const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sid, answers } = body;
  if (!sid) return NextResponse.json({ error: "No session id" }, { status: 400 });

  ensureDir();
  fs.writeFileSync(filePath(sid), JSON.stringify({ answers }, null, 2));
  return NextResponse.json({ ok: true });
}
