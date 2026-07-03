import { createContext, useContext, useEffect, useState } from "react";

export type AnimationMode = "liquid" | "fire" | "sea" | "waterfall";

const AnimationCtx = createContext<{
  animation: AnimationMode;
  setAnimation: (a: AnimationMode) => void;
}>({ animation: "liquid", setAnimation: () => {} });

const VALID: AnimationMode[] = ["liquid", "fire", "sea", "waterfall"];

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animation, setAnimation] = useState<AnimationMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-animation");
      if (VALID.includes(stored as AnimationMode)) return stored as AnimationMode;
    }
    return "liquid";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-animation", animation);
  }, [animation]);

  return (
    <AnimationCtx.Provider value={{ animation, setAnimation }}>
      {children}
    </AnimationCtx.Provider>
  );
}

export function useAnimation() {
  return useContext(AnimationCtx);
}
