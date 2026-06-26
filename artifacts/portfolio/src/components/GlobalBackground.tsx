import { useEffect, useRef, useState } from "react";

/* Liquid blob background — organic, mouse-reactive, smooth morphing */
interface Blob {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  targetSize: number;
  phase: number;
  phaseSpeed: number;
  r: number; g: number; b: number;
  alpha: number;
  morph: number;
  morphSpeed: number;
  corner: number;
}

function createBlob(
  cx: number, cy: number, size: number,
  r: number, g: number, b: number, alpha: number,
  phase: number
): Blob {
  return {
    x: cx, y: cy,
    vx: 0, vy: 0,
    size,
    targetSize: size,
    phase,
    phaseSpeed: 0.3 + Math.random() * 0.4,
    r, g, b,
    alpha,
    morph: 0,
    morphSpeed: 0.2 + Math.random() * 0.3,
    corner: Math.random() * 6,
  };
}

function blobPath(cx: number, cy: number, size: number, t: number, morph: number): string {
  // 8-point metaball-like blob shape
  const points = 8;
  const pts: [number, number, number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const dist = size * (
      0.85 +
      0.15 * Math.sin(t + i * 1.7 + morph) +
      0.08 * Math.sin(t * 0.6 + i * 2.3)
    );
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const cpDist = size * 0.35;
    const cpx = cx + Math.cos(angle + 0.15) * cpDist;
    const cpy = cy + Math.sin(angle + 0.15) * cpDist;
    pts.push([x, y, cpx, cpy]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < points; i++) {
    const next = (i + 1) % points;
    d += ` C ${pts[i][2].toFixed(1)} ${pts[i][3].toFixed(1)}, ${pts[next][2].toFixed(1)} ${pts[next][3].toFixed(1)}, ${pts[next][0].toFixed(1)} ${pts[next][1].toFixed(1)}`;
  }
  d += " Z";
  return d;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 });
  const prevMouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const style = getComputedStyle(document.documentElement);
    const getVar = (n: string) => Number.parseInt(style.getPropertyValue(n)) || 0;

    const blobs = [
      createBlob(w * 0.75, h * 0.3, Math.max(w, h) * 0.55, getVar("--c-orb-r"), getVar("--c-orb-g"), getVar("--c-orb-b"), 0.65, 0),
      createBlob(w * 0.3,  h * 0.7, Math.max(w, h) * 0.45, getVar("--c-orb2-r"), getVar("--c-orb2-g"), getVar("--c-orb2-b"), 0.55, 2.5),
      createBlob(w * 0.5,  h * 0.5, Math.max(w, h) * 0.3,  getVar("--c-orb3-r"), getVar("--c-orb3-g"), getVar("--c-orb3-b"), 0.3, 1.8),
      createBlob(w * 0.15, h * 0.8, Math.max(w, h) * 0.2,  getVar("--c-orb4-r"), getVar("--c-orb4-g"), getVar("--c-orb4-b"), 0.2, 4.2),
    ];
    blobsRef.current = blobs;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx: e.clientX - prevMouseRef.current.x,
        vy: e.clientY - prevMouseRef.current.y,
      };
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let t = 0;
    const animate = () => {
      t += 0.012;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mvx = mouseRef.current.vx;
      const mvy = mouseRef.current.vy;

      ctx.clearRect(0, 0, w, h);

      // Base bg
      const baseColor = getComputedStyle(document.documentElement).getPropertyValue("--c-bg").trim();
      ctx.fillStyle = baseColor || "#00000a";
      ctx.fillRect(0, 0, w, h);

      // Glow off-screen canvas for smoother rendering
      const glowCanvas = document.createElement("canvas");
      glowCanvas.width = w;
      glowCanvas.height = h;
      const gCtx = glowCanvas.getContext("2d")!;
      gCtx.fillStyle = baseColor || "#00000a";
      gCtx.fillRect(0, 0, w, h);

      for (let i = 0; i < blobsRef.current.length; i++) {
        const b = blobsRef.current[i];
        const time = t + b.phase;

        // Morph
        b.morph += b.morphSpeed;

        // Mouse interaction (follow with gentle spring + slight velocity)
        const homeX = b.corner === 0 ? w * 0.75 : b.corner === 1 ? w * 0.3 : b.corner === 2 ? w * 0.5 : w * 0.15;
        const homeY = b.corner === 0 ? h * 0.3 : b.corner === 1 ? h * 0.7 : b.corner === 2 ? h * 0.5 : h * 0.8;

        if (mx > 0 && i < 2) {
          const dx = mx - b.x;
          const dy = my - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 500;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 0.6;
            b.vx += (dx / dist) * force * 0.4;
            b.vy += (dy / dist) * force * 0.4;
          }
          // Mouse velocity influence
          b.vx += mvx * 0.02;
          b.vy += mvy * 0.02;
        }

        // Spring back to home
        b.vx += (homeX - b.x) * 0.002;
        b.vy += (homeY - b.y) * 0.002;

        // Soft ambient drift
        b.vx += Math.sin(time * 0.4) * 0.15;
        b.vy += Math.cos(time * 0.35) * 0.12;

        // Friction
        b.vx *= 0.94;
        b.vy *= 0.94;
        b.x += b.vx;
        b.y += b.vy;

        // Breathing size
        b.targetSize = b.size * (1 + Math.sin(time * b.phaseSpeed) * 0.08);
        const currentSize = b.targetSize;

        // Draw liquid blob
        const path = new Path2D(blobPath(b.x, b.y, currentSize, time, b.morph));
        const g = gCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentSize);
        g.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.alpha})`);
        g.addColorStop(0.3, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.alpha * 0.6})`);
        g.addColorStop(0.6, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.alpha * 0.2})`);
        g.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);
        gCtx.fillStyle = g;
        gCtx.fill(path, "evenodd");

        // Inner bright spot
        const g2 = gCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentSize * 0.4);
        g2.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.alpha * 0.3})`);
        g2.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);
        gCtx.fillStyle = g2;
        gCtx.fill(path, "evenodd");
      }

      // Blur the glow layer
      ctx.filter = "blur(60px)";
      ctx.drawImage(glowCanvas, 0, 0);
      ctx.filter = "none";

      // Subtle vignette
      const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.8);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(0.5, "rgba(0,0,0,0.25)");
      v.addColorStop(0.85, "rgba(0,0,0,0.8)");
      v.addColorStop(1, "rgba(0,0,0,0.95)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    setIsReady(true);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

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
        pointerEvents: "none",
        opacity: isReady ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    />
  );
}
