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
}

interface Blob {
  x: number;
  y: number;
  r: number;
  angle: number;
  speed: number;
  baseR: number;
  colorIdx: number;
  vx: number;
  vy: number;
  phase: number;
}

const THEMES: Record<string, { r: number; g: number; b: number }[]> = {
  purple: [
    { r: 138, g: 43, b: 226 },
    { r: 218, g: 112, b: 214 },
    { r: 75, g: 0, b: 130 },
    { r: 147, g: 0, b: 211 },
    { r: 180, g: 60, b: 200 },
  ],
  ocean: [
    { r: 0, g: 150, b: 200 },
    { r: 0, g: 200, b: 180 },
    { r: 30, g: 100, b: 220 },
    { r: 0, g: 180, b: 220 },
    { r: 50, g: 130, b: 200 },
  ],
  sunset: [
    { r: 255, g: 100, b: 50 },
    { r: 255, g: 50, b: 100 },
    { r: 200, g: 50, b: 80 },
    { r: 255, g: 150, b: 50 },
    { r: 220, g: 80, b: 120 },
  ],
  forest: [
    { r: 50, g: 180, b: 80 },
    { r: 80, g: 200, b: 60 },
    { r: 30, g: 150, b: 70 },
    { r: 100, g: 180, b: 50 },
    { r: 60, g: 160, b: 90 },
  ],
  neon: [
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 100, b: 200 },
    { r: 100, g: 255, b: 100 },
  ],
};

// Spicy Lyrics-inspired: slowly rotating background gradient
function drawRotatingGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  colors: { r: number; g: number; b: number }[],
  audioOverall: number
) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const rotation = time * 0.02; // Slow rotation like --bg-rotation-degree: 258deg
  const scale = 1.25 + audioOverall * 0.15; // scale: 1.25 + audio reactivity

  const diag = Math.sqrt(w * w + h * h) * scale;

  // Create a large conic-like effect using multiple radial gradients
  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    const angle = rotation + (i / colors.length) * Math.PI * 2;
    const gx = cx + Math.cos(angle) * diag * 0.3;
    const gy = cy + Math.sin(angle) * diag * 0.3;

    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, diag * 0.6);
    grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.18)`);
    grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.06)`);
    grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

// Smooth 3-octave noise for organic distortion
function smoothNoise(x: number, y: number, t: number) {
  return (
    Math.sin(x * 1.7 + t * 0.8) * Math.cos(y * 2.3 + t * 0.6) * 0.5 +
    Math.sin(x * 3.1 + t * 1.2) * Math.cos(y * 4.7 + t * 0.9) * 0.25 +
    Math.sin(x * 6.3 + t * 1.8) * Math.cos(y * 5.1 + t * 1.4) * 0.125
  );
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
  });
  const startTimeRef = useRef(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const settingsRef = useRef(useSettings().settings);

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
      };
    } catch {
      // Audio not available
    }
  }, []);

  const getAudioValues = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.analyser || !audio.dataArray) {
      return { bass: 0, mid: 0, high: 0, overall: 0, tempo: 120 };
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

    // Estimate tempo from bass rhythmic patterns
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

    return { bass, mid, high, overall, tempo };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize blobs
    const initBlobs = (count: number) => {
      const blobs: Blob[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        blobs.push({
          x: 0.5 + Math.cos(angle) * 0.3,
          y: 0.5 + Math.sin(angle) * 0.3,
          r: 0.12,
          angle: angle,
          speed: 0.08 + Math.random() * 0.04,
          baseR: 0.10 + Math.random() * 0.03,
          colorIdx: i % 5,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
      blobsRef.current = blobs;
    };
    initBlobs(settings.liquid.blobCount);

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
      const audio = s.liquid.audioReactive ? getAudioValues() : { bass: 0, mid: 0, high: 0, overall: 0, tempo: 120 };
      const w = canvas.width;
      const h = canvas.height;
      const blobs = blobsRef.current;
      const colors = THEMES[s.liquid.colorTheme] || THEMES.purple;
      const speed = s.liquid.speed;
      const intensity = s.liquid.intensity;

      // === BASE BACKGROUND: Dark base like Spotify ===
      ctx.fillStyle = "#06030a";
      ctx.fillRect(0, 0, w, h);

      // === ROTATING COLOR GRADIENT (Spicy Lyrics style) ===
      // Slow animated gradient that rotates over time
      const rotationSpeed = 0.015 * speed * (audio.tempo / 120);
      const rotTime = time * rotationSpeed;

      // Large soft color washes
      for (let i = 0; i < colors.length; i++) {
        const c = colors[i];
        const angle = rotTime + (i / colors.length) * Math.PI * 2;
        const dist = Math.min(w, h) * 0.45;
        const gx = w * 0.5 + Math.cos(angle) * dist;
        const gy = h * 0.5 + Math.sin(angle) * dist;
        const r = Math.min(w, h) * 0.8 * (1 + audio.overall * 0.3);

        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        const alpha = 0.15 * intensity + audio.overall * 0.08;
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`);
        grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Re-init blobs if count changed
      if (blobs.length !== s.liquid.blobCount) {
        const newBlobs: Blob[] = [];
        for (let i = 0; i < s.liquid.blobCount; i++) {
          const angle = (i / s.liquid.blobCount) * Math.PI * 2;
          const existing = blobs[i];
          newBlobs.push({
            x: existing ? existing.x : 0.5 + Math.cos(angle) * 0.3,
            y: existing ? existing.y : 0.5 + Math.sin(angle) * 0.3,
            r: 0.12,
            angle: angle,
            speed: 0.08 + Math.random() * 0.04,
            baseR: 0.10 + Math.random() * 0.03,
            colorIdx: i % colors.length,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
        blobsRef.current = newBlobs;
      }

      // Update blob positions with organic noise
      blobsRef.current.forEach((blob, i) => {
        const t = time * blob.speed * speed * 3.0;
        blob.angle = (i / blobs.length) * Math.PI * 2 + t * 0.5;
        const orbitR = 0.30 + 0.10 * Math.sin(t * 0.35 + i);
        blob.x = 0.5 + Math.cos(blob.angle) * orbitR;
        blob.y = 0.5 + Math.sin(blob.angle) * orbitR;

        // Spicy Lyrics-inspired smooth noise distortion
        const n1 = smoothNoise(blob.x * 4 + i, blob.y * 4, time * 0.3);
        const n2 = smoothNoise(blob.x * 6 + 100, blob.y * 6 + 50, time * 0.2);
        blob.x += n1 * 0.08 + n2 * 0.04;
        blob.y += n1 * 0.06 - n2 * 0.03;

        // Audio expansion
        blob.r = blob.baseR * intensity + audio.bass * 0.08 * intensity;

        // Mouse repulsion
        if (s.liquid.mouseReactive) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const dx = blob.x - mx;
          const dy = blob.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0.01 && dist < 0.4) {
            const push = 0.06 / (dist + 0.15);
            blob.x += (dx / dist) * push;
            blob.y += (dy / dist) * push;
          }
        }
      });

      // === GLOW LAYERS (Spicy Lyrics saturation + brightness) ===
      // Outer glow — very large, very soft (simulates blur passes)
      ctx.globalCompositeOperation = "screen";
      for (const blob of blobs) {
        const c = colors[blob.colorIdx % colors.length];
        const x = blob.x * w;
        const y = blob.y * h;
        const r = blob.r * Math.min(w, h) * 3.0;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.08)`);
        grad.addColorStop(0.3, `rgba(${c.r}, ${c.g}, ${c.b}, 0.03)`);
        grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // Middle glow
      for (const blob of blobs) {
        const c = colors[blob.colorIdx % colors.length];
        const x = blob.x * w;
        const y = blob.y * h;
        const r = blob.r * Math.min(w, h) * 1.8;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.20)`);
        grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.06)`);
        grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // Inner core — bright center
      for (const blob of blobs) {
        const c = colors[blob.colorIdx % colors.length];
        const x = blob.x * w;
        const y = blob.y * h;
        const r = blob.r * Math.min(w, h) * 0.9;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`);
        grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.2)`);
        grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      ctx.globalCompositeOperation = "source-over";

      // === COLOR SATURATION BOOST (Spicy Lyrics: saturate(2.5)) ===
      // Apply a subtle global color overlay to boost saturation
      const avgR = colors.reduce((a, c) => a + c.r, 0) / colors.length;
      const avgG = colors.reduce((a, c) => a + c.g, 0) / colors.length;
      const avgB = colors.reduce((a, c) => a + c.b, 0) / colors.length;
      ctx.fillStyle = `rgba(${avgR}, ${avgG}, ${avgB}, 0.03)`;
      ctx.globalCompositeOperation = "saturation";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // === FILM GRAIN ===
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

      // === VIGNETTE ===
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

      // === BRIGHTNESS OVERLAY (Spicy Lyrics: brightness(0.65)) ===
      // Subtle darkening to keep things moody
      ctx.fillStyle = `rgba(2, 1, 6, 0.15)`;
      ctx.fillRect(0, 0, w, h);

      // === AUDIO BRIGHTNESS PULSE ===
      if (s.liquid.audioReactive && audio.overall > 0.05) {
        const c = colors[0];
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${audio.overall * 0.06})`;
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
  }, [getAudioValues, setupAudio, settings.liquid.audioReactive, settings.liquid.blobCount, settings.liquid.colorTheme, settings.liquid.grain, settings.liquid.intensity, settings.liquid.mouseReactive, settings.liquid.speed, settings.liquid.vignette]);

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
      }}
    />
  );
}
