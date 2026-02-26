"use client";

import personalities, { groupColors } from "@/data/personalities";

interface PersonalityBadgeProps {
  code: string;
  size?: "sm" | "md";
}

export default function PersonalityBadge({ code, size = "md" }: PersonalityBadgeProps) {
  const p = personalities[code];
  const group = p?.group ?? "analyst";
  const gc = groupColors[group];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-[var(--radius-pill)] ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}`}
      style={{ color: gc.color, backgroundColor: `color-mix(in srgb, ${gc.color} 12%, transparent)` }}
    >
      {p?.emoji} {code}
    </span>
  );
}
