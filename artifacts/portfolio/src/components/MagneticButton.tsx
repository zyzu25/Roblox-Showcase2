import { useRef, useState, type ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  onClick,
  dataTestid,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dataTestid?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    setPos({ x: dx * 0.3, y: dy * 0.3 });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      data-testid={dataTestid}
      className={className}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {children}
    </button>
  );
}
