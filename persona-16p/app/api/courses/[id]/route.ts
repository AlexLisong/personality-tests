import { NextResponse } from "next/server";
import * as db from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { CourseData } from "@/lib/types";

const COURSES_FILE = "courses.json";
const DEFAULT: CourseData = { series: [], courses: [], tiers: [] };

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.readStructured<CourseData>(COURSES_FILE, DEFAULT);
  const course = data.courses.find((c) => c.id === id);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const series = data.series.find((s) => s.id === course.seriesId);
  return NextResponse.json({ course, series });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.user.role !== "founder") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const data = await db.readStructured<CourseData>(COURSES_FILE, DEFAULT);
  data.courses = data.courses.filter((c) => c.id !== id);
  await db.writeStructured(COURSES_FILE, data);

  return NextResponse.json({ ok: true });
}
