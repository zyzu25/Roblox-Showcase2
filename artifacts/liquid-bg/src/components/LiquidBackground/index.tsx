import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";

interface AudioState {
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  bass: number;
  mid: number;
  high: number;
  overall: number;
  tempo: number;
  beatPulse: number;
}

// === KAWARP CONSTANTS (from Spicy Lyrics) ===
const KAWARP_BASE_SPEED = 0.1;         // animationSpeed: 0.1
const KAWARP_SATURATION = 2.5;         // filter: saturate(2.5)
const KAWARP_BRIGHTNESS = 0.65;        // filter: brightness(0.65)
const KAWARP_SCALE = 1.25;             // scale: 1.25
const KAWARP_WARP_INTENSITY = 1.0;     // warpIntensity: 1
const KAWARP_BLUR_PASSES = 8;          // blurPasses: 8
const KAWARP_DITHERING = 0.008;        // dithering: 0.008
const KAWARP_TRANSITION = 500;         // transitionDuration: 500ms
const BASE_TEMPO = 120.0;
const BEAT_PULSE_MAX = 1.5;
const BEAT_PULSE_DECAY = 5.0;

const THEMES: Record<string, { r: number; g: number; b: number }[]> = {
  purple: [
    { r: 138, g: 43, b: 226 },
    { r: 218, g: 112, b: 214 },
    { r: 75, g: 0, b: 130 },
    { r: 147, g: 0, b: 211 },
    { r: 180, g: 60, b: 200 },
    { r: 90, g: 20, b: 180 },
  ],
  ocean: [
    { r: 0, g: 150, b: 200 },
    { r: 0, g: 200, b: 180 },
    { r: 30, g: 100, b: 220 },
    { r: 0, g: 180, b: 220 },
    { r: 50, g: 130, b: 200 },
    { r: 20, g: 80, b: 160 },
  ],
  sunset: [
    { r: 255, g: 100, b: 50 },
    { r: 255, g: 50, b: 100 },
    { r: 200, g: 50, b: 80 },
    { r: 255, g: 150, b: 50 },
    { r: 220, g: 80, b: 120 },
    { r: 180, g: 40, b: 60 },
  ],
  forest: [
    { r: 50, g: 180, b: 80 },
    { r: 80, g: 200, b: 60 },
    { r: 30, g: 150, b: 70 },
    { r: 100, g: 180, b: 50 },
    { r: 60, g: 160, b: 90 },
    { r: 40, g: 120, b: 50 },
  ],
  neon: [
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 100, b: 200 },
    { r: 100, g: 255, b: 100 },
    { r: 255, g: 180, b: 0 },
  ],
};

// === SMOOTH NOISE (multi-octave for organic warping) ===
function smoothNoise(x: number, y: number, t: number) {
  return (
    Math.sin(x * 1.7 + t * 0.8) * Math.cos(y * 2.3 + t * 0.6) * 0.5 +
    Math.sin(x * 3.1 + t * 1.2) * Math.cos(y * 4.7 + t * 0.9) * 0.25 +
    Math.sin(x * 6.3 + t * 1.8) * Math.cos(y * 5.1 + t * 1.4) * 0.125
  );
}

// === BEAT PULSE DECAY (from BackgroundAnimationController) ===
function decayPulse(t: number, decay: number): number {
  return Math.exp(-decay * t);
}

// === GENERATE "ALBUM ART" TEXTURE (procedural cover for Kawarp) ===
function generateCoverArt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: { r: number; g: number; b: number }[],
  time: number,
  intensity: number
) {
  // Clear with dark base (Spotify dark)
  ctx.fillStyle = "#0a0508";
  ctx.fillRect(0, 0, w, h);

  // Draw large soft color blobs like album art
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    const angle = (i / colors.length) * Math.PI * 2 + time * 0.3;
    const dist = Math.min(w, h) * 0.35;
    const cx = w * 0.5 + Math.cos(angle) * dist * 0.6;
    const cy = h * 0.5 + Math.sin(angle) * dist * 0.6;
    const r = Math.min(w, h) * (0.4 + 0.1 * Math.sin(time * 0.7 + i));

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${0.6 * intensity})`);
    grad.addColorStop(0.3, `rgba(${c.r}, ${c.g}, ${c.b}, ${0.3 * intensity})`);
    grad.addColorStop(0.7, `rgba(${c.r}, ${c.g}, ${c.b}, ${0.08 * intensity})`);
    grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Add some secondary detail blobs
  for (let i = 0; i < 3; i++) {
    const c = colors[(i + 3) % colors.length];
    const angle = time * 0.2 + i * 2.1;
    const dist = Math.min(w, h) * 0.25;
    const cx = w * 0.5 + Math.cos(angle) * dist;
    const cy = h * 0.5 + Math.sin(angle) * dist;
    const r = Math.min(w, h) * 0.2;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${0.25 * intensity})`);
    grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const audioRef = useRef<AudioState>({
    analyser: null,
    dataArray: null,
    bass: 0,
    mid: 0,
    high: 0,
    overall: 0,
    tempo: 120,
    beatPulse: 0,
  });
  const startTimeRef = useRef(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const settingsRef = useRef(useSettings().settings);
  const coverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevBeatTimeRef = useRef(0);
  const beatPulseRef = useRef(0);

  const { settings } = useSettings();
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const setupAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      audioRef.current = {
        analyser,
        dataArray: new Uint8Array(bufferLength),
        bass: 0,
        mid: 0,
        high: 0,
        overall: 0,
        tempo: 120,
        beatPulse: 0,
      };
    } catch {
      // Audio not available
    }
  }, []);

  const getAudioValues = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio.analyser || !audio.dataArray) {
      return { bass: 0, mid: 0, high: 0, overall: 0, tempo: 120, beatPulse: 0 };
    }
    audio.analyser.getByteFrequencyData(audio.dataArray as any);
    const len = audio.dataArray.length;
    const bassEnd = Math.floor(len * 0.1);
    const midEnd = Math.floor(len * 0.5);

    let bassSum = 0;
    for (let i = 0; i < bassEnd; i++) bassSum += audio.dataArray[i];
    const bass = (bassSum / bassEnd / 255) * 1.5;

    let midSum = 0;
    for (let i = bassEnd; i < midEnd; i++) midSum += audio.dataArray[i];
    const mid = (midSum / (midEnd - bassEnd) / 255) * 1.2;

    let highSum = 0;
    for (let i = midEnd; i < len; i++) highSum += audio.dataArray[i];
    const high = (highSum / (len - midEnd) / 255) * 1.0;

    let overallSum = 0;
    for (let i = 0; i < len; i++) overallSum += audio.dataArray[i];
    const overall = (overallSum / len / 255) * 1.0;

    // Beat detection for pulse
    let beatDetected = false;
    if (bass > 0.5) {
      const now = time;
      if (now - prevBeatTimeRef.current > 0.3) {
        beatDetected = true;
        prevBeatTimeRef.current = now;
      }
    }

    if (beatDetected) {
      beatPulseRef.current = BEAT_PULSE_MAX;
    } else {
      beatPulseRef.current = Math.max(0, beatPulseRef.current * decayPulse(0.016, BEAT_PULSE_DECAY));
    }

    // Estimate tempo
    let beatEnergy = 0;
    for (let i = 2; i < bassEnd; i++) {
      beatEnergy += Math.abs(audio.dataArray[i] - audio.dataArray[i - 1]);
    }
    const tempo = 60 + beatEnergy * 0.5;

    audioRef.current.bass = bass;
    audioRef.current.mid = mid;
    audioRef.current.high = high;
    audioRef.current.overall = overall;
    audioRef.current.tempo = tempo;
    audioRef.current.beatPulse = beatPulseRef.current;

    return { bass, mid, high, overall, tempo, beatPulse: beatPulseRef.current };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen cover art canvas (the "album art" Kawarp warps)
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 512;
    coverCanvas.height = 512;
    coverCanvasRef.current = coverCanvas;

    // Resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    requestAnimationFrame(resize);
    window.addEventListener("resize", resize);

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = () => {
      const s = settingsRef.current;
      const time = (Date.now() - startTimeRef.current) / 1000;
      const colors = THEMES[s.liquid.colorTheme] || THEMES.purple;
      const speed = s.liquid.speed;
      const intensity = s.liquid.intensity;
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w * 0.5;
      const centerY = h * 0.5;

      // Audio analysis
      const audio = s.liquid.audioReactive
        ? getAudioValues(time)
        : { bass: 0, mid: 0, high: 0, overall: 0, tempo: 120, beatPulse: 0 };

      // === KAWARP SPEED MULTIPLIER (from BackgroundAnimationController) ===
      const tempoMultiplier = audio.tempo / BASE_TEMPO;
      const loudnessMultiplier = 0.5 + Math.max(0, (audio.bass * 10 - 40) / 40) * 0.7;
      let speedMultiplier = tempoMultiplier * loudnessMultiplier;
      speedMultiplier += audio.beatPulse * 0.5;
      speedMultiplier = Math.max(0.1, Math.min(speedMultiplier, 3.0));

      // === BASE ANIMATION SPEED ===
      const animTime = time * KAWARP_BASE_SPEED * speed * speedMultiplier;

      // === STEP 1: GENERATE COVER ART ===
      const coverCtx = coverCanvas.getContext("2d")!;
      generateCoverArt(coverCtx, 512, 512, colors, animTime, intensity);

      // === STEP 2: CLEAR WITH DARK BASE ===
      ctx.fillStyle = "#06030a";
      ctx.fillRect(0, 0, w, h);

      // === STEP 3: KAWARP WARP + BLUR PASSES ===
      // Simulate Kawarp: draw the cover art multiple times with slight offsets,
      // scaling, and blending to create the blur+warp effect
      ctx.save();

      // Scale by 1.25x as per CSS
      ctx.translate(centerX, centerY);
      ctx.scale(KAWARP_SCALE, KAWARP_SCALE);
      ctx.translate(-centerX, -centerY);

      // Warp displacement using noise
      const warpX = smoothNoise(animTime * 0.5, 0, animTime) * KAWARP_WARP_INTENSITY * 30;
      const warpY = smoothNoise(0, animTime * 0.5, animTime) * KAWARP_WARP_INTENSITY * 30;
      const rot = smoothNoise(animTime * 0.2, animTime * 0.3, 0) * 0.02;

      // Multiple blur passes (8 passes like Kawarp)
      // Each pass draws the cover art at slightly different positions/scales with low opacity
      const passes = s.reducedMotion ? 4 : KAWARP_BLUR_PASSES;

      for (let pass = 0; pass < passes; pass++) {
        const pTime = animTime + pass * 0.5;
        const pScale = 1.0 + pass * 0.06;
        const pAlpha = 0.12 / (pass + 1);
        const pWarpX = smoothNoise(pTime * 0.3, pass, 0) * 20;
        const pWarpY = smoothNoise(pass, pTime * 0.3, 0) * 20;
        const pRot = smoothNoise(pTime * 0.1, pass * 0.2, 0) * 0.01;

        ctx.save();
        ctx.globalAlpha = pAlpha;
        ctx.globalCompositeOperation = "screen";
        ctx.translate(centerX + pWarpX + warpX, centerY + pWarpY + warpY);
        ctx.rotate(rot + pRot);
        ctx.translate(-centerX, -centerY);
        ctx.drawImage(
          coverCanvas,
          centerX - (w * 0.5 * pScale),
          centerY - (h * 0.5 * pScale),
          w * pScale,
          h * pScale
        );
        ctx.restore();
      }

      // === STEP 4: MAIN COVER ART (sharper layer on top) ===
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.globalCompositeOperation = "lighter";
      ctx.translate(centerX + warpX * 0.5, centerY + warpY * 0.5);
      ctx.rotate(rot * 0.5);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(coverCanvas, 0, 0, w, h);
      ctx.restore();

      ctx.restore(); // End scale transform

      // === STEP 5: SATURATION BOOST (Kawarp saturation: 1.5 * CSS saturate: 2.5) ===
      const avgR = colors.reduce((a, c) => a + c.r, 0) / colors.length;
      const avgG = colors.reduce((a, c) => a + c.g, 0) / colors.length;
      const avgB = colors.reduce((a, c) => a + c.b, 0) / colors.length;
      ctx.fillStyle = `rgba(${avgR}, ${avgG}, ${avgB}, 0.04)`;
      ctx.globalCompositeOperation = "saturation";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // === STEP 6: BRIGHTNESS REDUCTION (CSS brightness(0.65)) ===
      ctx.fillStyle = `rgba(2, 1, 6, ${1 - KAWARP_BRIGHTNESS})`;
      ctx.fillRect(0, 0, w, h);

      // === STEP 7: DITHERING (Kawarp dithering: 0.008) ===
      if (KAWARP_DITHERING > 0) {
        const ditherCanvas = document.createElement("canvas");
        ditherCanvas.width = 128;
        ditherCanvas.height = 128;
        const dctx = ditherCanvas.getContext("2d")!;
        const dData = dctx.createImageData(128, 128);
        for (let i = 0; i < dData.data.length; i += 4) {
          const v = (Math.random() - 0.5) * 255 * KAWARP_DITHERING * 20;
          dData.data[i] = v;
          dData.data[i + 1] = v;
          dData.data[i + 2] = v;
          dData.data[i + 3] = 6;
        }
        dctx.putImageData(dData, 0, 0);
        ctx.fillStyle = ctx.createPattern(ditherCanvas, "repeat")!;
        ctx.fillRect(0, 0, w, h);
      }

      // === STEP 8: AUDIO PULSE BRIGHTNESS ===
      if (s.liquid.audioReactive && audio.overall > 0.05) {
        const c = colors[0];
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${audio.overall * 0.04})`;
        ctx.fillRect(0, 0, w, h);
      }

      // === STEP 9: FILM GRAIN ===
      if (s.liquid.grain) {
        const grainCanvas = document.createElement("canvas");
        grainCanvas.width = 256;
        grainCanvas.height = 256;
        const gctx = grainCanvas.getContext("2d")!;
        const gData = gctx.createImageData(256, 256);
        for (let i = 0; i < gData.data.length; i += 4) {
          const v = Math.random() * 15;
          gData.data[i] = v;
          gData.data[i + 1] = v;
          gData.data[i + 2] = v;
          gData.data[i + 3] = 8;
        }
        gctx.putImageData(gData, 0, 0);
        ctx.fillStyle = ctx.createPattern(grainCanvas, "repeat")!;
        ctx.fillRect(0, 0, w, h);
      }

      // === STEP 10: VIGNETTE ===
      if (s.liquid.vignette) {
        const vigGrad = ctx.createRadialGradient(
          w * 0.5, h * 0.5, 0,
          w * 0.5, h * 0.5, Math.max(w, h) * 0.7
        );
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(0.5, "rgba(0,0,0,0.1)");
        vigGrad.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // === STEP 11: MOUSE INTERACTION ===
      if (s.liquid.mouseReactive) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mGrad = ctx.createRadialGradient(
          mx * w, my * h, 0,
          mx * w, my * h, Math.min(w, h) * 0.3
        );
        mGrad.addColorStop(0, `rgba(255,255,255,0.02)`);
        mGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = mGrad;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onClick = () => {
      setupAudio();
      window.removeEventListener("click", onClick);
    };
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [getAudioValues, setupAudio, settings.liquid.audioReactive, settings.liquid.colorTheme, settings.liquid.grain, settings.liquid.intensity, settings.liquid.mouseReactive, settings.reducedMotion, settings.liquid.speed, settings.liquid.vignette]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        filter: `saturate(${KAWARP_SATURATION}) brightness(${KAWARP_BRIGHTNESS})`,
      }}
    />
  );
}
