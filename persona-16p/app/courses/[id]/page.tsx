"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import type { Course, CourseSeries } from "@/lib/types";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const [course, setCourse] = useState<Course | null>(null);
  const [series, setSeries] = useState<CourseSeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCourse(data.course ?? null);
        setSeries(data.series ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AuthGuard>
      <TopBar title={course ? t(course.title, course.titleZh) : t("Course", "课程")} showBack />
      <main className="px-4 py-6">
        {loading && <div className="py-16"><LoadingSpinner /></div>}

        {course && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-[var(--color-bg)] rounded-[var(--radius-xl)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] overflow-hidden">
              <div className="bg-gradient-to-br from-[var(--color-purple)] to-[var(--color-purple-mid)] p-6 text-white">
                <span className="text-xs font-semibold opacity-80">
                  {series ? t(series.name, series.nameZh) : ""}
                </span>
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold mt-1">
                  {t(course.title, course.titleZh)}
                </h1>
                <div className="flex items-center gap-3 mt-3 text-sm opacity-80">
                  <span>👩‍🏫 {t(course.instructor, course.instructorZh)}</span>
                  <span>⏱ {course.duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)] mb-2">
                  {t("About this course", "课程介绍")}
                </h2>
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
                  {t(course.description, course.descriptionZh)}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Button fullWidth>
                {t("Subscribe to Access", "订阅即可观看")}
              </Button>
              <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
                {t("Choose a subscription plan to unlock all courses", "选择订阅方案解锁全部课程")}
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </AuthGuard>
  );
}
