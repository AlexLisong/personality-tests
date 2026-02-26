"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/i18n";
import AuthGuard from "@/components/AuthGuard";
import TopBar from "@/components/layout/TopBar";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { CourseData, Course } from "@/lib/types";

export default function AdminCoursesPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    seriesId: "",
    title: "",
    titleZh: "",
    description: "",
    descriptionZh: "",
    instructor: "",
    instructorZh: "",
    duration: "45 min",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.role !== "founder") {
      router.push("/");
      return;
    }
    fetch("/api/courses").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, [user, router]);

  const handleCreate = async () => {
    if (!form.title || !form.seriesId) return;
    setSaving(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ seriesId: "", title: "", titleZh: "", description: "", descriptionZh: "", instructor: "", instructorZh: "", duration: "45 min" });
      const refreshed = await fetch("/api/courses").then((r) => r.json());
      setData(refreshed);
    }
    setSaving(false);
  };

  const handleDelete = async (courseId: string) => {
    const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) {
      const refreshed = await fetch("/api/courses").then((r) => r.json());
      setData(refreshed);
    }
  };

  return (
    <AuthGuard>
      <TopBar
        title={t("Manage Courses", "管理课程")}
        showBack
        action={
          <button onClick={() => setShowForm(!showForm)} className="text-sm font-medium text-[var(--color-purple)]">
            {showForm ? "✕" : "+"}
          </button>
        }
      />
      <main className="px-4 py-6">
        {loading && <div className="py-16"><LoadingSpinner /></div>}

        {showForm && data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-[var(--color-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4 mb-6 space-y-3"
          >
            <select
              value={form.seriesId}
              onChange={(e) => setForm({ ...form, seriesId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
            >
              <option value="">{t("Select series", "选择系列")}</option>
              {data.series.map((s) => (
                <option key={s.id} value={s.id}>{t(s.name, s.nameZh)}</option>
              ))}
            </select>
            <Input label={t("Title (EN)", "标题（英文）")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label={t("Title (ZH)", "标题（中文）")} value={form.titleZh} onChange={(e) => setForm({ ...form, titleZh: e.target.value })} />
            <Textarea label={t("Description (EN)", "描述（英文）")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label={t("Description (ZH)", "描述（中文）")} value={form.descriptionZh} onChange={(e) => setForm({ ...form, descriptionZh: e.target.value })} />
            <Input label={t("Instructor (EN)", "讲师（英文）")} value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
            <Input label={t("Instructor (ZH)", "讲师（中文）")} value={form.instructorZh} onChange={(e) => setForm({ ...form, instructorZh: e.target.value })} />
            <Input label={t("Duration", "时长")} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <Button onClick={handleCreate} loading={saving} fullWidth>{t("Create Course", "创建课程")}</Button>
          </motion.div>
        )}

        {data?.series.map((series) => {
          const courses = data.courses.filter((c) => c.seriesId === series.id).sort((a, b) => a.order - b.order);
          return (
            <section key={series.id} className="mb-6">
              <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[var(--color-text)] mb-3">
                {t(series.name, series.nameZh)} ({courses.length})
              </h2>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-2 bg-[var(--color-bg-soft)] rounded-[var(--radius-md)] p-3">
                    <span className="text-xs font-medium text-[var(--color-text-muted)] w-6">#{course.order}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">{t(course.title, course.titleZh)}</p>
                      <p className="text-xs text-[var(--color-text-dim)]">{course.duration}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-xs text-red-500 hover:text-red-700 px-2"
                    >
                      {t("Delete", "删除")}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </AuthGuard>
  );
}
