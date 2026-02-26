"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import BottomNav from "./BottomNav";
import SideNav from "./SideNav";
import RightSidebar from "./RightSidebar";

const FULL_SCREEN_ROUTES = ["/login", "/register", "/test"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const showNav = user && !isFullScreen;

  if (!showNav) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="lg:max-w-7xl lg:mx-auto lg:flex">
        <SideNav />
        <main className="flex-1 min-w-0 lg:border-l xl:border-r lg:border-[var(--color-border-light)]">
          <div className="pb-16 lg:pb-0">{children}</div>
        </main>
        <RightSidebar />
      </div>
      <BottomNav />
    </>
  );
}
