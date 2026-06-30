import { createContext, useContext, useEffect, useState } from "react";

type AnimationMode = "liquid" | "fire";

const AnimationCtx = createContext<{
  animation: AnimationMode;
  setAnimation: (a: AnimationMode) => void;
}>({ animation: "liquid", setAnimation: () => {} });

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [animation, setAnimation] = useState<AnimationMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-animation");
      if (stored === "liquid" || stored === "fire") return stored;
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
