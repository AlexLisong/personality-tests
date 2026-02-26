"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import BottomNav from "./BottomNav";

const FULL_SCREEN_ROUTES = ["/login", "/register", "/test"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const showNav = user && !isFullScreen;

  return (
    <>
      <div className={showNav ? "pb-16" : ""}>{children}</div>
      {showNav && <BottomNav />}
    </>
  );
}
