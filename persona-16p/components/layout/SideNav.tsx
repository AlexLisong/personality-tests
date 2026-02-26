"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "@/components/profile/PersonalityBadge";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  labelZh: string;
}

const items: NavItem[] = [
  { href: "/", icon: "🏠", label: "Home", labelZh: "首页" },
  { href: "/feed", icon: "📢", label: "Feed", labelZh: "动态" },
  { href: "/chat", icon: "💬", label: "Chat", labelZh: "消息" },
  { href: "/courses", icon: "📚", label: "Courses", labelZh: "课程" },
  { href: "/profile", icon: "👤", label: "Profile", labelZh: "我的" },
];

export default function SideNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLang();
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

  if (!user) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen">
      {/* User mini-card */}
      <Link href="/profile" className="flex items-center gap-3 p-5 hover:bg-[var(--color-bg-soft)] transition-colors">
        <Avatar emoji={user.avatar} size="md" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--color-text)] truncate">{user.displayName}</p>
          {user.personalityCode && <PersonalityBadge code={user.personalityCode} size="sm" />}
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-lg)] text-sm transition-colors relative ${
                active
                  ? "bg-[var(--color-purple)]/10 text-[var(--color-purple)] font-bold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:rounded-full before:bg-[var(--color-purple)]"
                  : "text-[var(--color-text-mid)] hover:bg-[var(--color-bg-soft)]"
              }`}
            >
              <span className={`text-lg ${active ? "" : "grayscale opacity-60"}`}>{item.icon}</span>
              <span>{t(item.label, item.labelZh)}</span>
              {item.href === "/chat" && unread > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-[var(--color-border-light)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-[var(--radius-lg)] text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg-soft)] transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>{t("Sign Out", "退出登录")}</span>
        </button>
      </div>
    </aside>
  );
}
