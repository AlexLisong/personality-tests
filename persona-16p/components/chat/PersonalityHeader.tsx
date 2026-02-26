"use client";

import Avatar from "@/components/ui/Avatar";
import PersonalityBadge from "@/components/profile/PersonalityBadge";
import type { PublicUser } from "@/lib/types";

interface PersonalityHeaderProps {
  user: PublicUser;
}

export default function PersonalityHeader({ user }: PersonalityHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar emoji={user.avatar} size="sm" />
      <span className="text-sm font-semibold text-[var(--color-text)]">{user.displayName}</span>
      {user.personalityCode && <PersonalityBadge code={user.personalityCode} size="sm" />}
    </div>
  );
}
