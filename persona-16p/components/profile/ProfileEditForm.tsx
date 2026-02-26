"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import AvatarPicker from "./AvatarPicker";
import type { PublicUser } from "@/lib/types";

interface ProfileEditFormProps {
  user: PublicUser;
  onDone: () => void;
}

export default function ProfileEditForm({ user, onDone }: ProfileEditFormProps) {
  const { t } = useLang();
  const { updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, avatar }),
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        onDone();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-mid)] mb-2">
          {t("Avatar", "头像")}
        </label>
        <AvatarPicker selected={avatar} onSelect={setAvatar} />
      </div>
      <Input
        label={t("Display Name", "昵称")}
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <Textarea
        label={t("Bio", "简介")}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={t("Tell others about yourself...", "介绍一下自己...")}
      />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onDone}>{t("Cancel", "取消")}</Button>
        <Button onClick={handleSave} loading={saving}>{t("Save", "保存")}</Button>
      </div>
    </motion.div>
  );
}
