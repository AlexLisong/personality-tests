"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  labelZh: string;
  match: string[];
}

const items: NavItem[] = [
  { href: "/", icon: "🏠", label: "Home", labelZh: "首页", match: ["/"] },
  { href: "/feed", icon: "📢", label: "Feed", labelZh: "动态", match: ["/feed"] },
  { href: "/chat", icon: "💬", label: "Chat", labelZh: "消息", match: ["/chat"] },
  { href: "/courses", icon: "📚", label: "Courses", labelZh: "课程", match: ["/courses"] },
  { href: "/profile", icon: "👤", label: "Me", labelZh: "我的", match: ["/profile"] },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUnread(data.unreadCount ?? 0);
        }
      } catch { /* ignore */ }
    };
    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (item: NavItem) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] border-t border-[var(--color-border-light)] pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 relative">
              <span className={`text-lg ${active ? "" : "grayscale opacity-60"}`}>{item.icon}</span>
              <span className={`text-[10px] font-medium ${active ? "text-[var(--color-purple)]" : "text-[var(--color-text-muted)]"}`}>
                {t(item.label, item.labelZh)}
              </span>
              {item.href === "/chat" && unread > 0 && (
                <span className="absolute -top-1 right-[-6px] w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
