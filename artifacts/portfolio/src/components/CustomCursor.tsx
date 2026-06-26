import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isClickable =
        t.tagName === "BUTTON" ||
        t.tagName === "A" ||
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.tagName === "SELECT" ||
        t.closest("button") ||
        t.closest("a") ||
        t.closest("[data-cursor='pointer']");
      if (isClickable) {
        dot.style.transform = "translate(-50%, -50%) scale(2.5)";
        dot.style.background = "var(--c-glow)";
        ring.style.transform = "translate(-50%, -50%) scale(1.8)";
        ring.style.borderColor = "var(--c-border)";
      } else {
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        dot.style.background = "var(--c-primary)";
        ring.style.transform = "translate(-50%, -50%) scale(1)";
        ring.style.borderColor = "var(--c-border-soft)";
      }
    };

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      dot.style.left = `${pos.current.x}px`;
      dot.style.top = `${pos.current.y}px`;
      ring.style.left = `${pos.current.x}px`;
      ring.style.top = `${pos.current.y}px`;
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--c-primary)",
          transform: "translate(-50%, -50%) scale(1)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          transition: "opacity 0.3s, transform 0.25s, background 0.25s",
          boxShadow: "0 0 10px var(--c-glow), 0 0 20px var(--c-glow-soft)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--c-border-soft)",
          transform: "translate(-50%, -50%) scale(1)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: 0,
          transition: "opacity 0.3s, transform 0.35s, border-color 0.25s",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
