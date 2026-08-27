import { useAnimation } from "./AnimationContext";
import { GlobalBackground } from "./GlobalBackground";
import { SoftBackground } from "./SoftBackground";

export function BackgroundSwitcher() {
  const { animation } = useAnimation();
  if (animation === "soft") return <SoftBackground />;
  return <GlobalBackground />;
}
