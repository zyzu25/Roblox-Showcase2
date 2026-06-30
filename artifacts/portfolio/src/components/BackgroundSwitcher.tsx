import { useAnimation } from "./AnimationContext";
import { GlobalBackground } from "./GlobalBackground";
import { FireBackground } from "./FireBackground";

export function BackgroundSwitcher() {
  const { animation } = useAnimation();
  return animation === "fire" ? <FireBackground /> : <GlobalBackground />;
}
