"use client";

import { motion } from "framer-motion";

const AVATARS = [
  "😊", "😎", "🥰", "🤓", "😇", "🦊", "🐱", "🐰",
  "🦋", "🌸", "🌟", "💫", "🎨", "🎭", "🎪", "🚀",
  "🧩", "💎", "🌈", "🦄", "👩‍🏫", "👨‍💻", "👩‍🎨", "🧘‍♀️",
];

interface AvatarPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {AVATARS.map((emoji) => (
        <motion.button
          key={emoji}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(emoji)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
            selected === emoji
              ? "bg-[var(--color-purple-light)] ring-2 ring-[var(--color-purple)]"
              : "bg-[var(--color-bg-soft)] hover:bg-[var(--color-border-light)]"
          }`}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
}
