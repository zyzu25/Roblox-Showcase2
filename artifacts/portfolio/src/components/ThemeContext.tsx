import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "purple" | "light" | "dark" | "gold" | "red" | "white" | "calm";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "purple", setTheme: () => {} });

const VALID_THEMES: Theme[] = ["purple", "light", "dark", "gold", "red", "white", "calm"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-theme");
      if (VALID_THEMES.includes(stored as Theme)) return stored as Theme;
    }
    return "purple";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
