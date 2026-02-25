"use client";

import { motion } from "framer-motion";

interface OrbProps {
  size?: number;
  mood?: "idle" | "happy" | "thinking";
}

export default function Orb({ size = 120, mood = "idle" }: OrbProps) {
  return (
    <motion.div
      animate={{
        y: mood === "happy" ? [0, -12, 0] : [0, -6, 0],
        scale: mood === "happy" ? [1, 1.1, 1] : 1,
      }}
      transition={{
        y: { duration: mood === "happy" ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.6, repeat: mood === "happy" ? 3 : 0 },
      }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(163,230,53,0.25), rgba(125,211,252,0.15), transparent)" }}
      />
      {/* Mid ring */}
      <div
        className="absolute inset-2 rounded-full blur-md"
        style={{ background: "radial-gradient(circle, rgba(163,230,53,0.4), rgba(167,139,250,0.2), transparent)" }}
      />
      {/* Core */}
      <div
        className="absolute inset-4 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), rgba(163,230,53,0.5), rgba(125,211,252,0.3))",
          boxShadow: "inset 0 0 20px rgba(255,255,255,0.1)",
        }}
      />
      {/* Highlight dot */}
      <div
        className="absolute rounded-full bg-white/50"
        style={{ width: size * 0.12, height: size * 0.12, top: "25%", left: "30%", filter: "blur(2px)" }}
      />

      {/* Face */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl select-none" style={{ fontSize: size * 0.22 }}>
          {mood === "happy" ? "✦" : mood === "thinking" ? "◌" : "·"}
        </span>
      </div>
    </motion.div>
  );
}
