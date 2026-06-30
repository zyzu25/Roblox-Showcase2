import { useEffect, useRef } from "react";

function createBeep(
  ctx: AudioContext,
  freq: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    const getCtx = () => {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      return ctxRef.current;
    };

    const playClick = () => {
      if (!enabledRef.current) return;
      try {
        const ctx = getCtx();
        if (ctx.state === "suspended") ctx.resume();
        createBeep(ctx, 880, 0.08, 0.06, "sine");
      } catch {}
    };

    const playHover = () => {
      if (!enabledRef.current) return;
      try {
        const ctx = getCtx();
        if (ctx.state === "suspended") ctx.resume();
        createBeep(ctx, 1200, 0.04, 0.025, "sine");
      } catch {}
    };

    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest("button") ||
        t.closest("a") ||
        t.tagName === "BUTTON" ||
        t.tagName === "A"
      ) {
        playClick();
      }
    };

    let lastHover: Element | null = null;
    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable: Element | null =
        (t.closest("button") || t.closest("a")) ??
        (t.tagName === "BUTTON" || t.tagName === "A" ? t : null);
      if (clickable && clickable !== lastHover) {
        lastHover = clickable;
        playHover();
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);
}
