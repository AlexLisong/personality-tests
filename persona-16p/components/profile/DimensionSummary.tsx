"use client";

import type { DimensionScore } from "@/lib/scoring";
import { dimensionColors } from "@/data/questions";

interface DimensionSummaryProps {
  scores: DimensionScore[];
}

export default function DimensionSummary({ scores }: DimensionSummaryProps) {
  return (
    <div className="space-y-2">
      {scores.map((s) => {
        const dc = dimensionColors[s.dimension];
        const pct = s.percentage;
        return (
          <div key={s.dimension} className="flex items-center gap-2">
            <span className="text-xs font-semibold w-6" style={{ color: dc.color }}>{s.dimension}</span>
            <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-soft)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: dc.color }}
              />
            </div>
            <span className="text-xs text-[var(--color-text-dim)] w-6 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}
