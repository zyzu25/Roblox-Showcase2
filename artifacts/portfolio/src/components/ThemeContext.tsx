import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "purple" | "light" | "dark" | "gold" | "red" | "white";

const ThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

const VALID_THEMES: Theme[] = ["purple", "light", "dark", "gold", "red", "white"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-theme");
      if (VALID_THEMES.includes(stored as Theme)) return stored as Theme;
    }
    return "dark";
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
