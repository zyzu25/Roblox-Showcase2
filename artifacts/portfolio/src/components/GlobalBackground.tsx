import { useEffect, useRef, useState } from "react";

interface Orb {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  drift: number;
  phase: number;
}

function createOrb(w: number, h: number, size: number, color: string, phase: number): Orb {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    tx: Math.random() * w,
    ty: Math.random() * h,
    vx: 0,
    vy: 0,
    size,
    color,
    drift: 0.5 + Math.random() * 0.8,
    phase,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
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
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 2 main blobs + 3 smaller ambient dots
    orbsRef.current = [
      createOrb(w * 0.75, h * 0.3, Math.max(w, h) * 0.6, "rgba(8,50,240,", 0),
      createOrb(w * 0.3, h * 0.7, Math.max(w, h) * 0.45, "rgba(4,30,200,", 2.5),
      createOrb(w * 0.15, h * 0.2, Math.max(w, h) * 0.25, "rgba(6,35,210,", 1.8),
      createOrb(w * 0.85, h * 0.8, Math.max(w, h) * 0.2, "rgba(5,28,190,", 4.2),
      createOrb(w * 0.5, h * 0.5, Math.max(w, h) * 0.15, "rgba(8,40,230,", 6.0),
    ];

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let t = 0;
    const animate = () => {
      t += 0.008;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      // Base: very dark navy
      ctx.fillStyle = "#00000a";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < orbsRef.current.length; i++) {
        const orb = orbsRef.current[i];
        const time = t + orb.phase;

        // Ambient drift
        const driftX = Math.sin(time * 0.4) * 40 * orb.drift;
        const driftY = Math.cos(time * 0.3) * 30 * orb.drift;

        // Mouse interaction (only for first 2 main blobs)
        if (i < 2 && mx > 0) {
          const dx = mx - orb.x;
          const dy = my - orb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 600;
          if (dist < maxDist) {
            const force = 1 - dist / maxDist;
            orb.vx += (dx / dist) * force * 0.8;
            orb.vy += (dy / dist) * force * 0.8;
          }
          // Spring back toward target
          const homeX = (i === 0 ? w * 0.75 : w * 0.3) + driftX;
          const homeY = (i === 0 ? h * 0.3 : h * 0.7) + driftY;
          orb.vx += (homeX - orb.x) * 0.003;
          orb.vy += (homeY - orb.y) * 0.003;
        } else {
          // Smaller orbs just drift
          orb.vx += (orb.tx - orb.x) * 0.001;
          orb.vy += (orb.ty - orb.y) * 0.001;
          if (Math.random() < 0.01) {
            orb.tx = Math.random() * w;
            orb.ty = Math.random() * h;
          }
        }

        // Friction
        orb.vx *= 0.94;
        orb.vy *= 0.94;

        orb.x += orb.vx;
        orb.y += orb.vy;

        // Draw gradient
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        const alpha = i < 2 ? 0.85 - i * 0.15 : 0.35 - i * 0.03;
        g.addColorStop(0, `${orb.color}${alpha.toFixed(2)})`);
        g.addColorStop(0.25, `${orb.color}${(alpha * 0.6).toFixed(2)})`);
        g.addColorStop(0.55, `${orb.color}${(alpha * 0.2).toFixed(2)})`);
        g.addColorStop(1, `${orb.color}0.00)`);

        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.5, "rgba(0,0,0,0.3)");
      vignette.addColorStop(0.85, "rgba(0,0,0,0.85)");
      vignette.addColorStop(1, "rgba(0,0,0,0.98)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Noise grain overlay
      ctx.fillStyle = `rgba(255,255,255,0.015)`;
      for (let n = 0; n < 80; n++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        const ns = Math.random() * 1.5;
        ctx.fillRect(nx, ny, ns, ns);
      }

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
        transition: "opacity 1s ease",
      }}
    />
  );
}
