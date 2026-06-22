import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  "rgba(40, 90, 255,",
  "rgba(60, 110, 255,",
  "rgba(26, 71, 255,",
  "rgba(100, 140, 255,",
  "rgba(255, 255, 255,",
];

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

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

    // Spawn particles
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push(createParticle(w, h));
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, w, h);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        const lifeRatio = p.life / p.maxLife;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Gentle drift
        p.vx += Math.sin(p.life * 0.02 + i) * 0.02;
        p.vy += Math.cos(p.life * 0.015 + i * 2) * 0.02;

        // Friction
        p.vx *= 0.97;
        p.vy *= 0.97;

        p.x += p.vx;
        p.y += p.vy;

        // Fade out at edges
        let alpha = p.opacity;
        if (lifeRatio > 0.7) alpha *= (1 - lifeRatio) / 0.3;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(alpha * 0.15).toFixed(3)})`;
        ctx.fill();

        if (p.life > p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Respawn
      while (particlesRef.current.length < 60) {
        particlesRef.current.push(createParticle(w, h, true));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

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
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

function createParticle(w: number, h: number, edgeOnly = false): Particle {
  const x = edgeOnly ? (Math.random() < 0.5 ? Math.random() * 20 : w - Math.random() * 20) : Math.random() * w;
  const y = edgeOnly ? (Math.random() < 0.5 ? Math.random() * 20 : h - Math.random() * 20) : Math.random() * h;
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.3 - 0.2,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    life: 0,
    maxLife: Math.random() * 400 + 300,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}
