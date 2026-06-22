import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = h.scrollHeight - h.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      if (barRef.current) {
        barRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[2px] z-[100]"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "0%",
          background: "linear-gradient(90deg, #1a44ff, #5588ff, #1a44ff)",
          boxShadow: "0 0 8px rgba(26,71,255,0.5)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
