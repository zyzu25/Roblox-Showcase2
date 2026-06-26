import { useEffect, useRef, useState } from "react";

/* Liquid gooey background — SVG metaball effect with CSS animation + mouse reactivity */

interface Blob {
  id: number;
  cx: number;
  cy: number;
  r: number;
  hue: number;
  sat: number;
  lit: number;
  alpha: number;
  xOffset: number;
  yOffset: number;
  duration: number;
  delay: number;
}

function buildBlobs(theme: string): Blob[] {
  const h1 = theme === "blue" ? 230 : theme === "white" ? 0 : 270;
  const h2 = theme === "blue" ? 220 : theme === "white" ? 0 : 285;
  const h3 = theme === "blue" ? 240 : theme === "white" ? 0 : 255;
  const h4 = theme === "blue" ? 210 : theme === "white" ? 0 : 300;

  if (theme === "white") {
    return [
      { id: 1, cx: 78, cy: 32, r: 18, hue: h1, sat: 8,  lit: 55, alpha: 0.14, xOffset: 6,  yOffset: 4,  duration: 18, delay: 0 },
      { id: 2, cx: 28, cy: 62, r: 16, hue: h2, sat: 12, lit: 50, alpha: 0.11, xOffset: 5,  yOffset: 6,  duration: 22, delay: 3 },
      { id: 3, cx: 52, cy: 48, r: 12, hue: h3, sat: 6,  lit: 58, alpha: 0.08, xOffset: 4,  yOffset: 3,  duration: 14, delay: 1 },
      { id: 4, cx: 15, cy: 78, r: 10, hue: h4, sat: 10, lit: 48, alpha: 0.06, xOffset: 3,  yOffset: 5,  duration: 20, delay: 5 },
      { id: 5, cx: 88, cy: 58, r: 9,  hue: h1, sat: 8,  lit: 52, alpha: 0.05, xOffset: 3,  yOffset: 4,  duration: 16, delay: 2 },
    ];
  }

  return [
    { id: 1, cx: 78, cy: 32, r: 20, hue: h1, sat: 85, lit: 52, alpha: 0.22, xOffset: 7,  yOffset: 5,  duration: 18, delay: 0 },
    { id: 2, cx: 28, cy: 62, r: 17, hue: h2, sat: 80, lit: 48, alpha: 0.18, xOffset: 5,  yOffset: 7,  duration: 22, delay: 3 },
    { id: 3, cx: 52, cy: 48, r: 13, hue: h3, sat: 75, lit: 55, alpha: 0.1,  xOffset: 4,  yOffset: 4,  duration: 14, delay: 1 },
    { id: 4, cx: 15, cy: 78, r: 10, hue: h4, sat: 82, lit: 45, alpha: 0.07, xOffset: 3,  yOffset: 5,  duration: 20, delay: 5 },
    { id: 5, cx: 88, cy: 58, r: 9,  hue: h1, sat: 78, lit: 50, alpha: 0.05, xOffset: 3,  yOffset: 4,  duration: 16, delay: 2 },
  ];
}

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

export function GlobalBackground() {
  const [theme, setTheme] = useState("purple");
  const svgRef = useRef<SVGSVGElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const blobsRef = useRef<Blob[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const checkTheme = () => {
      const t = document.documentElement.getAttribute("data-theme") || "purple";
      if (t !== theme) {
        setTheme(t);
      }
    };
    checkTheme();
    const interval = setInterval(checkTheme, 300);
    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    blobsRef.current = buildBlobs(theme);
  }, [theme]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const blobs = blobsRef.current;
      const circles = svg.querySelectorAll<SVGCircleElement>(".blob");
      const time = Date.now() / 1000;

      circles.forEach((circle, i) => {
        const b = blobs[i];
        if (!b) return;

        const baseX = (b.cx / 100) * w;
        const baseY = (b.cy / 100) * h;
        const t = time + b.delay;

        // Drift
        const dx = Math.sin(t * (2 * Math.PI / b.duration)) * b.xOffset * (w / 100);
        const dy = Math.cos(t * (2 * Math.PI / b.duration) * 0.7) * b.yOffset * (h / 100);

        // Mouse repulsion (gentle)
        let mdx = 0, mdy = 0;
        if (mx > 0 && i < 3) {
          const distX = mx - (baseX + dx);
          const distY = my - (baseY + dy);
          const dist = Math.sqrt(distX * distX + distY * distY);
          const maxDist = 350;
          if (dist < maxDist && dist > 0) {
            const push = (1 - dist / maxDist) * 25;
            mdx = -(distX / dist) * push;
            mdy = -(distY / dist) * push;
          }
        }

        // Breathing
        const breathe = 1 + Math.sin(t * 0.8 + b.delay) * 0.05;
        const radius = b.r * (Math.min(w, h) / 100) * breathe;

        circle.setAttribute("cx", `${baseX + dx + mdx}`);
        circle.setAttribute("cy", `${baseY + dy + mdy}`);
        circle.setAttribute("r", `${radius}`);
        circle.setAttribute("fill", hsla(b.hue, b.sat, b.lit, b.alpha));
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const bg = theme === "purple" ? "#05010c" : theme === "blue" ? "#000815" : "#0d0d12";
  const blobs = buildBlobs(theme);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: bg,
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 25 -10
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
        <g filter="url(#goo)">
          {blobs.map((b) => (
            <circle
              key={b.id}
              className="blob"
              cx="0"
              cy="0"
              r="0"
              fill={hsla(b.hue, b.sat, b.lit, b.alpha)}
            />
          ))}
        </g>
      </svg>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.85) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Theme tint overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            theme === "purple"
              ? "radial-gradient(ellipse at 50% 50%, rgba(60,10,140,0.08) 0%, transparent 60%)"
              : theme === "blue"
              ? "radial-gradient(ellipse at 50% 50%, rgba(5,30,120,0.08) 0%, transparent 60%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(15,15,25,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grain */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.02, pointerEvents: "none" }}
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
