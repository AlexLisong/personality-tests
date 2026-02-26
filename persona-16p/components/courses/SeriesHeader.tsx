"use client";

import { useLang } from "@/lib/i18n";
import type { CourseSeries } from "@/lib/types";

interface SeriesHeaderProps {
  series: CourseSeries;
  courseCount: number;
}

export default function SeriesHeader({ series, courseCount }: SeriesHeaderProps) {
  const { t } = useLang();

  return (
    <div className="mb-4">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-text)]">
        {t(series.name, series.nameZh)}
      </h2>
      <p className="text-sm text-[var(--color-text-dim)] mt-1">
        {t(series.description, series.descriptionZh)}
      </p>
      <span className="text-xs text-[var(--color-text-muted)] mt-1 inline-block">
        {courseCount} {t("courses", "门课程")}
      </span>
    </div>
  );
}
