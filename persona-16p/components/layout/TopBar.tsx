"use client";

import { useRouter } from "next/navigation";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export default function TopBar({ title, showBack = false, action }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border-light)]">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="w-10">
          {showBack && (
            <button onClick={() => router.back()} className="text-[var(--color-text-mid)] text-sm font-medium">
              ←
            </button>
          )}
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)] truncate">
          {title}
        </h1>
        <div className="w-10 flex justify-end">{action}</div>
      </div>
    </header>
  );
}
