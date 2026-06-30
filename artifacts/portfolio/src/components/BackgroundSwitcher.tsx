import { useAnimation } from "./AnimationContext";
import { GlobalBackground } from "./GlobalBackground";
import { FireBackground } from "./FireBackground";
import { MixBackground } from "./MixBackground";

export function BackgroundSwitcher() {
  const { animation } = useAnimation();
  if (animation === "fire") return <FireBackground />;
  if (animation === "mix")  return <MixBackground />;
  return <GlobalBackground />;
}
