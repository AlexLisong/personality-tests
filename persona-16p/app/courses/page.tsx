"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import CourseCard from "@/components/courses/CourseCard";
import SeriesHeader from "@/components/courses/SeriesHeader";
import TierCard from "@/components/courses/TierCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { CourseData } from "@/lib/types";

export default function CoursesPage() {
  const { t } = useLang();
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <TopBar title={t("Courses", "课程")} />
      <main className="max-w-lg mx-auto px-4 py-6">
        {loading && <div className="py-16"><LoadingSpinner /></div>}

        {data && (
          <>
            {/* Subscription tiers */}
            <section className="mb-8">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)] mb-4">
                {t("Subscription Plans", "订阅方案")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {data.tiers.map((tier, i) => (
                  <TierCard key={tier.id} tier={tier} featured={i === 1} index={i} />
                ))}
              </div>
            </section>

            {/* Course series */}
            {data.series.map((series) => {
              const courses = data.courses
                .filter((c) => c.seriesId === series.id)
                .sort((a, b) => a.order - b.order);
              return (
                <section key={series.id} className="mb-8">
                  <SeriesHeader series={series} courseCount={courses.length} />
                  <div className="space-y-3">
                    {courses.map((course, i) => (
                      <CourseCard key={course.id} course={course} index={i} />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>
    </AuthGuard>
  );
}
