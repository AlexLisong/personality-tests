"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeId = "classic" | "tingdaer";

interface ThemeOption {
  id: ThemeId;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  preview: string;
}

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  options: ThemeOption[];
}

const STORAGE_KEY = "tq-theme";

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "classic",
    label: "Classic 16P",
    labelZh: "经典配色",
    description: "Inspired by the original 16personalities palette.",
    descriptionZh: "沿用 16 型人格的经典色板。",
    preview: "linear-gradient(135deg, #88619A, #33A474)",
  },
  {
    id: "tingdaer",
    label: "丁达尔色系",
    labelZh: "丁达尔色系",
    description: "Iridescent blues and teals inspired by the Tyndall light effect.",
    descriptionZh: "源自丁达尔效应的通透蓝绿光泽。",
    preview: "linear-gradient(135deg, #5B6DFF, #1FC6D6)",
  },
];

const ThemeContext = createContext<ThemeContextValue>({
  theme: "classic",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
  options: THEME_OPTIONS,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window === "undefined") return "classic";
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const initial = saved === "tingdaer" ? saved : "classic";
    document.documentElement.dataset.theme = initial;
    return initial;
  });

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, options: THEME_OPTIONS }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
