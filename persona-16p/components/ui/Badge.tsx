"use client";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bgColor?: string;
  className?: string;
}

export default function Badge({ children, color, bgColor, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-[var(--radius-pill)] ${className}`}
      style={{
        color: color ?? "var(--color-purple)",
        backgroundColor: bgColor ?? "var(--color-purple-light)",
      }}
    >
      {children}
    </span>
  );
}
