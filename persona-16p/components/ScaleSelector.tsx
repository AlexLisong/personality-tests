"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface ScaleSelectorProps {
  selectedValue?: number;
  onSelect: (value: number) => void;
  color: string;
}

// 7-point scale: -3 to +3 (like 16personalities circles)
const points = [-3, -2, -1, 0, 1, 2, 3];
const sizes = [44, 38, 32, 28, 32, 38, 44]; // Outer circles larger, middle smallest

export default function ScaleSelector({ selectedValue, onSelect, color }: ScaleSelectorProps) {
  const { t } = useLang();

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto gap-2">
      <span className="text-sm font-semibold shrink-0 w-16 text-right" style={{ color }}>
        {t("Agree", "同意")}
      </span>

      <div className="flex items-center gap-3">
        {points.map((val, i) => {
          const size = sizes[i];
          const isSelected = selectedValue === val;
          const isPositive = val < 0; // Left side = agree

          return (
            <motion.button
              key={val}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(val)}
              className="scale-circle relative rounded-full border-2 flex items-center justify-center"
              style={{
                width: size,
                height: size,
                borderColor: isSelected ? color : "var(--color-border)",
                backgroundColor: isSelected ? color : "transparent",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.15 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <span className="text-sm font-semibold shrink-0 w-16 text-[var(--color-text-muted)]">
        {t("Disagree", "不同意")}
      </span>
    </div>
  );
}
