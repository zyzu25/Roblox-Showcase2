import { useRef, useState, useCallback, type ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick,
  dataTestid,
  type = "button",
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataTestid?: string;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isActiveRef = useRef(false);

  const animate = useCallback(() => {
    const t = targetRef.current;
    const c = posRef.current;
    c.x += (t.x - c.x) * 0.12;
    c.y += (t.y - c.y) * 0.12;
    // Stop when near zero to prevent micro-jitters
    if (Math.abs(t.x) < 0.1 && Math.abs(t.y) < 0.1 && Math.abs(c.x) < 0.5 && Math.abs(c.y) < 0.5) {
      c.x = 0;
      c.y = 0;
      t.x = 0;
      t.y = 0;
      setPos({ x: 0, y: 0 });
      isActiveRef.current = false;
      return;
    }
    setPos({ x: c.x, y: c.y });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 160;
    const strength = 0.35;
    if (dist < maxDist) {
      targetRef.current = { x: dx * strength, y: dy * strength };
    } else {
      targetRef.current = { x: 0, y: 0 };
    }
    if (!isActiveRef.current) {
      isActiveRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  };

  const onLeave = () => {
    targetRef.current = { x: 0, y: 0 };
  };

  return (
    <button
      ref={ref}
      type={type}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-testid={dataTestid}
      className={className}
      style={{
        transform: `translate(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px)`,
        transition: "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
