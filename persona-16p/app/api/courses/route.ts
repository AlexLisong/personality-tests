import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import * as db from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { CourseData, Course } from "@/lib/types";

const COURSES_FILE = "courses.json";
const DEFAULT: CourseData = { series: [], courses: [], tiers: [] };

export async function GET() {
  const data = await db.readStructured<CourseData>(COURSES_FILE, DEFAULT);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.user.role !== "founder") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const data = await db.readStructured<CourseData>(COURSES_FILE, DEFAULT);

  const seriesCourses = data.courses.filter((c) => c.seriesId === body.seriesId);
  const course: Course = {
    id: randomUUID(),
    seriesId: body.seriesId,
    title: body.title ?? "",
    titleZh: body.titleZh ?? "",
    description: body.description ?? "",
    descriptionZh: body.descriptionZh ?? "",
    instructor: body.instructor ?? "",
    instructorZh: body.instructorZh ?? "",
    duration: body.duration ?? "45 min",
    order: seriesCourses.length + 1,
  };

  data.courses.push(course);
  await db.writeStructured(COURSES_FILE, data);

  return NextResponse.json({ course });
}
