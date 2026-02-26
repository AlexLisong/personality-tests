"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const { t } = useLang();

  return (
    <Link href={`/courses/${course.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -2 }}
        className="bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4 hover:shadow-[var(--shadow-md)] transition-shadow"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--color-text)] truncate">
              {t(course.title, course.titleZh)}
            </h3>
            <p className="text-xs text-[var(--color-text-dim)] mt-1 line-clamp-2">
              {t(course.description, course.descriptionZh)}
            </p>
          </div>
          <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{course.duration}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-[var(--color-purple)]">{t(course.instructor, course.instructorZh)}</span>
        </div>
      </motion.div>
    </Link>
  );
}
