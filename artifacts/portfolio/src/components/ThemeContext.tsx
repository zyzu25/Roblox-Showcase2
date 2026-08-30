import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "purple" | "black" | "red";
const ROTATING_THEMES: Theme[] = ["purple", "black", "red"];
const THEME_ROTATION_MS = 60_000;

interface ThemeCtxValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "purple",
  setTheme: () => {},
});

function readTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored === "purple" || stored === "red" || stored === "black") return stored;
  }
  return "purple";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setThemeState(current => {
        const currentIndex = ROTATING_THEMES.indexOf(current);
        const next = ROTATING_THEMES[(currentIndex + 1) % ROTATING_THEMES.length];
        localStorage.setItem("portfolio-theme", next);
        document.documentElement.setAttribute("data-theme", next);
        return next;
      });
    }, THEME_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
