"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.ok) {
      router.push("/feed");
    } else {
      setError(result.error ?? t("Login failed", "登录失败"));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--color-text)]">
            {t("Welcome Back", "欢迎回来")}
          </h1>
          <p className="text-[var(--color-text-dim)] text-sm mt-2">
            {t("Sign in to continue your journey", "登录以继续你的旅程")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("Username", "用户名")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("Enter username", "输入用户名")}
            autoComplete="username"
          />
          <Input
            label={t("Password", "密码")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("Enter password", "输入密码")}
            autoComplete="current-password"
          />

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center">
              {error}
            </motion.p>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {t("Sign In", "登录")}
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--color-text-dim)] mt-6">
          {t("Don't have an account?", "还没有账号？")}{" "}
          <Link href="/register" className="text-[var(--color-purple)] font-medium hover:underline">
            {t("Register", "注册")}
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-[var(--color-text-muted)] hover:underline">
            {t("Back to home", "返回首页")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
