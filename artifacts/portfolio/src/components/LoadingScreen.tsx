import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_LINES = [
  "Crafting your experience...",
  "Loading premium UIs...",
  "Warming up the pixels...",
  "Almost there...",
];

type LoadingTheme = {
  name: string;
  bg: string;
  glow: string;
  particleHue: [number, number];
  scanColor: string;
  progressFrom: string;
  progressTo: string;
  progressGlow: string;
  cornerColor: string;
  taglineColor: string;
  lineColor: string;
  filterStyle: string;
};

// One entry per website theme — picked randomly on each load
const THEMES: LoadingTheme[] = [
  // ── Purple (default website theme) ────────────────────────────────────────
  {
    name: "purple",
    bg: "linear-gradient(160deg, #040408 0%, #0a0812 50%, #140d1a 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(80,20,160,0.22) 0%, transparent 65%)",
    particleHue: [260, 40],
    scanColor: "rgba(160,100,255,0.45)",
    progressFrom: "#5b21b6",
    progressTo: "#a855f7",
    progressGlow: "rgba(168,85,247,0.65)",
    cornerColor: "rgba(160,100,255,0.22)",
    taglineColor: "rgba(180,140,255,0.38)",
    lineColor: "rgba(160,120,255,0.45)",
    filterStyle: "invert(1) brightness(0.8) contrast(1.1) sepia(0.3) hue-rotate(260deg)",
  },
  // ── Light / ice-blue (website "light" theme) ───────────────────────────────
  {
    name: "light",
    bg: "linear-gradient(160deg, #020608 0%, #060e14 50%, #0a1620 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(30,100,170,0.22) 0%, transparent 65%)",
    particleHue: [200, 30],
    scanColor: "rgba(100,190,240,0.45)",
    progressFrom: "#0e5a8a",
    progressTo: "#5bb8e5",
    progressGlow: "rgba(91,184,229,0.60)",
    cornerColor: "rgba(80,180,230,0.22)",
    taglineColor: "rgba(140,210,245,0.40)",
    lineColor: "rgba(100,190,235,0.45)",
    filterStyle: "invert(1) brightness(0.75) contrast(1.05) sepia(0.15) hue-rotate(185deg)",
  },
  // ── Dark / noir (website "dark" theme) ────────────────────────────────────
  {
    name: "dark",
    bg: "linear-gradient(160deg, #020202 0%, #080808 50%, #0e0e0e 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(80,80,80,0.18) 0%, transparent 65%)",
    particleHue: [0, 0],
    scanColor: "rgba(180,180,180,0.30)",
    progressFrom: "#333333",
    progressTo: "#888888",
    progressGlow: "rgba(150,150,150,0.50)",
    cornerColor: "rgba(160,160,160,0.20)",
    taglineColor: "rgba(200,200,200,0.30)",
    lineColor: "rgba(180,180,180,0.35)",
    filterStyle: "invert(1) brightness(0.65) contrast(0.9) grayscale(1)",
  },
  // ── Gold / amber (website "gold" theme) ───────────────────────────────────
  {
    name: "gold",
    bg: "linear-gradient(160deg, #060400 0%, #100c00 50%, #1a1200 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(160,100,0,0.24) 0%, transparent 65%)",
    particleHue: [38, 20],
    scanColor: "rgba(230,175,50,0.45)",
    progressFrom: "#7a5200",
    progressTo: "#d4a017",
    progressGlow: "rgba(212,160,23,0.65)",
    cornerColor: "rgba(210,160,30,0.22)",
    taglineColor: "rgba(240,190,80,0.40)",
    lineColor: "rgba(225,170,50,0.45)",
    filterStyle: "invert(1) brightness(0.75) contrast(1.08) sepia(0.6) hue-rotate(8deg)",
  },
  // ── Red / blood (website "red" theme) ─────────────────────────────────────
  {
    name: "red",
    bg: "linear-gradient(160deg, #060000 0%, #100000 50%, #1a0000 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(160,10,10,0.24) 0%, transparent 65%)",
    particleHue: [0, 18],
    scanColor: "rgba(230,40,40,0.45)",
    progressFrom: "#7a0000",
    progressTo: "#cc1a1a",
    progressGlow: "rgba(204,26,26,0.65)",
    cornerColor: "rgba(210,30,30,0.22)",
    taglineColor: "rgba(240,100,100,0.40)",
    lineColor: "rgba(225,60,60,0.45)",
    filterStyle: "invert(1) brightness(0.72) contrast(1.12) sepia(0.8) hue-rotate(300deg)",
  },
];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  // Pick a random theme once per mount, keep it stable
  const [theme] = useState<LoadingTheme>(() => THEMES[Math.floor(Math.random() * THEMES.length)]);
  const [phase, setPhase]     = useState<"intro" | "signature" | "name" | "outro">("intro");
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx]   = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  /* ── Particle rain canvas ────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const [hueBase, hueRange] = theme.particleHue;
    // For dark (grayscale) theme, use white particles
    const isDark = theme.name === "dark";

    const particles: {
      x: number; y: number; vy: number;
      opacity: number; size: number; hue: number;
    }[] = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * window.innerHeight,
        vy:      0.3 + Math.random() * 0.7,
        opacity: 0.02 + Math.random() * 0.08,
        size:    0.8 + Math.random() * 1.4,
        hue:     hueBase + Math.random() * hueRange,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(200,200,200,${p.opacity})`
          : `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();
        p.y += p.vy;
        if (p.y > canvas.height) { p.y = -4; p.x = Math.random() * canvas.width; }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  /* ── Phase sequencing ────────────────────────────────────────────────── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("signature"), 400);
    const t2 = setTimeout(() => setPhase("name"),      2000);
    const t3 = setTimeout(() => setPhase("outro"),     4200);
    const t4 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 800);
    }, 5800);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onDone]);

  /* ── Progress bar ────────────────────────────────────────────────────── */
  useEffect(() => {
    const milestones = [
      { at: 200,  val: 15  },
      { at: 800,  val: 40  },
      { at: 2200, val: 65  },
      { at: 3800, val: 82  },
      { at: 5000, val: 95  },
      { at: 5600, val: 100 },
    ];
    const timers = milestones.map(m => setTimeout(() => setProgress(m.val), m.at));
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Cycle loading lines ─────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setLineIdx(i => (i + 1) % LOADING_LINES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: theme.bg,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Particle rain */}
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

          {/* Radial glow */}
          <div style={{ position: "absolute", inset: 0, background: theme.glow, pointerEvents: "none" }} />

          {/* Scan line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase !== "intro" ? { scaleX: 1, opacity: [0, 0.2, 0] } : {}}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${theme.scanColor}, transparent)`,
              transformOrigin: "left", pointerEvents: "none",
            }}
          />

          {/* Signature */}
          <AnimatePresence>
            {(phase === "signature" || phase === "name") && (
              <motion.div
                key="sig"
                initial={{ opacity: 0, x: 60, filter: "blur(16px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
                style={{ position: "relative", zIndex: 10 }}
              >
                <img
                  src="/signature.png"
                  alt="MYSTICFUSION7X"
                  style={{
                    width: "min(480px, 72vw)", height: "auto",
                    filter: theme.filterStyle,
                    userSelect: "none", pointerEvents: "none", display: "block",
                  }}
                  draggable={false}
                />
                <div style={{
                  position: "absolute", bottom: -24, left: "5%", right: "5%", height: 40,
                  background: `radial-gradient(ellipse, ${theme.progressGlow.replace(/[\d.]+\)$/, "0.12)")} 0%, transparent 70%)`,
                  filter: "blur(10px)", pointerEvents: "none",
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + tagline */}
          <AnimatePresence>
            {phase === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                style={{ textAlign: "center", marginTop: 10, position: "relative", zIndex: 10 }}
              >
                <p style={{
                  fontSize: "0.6rem", letterSpacing: "0.3em",
                  textTransform: "uppercase", color: theme.taglineColor,
                  fontFamily: "var(--font-display, sans-serif)", fontWeight: 600,
                }}>
                  MYSTICFUSION7X · Roblox UI Design
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outro: cycling loading text */}
          <AnimatePresence>
            {phase === "outro" && (
              <motion.div
                key="outro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", bottom: "14%", textAlign: "center" }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={lineIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontSize: "0.65rem", letterSpacing: "0.18em",
                      textTransform: "uppercase", color: theme.lineColor,
                      fontFamily: "var(--font-display, sans-serif)",
                    }}
                  >
                    {LOADING_LINES[lineIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: "rgba(255,255,255,0.04)",
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${theme.progressFrom}, ${theme.progressTo})`,
                boxShadow: `0 0 12px ${theme.progressGlow}`,
              }}
            />
          </div>

          {/* Corner decorations */}
          {[
            { top: 20,    left: 20,   borderTop: true,    borderLeft: true    },
            { top: 20,    right: 20,  borderTop: true,    borderRight: true   },
            { bottom: 20, left: 20,   borderBottom: true, borderLeft: true    },
            { bottom: 20, right: 20,  borderBottom: true, borderRight: true   },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "absolute", width: 18, height: 18,
                borderColor: theme.cornerColor, borderStyle: "solid", borderWidth: 0,
                borderTopWidth:    (s as any).borderTop    ? 1 : 0,
                borderBottomWidth: (s as any).borderBottom ? 1 : 0,
                borderLeftWidth:   (s as any).borderLeft   ? 1 : 0,
                borderRightWidth:  (s as any).borderRight  ? 1 : 0,
                top: (s as any).top, bottom: (s as any).bottom,
                left: (s as any).left, right: (s as any).right,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
