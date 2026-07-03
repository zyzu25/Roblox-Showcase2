import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "purple" | "light" | "dark" | "gold" | "red" | "white";
export type AnimationMode = "liquid" | "fire";

interface ThemeCtxValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  animation: AnimationMode;
  setAnimation: (a: AnimationMode) => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "purple",
  setTheme: () => {},
  animation: "liquid",
  setAnimation: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("portfolio-theme");
      if (s === "purple" || s === "light" || s === "dark" || s === "gold" || s === "red" || s === "white") return s;
    }
    return "purple";
  });

  const [animation, setAnimationState] = useState<AnimationMode>(() => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("portfolio-animation");
      if (s === "liquid" || s === "fire") return s;
    }
    return "liquid";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("portfolio-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const setAnimation = (a: AnimationMode) => {
    setAnimationState(a);
    localStorage.setItem("portfolio-animation", a);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, animation, setAnimation }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
