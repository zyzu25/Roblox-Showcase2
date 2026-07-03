import { useAnimation } from "./AnimationContext";
import { GlobalBackground } from "./GlobalBackground";
import { FireBackground } from "./FireBackground";
import { SeaBackground } from "./SeaBackground";
import { WaterfallBackground } from "./WaterfallBackground";

export function BackgroundSwitcher() {
  const { animation } = useAnimation();
  if (animation === "fire")      return <FireBackground />;
  if (animation === "sea")       return <SeaBackground />;
  if (animation === "waterfall") return <WaterfallBackground />;
  return <GlobalBackground />;
}
