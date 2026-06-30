import { useAnimation } from "./AnimationContext";
import { GlobalBackground } from "./GlobalBackground";
import { FireBackground } from "./FireBackground";
import { MixBackground } from "./MixBackground";
import { SeaBackground } from "./SeaBackground";
import { WaterfallBackground } from "./WaterfallBackground";
import { StormBackground } from "./StormBackground";

export function BackgroundSwitcher() {
  const { animation } = useAnimation();
  if (animation === "fire")      return <FireBackground />;
  if (animation === "mix")       return <MixBackground />;
  if (animation === "sea")       return <SeaBackground />;
  if (animation === "waterfall") return <WaterfallBackground />;
  if (animation === "storm")     return <StormBackground />;
  return <GlobalBackground />;
}
