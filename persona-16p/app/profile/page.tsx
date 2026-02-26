"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import Button from "@/components/ui/Button";

export default function MyProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [editing, setEditing] = useState(false);

  return (
    <AuthGuard>
      <TopBar title={t("My Profile", "我的")} />
      <main className="px-4 py-6">
        {user && !editing && (
          <>
            <ProfileCard user={user} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 space-y-3"
            >
              <Button variant="secondary" fullWidth onClick={() => setEditing(true)}>
                {t("Edit Profile", "编辑资料")}
              </Button>
              {!user.personalityCode && (
                <Link href="/test">
                  <Button fullWidth>{t("Take Personality Test", "参加人格测试")}</Button>
                </Link>
              )}
              {user.role === "founder" && (
                <Link href="/admin/courses">
                  <Button variant="ghost" fullWidth>{t("Manage Courses", "管理课程")}</Button>
                </Link>
              )}
              <Button variant="ghost" fullWidth onClick={logout}>
                {t("Sign Out", "退出登录")}
              </Button>
            </motion.div>
          </>
        )}
        {user && editing && (
          <ProfileEditForm user={user} onDone={() => setEditing(false)} />
        )}
      </main>
    </AuthGuard>
  );
}
