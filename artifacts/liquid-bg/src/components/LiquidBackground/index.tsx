import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";

interface AudioState {
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  bass: number;
  mid: number;
  high: number;
  overall: number;
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
  });
  const startTimeRef = useRef(Date.now());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const settingsRef = useRef(useSettings().settings);

  // Keep settings ref in sync
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
      };
    } catch {
      // Audio not available
    }
  }, []);

  const getAudioValues = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.analyser || !audio.dataArray) {
      return { bass: 0, mid: 0, high: 0, overall: 0 };
    }
    audio.analyser.getByteFrequencyData(audio.dataArray);
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

    audioRef.current.bass = bass;
    audioRef.current.mid = mid;
    audioRef.current.high = high;
    audioRef.current.overall = overall;

    return { bass, mid, high, overall };
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

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Noise helper
    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 3.7 + t) * Math.cos(y * 5.3 + t * 0.7) * 0.5 +
             Math.sin(x * 7.1 + t * 1.3) * Math.cos(y * 2.9 + t * 0.5) * 0.25;
    };

    // Animation loop
    const animate = () => {
      const s = settingsRef.current;
      const time = (Date.now() - startTimeRef.current) / 1000;
      const audio = s.liquid.audioReactive ? getAudioValues() : { bass: 0, mid: 0, high: 0, overall: 0 };
      const w = canvas.width;
      const h = canvas.height;
      const blobs = blobsRef.current;
      const colors = THEMES[s.liquid.colorTheme] || THEMES.purple;
      const speed = s.liquid.speed;
      const intensity = s.liquid.intensity;

      // Clear
      ctx.fillStyle = "#05020a";
      ctx.fillRect(0, 0, w, h);

      // Re-initialize blobs if count changed
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
          });
        }
        blobsRef.current = newBlobs;
      }

      // Update blob positions
      blobsRef.current.forEach((blob, i) => {
        const t = time * blob.speed * speed * 3.0;
        blob.angle = (i / blobs.length) * Math.PI * 2 + t * 0.5;
        const orbitR = 0.30 + 0.10 * Math.sin(t * 0.35 + i);
        blob.x = 0.5 + Math.cos(blob.angle) * orbitR;
        blob.y = 0.5 + Math.sin(blob.angle) * orbitR;

        // Noise offset
        blob.x += noise(i * 3.7, time * 0.25, 0) * 0.12;
        blob.y += noise(i * 5.3 + 100, time * 0.25, 0) * 0.12;

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

      // Draw glow layer (metaball-like with distance field)
      const drawMetaballField = () => {
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        const scale = Math.min(w, h);

        for (let py = 0; py < h; py += 2) {
          for (let px = 0; px < w; px += 2) {
            const ux = px / w;
            const uy = py / h;

            let field = 0;
            let rSum = 0, gSum = 0, bSum = 0;

            for (const blob of blobs) {
              const bx = blob.x * w;
              const by = blob.y * h;
              const dx = px - bx;
              const dy = py - by;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const blobR = blob.r * scale;

              const f = (blobR * blobR) / (dist * dist + 0.1);
              field += f;

              const c = colors[blob.colorIdx % colors.length];
              const intensity = f * intensity;
              rSum += c.r * intensity;
              gSum += c.g * intensity;
              bSum += c.b * intensity;
            }

            // Threshold for metaball edge
            const threshold = 0.8;
            const edge = Math.min(1, Math.max(0, (field - threshold) / 0.5));
            const glow = Math.min(1, field / threshold) * 0.3;

            const baseR = 5 * (1 - edge);
            const baseG = 2 * (1 - edge);
            const baseB = 10 * (1 - edge);

            const r = Math.min(255, baseR + rSum * edge + rSum * glow * 0.5);
            const g = Math.min(255, baseG + gSum * edge + gSum * glow * 0.5);
            const b = Math.min(255, baseB + bSum * edge + bSum * glow * 0.5);
            const a = Math.min(255, (edge + glow) * 255);

            // Fill 2x2 block
            for (let dy = 0; dy < 2 && py + dy < h; dy++) {
              for (let dx = 0; dx < 2 && px + dx < w; dx++) {
                const idx = ((py + dy) * w + (px + dx)) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = a;
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      };

      // Use a simpler radial gradient approach for better performance
      // but with multiple overlapping layers for metaball effect
      const drawGlowLayers = () => {
        // Background
        ctx.fillStyle = "#05020a";
        ctx.fillRect(0, 0, w, h);

        // Outer glow (large, soft)
        ctx.globalCompositeOperation = "screen";
        for (const blob of blobs) {
          const c = colors[blob.colorIdx % colors.length];
          const x = blob.x * w;
          const y = blob.y * h;
          const r = blob.r * Math.min(w, h) * 2.5;

          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.12)`);
          grad.addColorStop(0.4, `rgba(${c.r}, ${c.g}, ${c.b}, 0.05)`);
          grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }

        // Middle glow
        for (const blob of blobs) {
          const c = colors[blob.colorIdx % colors.length];
          const x = blob.x * w;
          const y = blob.y * h;
          const r = blob.r * Math.min(w, h) * 1.5;

          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`);
          grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.08)`);
          grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }

        // Inner core
        for (const blob of blobs) {
          const c = colors[blob.colorIdx % colors.length];
          const x = blob.x * w;
          const y = blob.y * h;
          const r = blob.r * Math.min(w, h) * 0.8;

          const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
          grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.7)`);
          grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.3)`);
          grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }

        ctx.globalCompositeOperation = "source-over";
      };

      drawGlowLayers();

      // Film grain
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

      // Vignette
      if (s.liquid.vignette) {
        const vigGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
        vigGrad.addColorStop(0, "rgba(0,0,0,0)");
        vigGrad.addColorStop(0.5, "rgba(0,0,0,0.1)");
        vigGrad.addColorStop(1, "rgba(0,0,0,0.45)");
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Audio brightness boost
      if (s.liquid.audioReactive && audio.overall > 0.05) {
        const c = colors[0];
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${audio.overall * 0.08})`;
        ctx.fillRect(0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Setup audio on first click
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
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
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
