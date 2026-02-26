"use client";

interface AvatarProps {
  emoji: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-base",
  md: "w-10 h-10 text-lg",
  lg: "w-14 h-14 text-2xl",
  xl: "w-20 h-20 text-4xl",
};

export default function Avatar({ emoji, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full bg-[var(--color-bg-soft)] border border-[var(--color-border-light)] flex items-center justify-center flex-shrink-0 ${className}`}
    >
      {emoji}
    </div>
  );
}
