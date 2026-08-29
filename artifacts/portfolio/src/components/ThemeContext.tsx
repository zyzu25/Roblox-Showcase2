import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "black" | "white" | "red";

interface ThemeCtxValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "black",
  setTheme: () => {},
});

function readTheme(): Theme {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored === "white" || stored === "red") return stored;
  }
  return "black";
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

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
