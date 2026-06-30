import { useEffect, useRef } from "react";

interface TrailPoint { x: number; y: number; age: number; }
const MAX_TRAIL = 14;
const TRAIL_LIFE = 18; // frames

export function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos       = useRef({ x: -100, y: -100 });
  const target    = useRef({ x: -100, y: -100 });
  const trail     = useRef<TrailPoint[]>([]);
  const raf       = useRef<number>(0);

  useEffect(() => {
    const dot    = dotRef.current;
    const ring   = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      trail.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.current.length > MAX_TRAIL) trail.current.shift();
    };
    const onEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };
    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isClickable =
        t.tagName === "BUTTON" || t.tagName === "A" ||
        t.tagName === "INPUT"  || t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT" || t.closest("button") ||
        t.closest("a")        || t.closest("[data-cursor='pointer']");
      if (isClickable) {
        dot.style.transform  = "translate(-50%, -50%) scale(2.5)";
        dot.style.background = "var(--c-glow)";
        ring.style.transform = "translate(-50%, -50%) scale(1.8)";
        ring.style.borderColor = "var(--c-border)";
      } else {
        dot.style.transform  = "translate(-50%, -50%) scale(1)";
        dot.style.background = "var(--c-primary)";
        ring.style.transform = "translate(-50%, -50%) scale(1)";
        ring.style.borderColor = "var(--c-border-soft)";
      }
    };

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      dot.style.left  = `${pos.current.x}px`;
      dot.style.top   = `${pos.current.y}px`;
      ring.style.left = `${pos.current.x}px`;
      ring.style.top  = `${pos.current.y}px`;

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trail.current.forEach((pt, i) => {
        pt.age++;
        const life    = 1 - pt.age / TRAIL_LIFE;
        if (life <= 0) return;
        const size    = 2.5 * life * (i / MAX_TRAIL);
        const alpha   = 0.35 * life * (i / MAX_TRAIL);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 60, 255, ${alpha})`;
        ctx.fill();
      });
      trail.current = trail.current.filter(pt => pt.age < TRAIL_LIFE);

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover",   onOver);
    document.addEventListener("mouseenter",  onEnter);
    document.addEventListener("mouseleave",  onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize",    resize);
      document.removeEventListener("mouseover",   onOver);
      document.removeEventListener("mouseenter",  onEnter);
      document.removeEventListener("mouseleave",  onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          pointerEvents: "none", zIndex: 99997,
          mixBlendMode: "screen",
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: 8, height: 8, borderRadius: "50%",
          background: "var(--c-primary)",
          transform: "translate(-50%, -50%) scale(1)",
          pointerEvents: "none", zIndex: 99999, opacity: 0,
          transition: "opacity 0.3s, transform 0.25s, background 0.25s",
          boxShadow: "0 0 10px var(--c-glow), 0 0 20px var(--c-glow-soft)",
          mixBlendMode: "screen",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: 32, height: 32, borderRadius: "50%",
          border: "1px solid var(--c-border-soft)",
          transform: "translate(-50%, -50%) scale(1)",
          pointerEvents: "none", zIndex: 99998, opacity: 0,
          transition: "opacity 0.3s, transform 0.35s, border-color 0.25s",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
