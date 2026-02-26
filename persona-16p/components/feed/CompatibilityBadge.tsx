"use client";

interface CompatibilityBadgeProps {
  score: number;
  emoji: string;
}

export default function CompatibilityBadge({ score, emoji }: CompatibilityBadgeProps) {
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-purple)] bg-[var(--color-purple-light)] px-2 py-0.5 rounded-[var(--radius-pill)]">
      {emoji} {score}%
    </span>
  );
}
