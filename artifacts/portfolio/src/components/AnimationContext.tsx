import { createContext, useContext, useEffect, useState } from "react";

export type AnimationMode = "ambient" | "smoky";

const AnimationCtx = createContext<{
  animation: AnimationMode;
  setAnimation: (a: AnimationMode) => void;
}>({ animation: "ambient", setAnimation: () => {} });

const VALID: AnimationMode[] = ["ambient", "smoky"];

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animation, setAnimation] = useState<AnimationMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-animation");
      if (VALID.includes(stored as AnimationMode)) return stored as AnimationMode;
    }
    return "ambient";
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
