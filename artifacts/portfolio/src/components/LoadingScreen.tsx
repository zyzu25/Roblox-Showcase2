import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"intro" | "signature" | "name" | "outro">("intro");
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  /* Particle rain canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vy: number; opacity: number; size: number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vy: 0.4 + Math.random() * 0.8,
        opacity: 0.03 + Math.random() * 0.10,
        size: 1 + Math.random() * 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
        p.y += p.vy;
        if (p.y > canvas.height) {
          p.y = -4;
          p.x = Math.random() * canvas.width;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Phase sequencing — total ~8 seconds */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("signature"), 600);
    const t2 = setTimeout(() => setPhase("name"),      2600);
    const t3 = setTimeout(() => setPhase("outro"),     6200);
    const t4 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 900);
    }, 7400);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "linear-gradient(160deg, #020202 0%, #0d0d0d 40%, #171616 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          />

          {/* Radial glow */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(25,24,24,0.95) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Horizontal scan line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase !== "intro" ? { scaleX: 1, opacity: [0, 0.25, 0] } : {}}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              transformOrigin: "left",
              pointerEvents: "none",
            }}
          />

          {/* Signature image */}
          <AnimatePresence>
            {(phase === "signature" || phase === "name") && (
              <motion.div
                key="sig"
                initial={{ opacity: 0, x: 80, filter: "blur(12px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)", scale: 0.96 }}
                transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
                style={{ position: "relative", zIndex: 10 }}
              >
                <img
                  src="/signature.png"
                  alt="MYSTICFUSION7X signature"
                  style={{
                    width: "min(520px, 78vw)",
                    height: "auto",
                    filter: "invert(1) brightness(0.75) contrast(1.2)",
                    userSelect: "none",
                    pointerEvents: "none",
                    display: "block",
                  }}
                  draggable={false}
                />
                {/* Subtle glow under sig */}
                <div style={{
                  position: "absolute",
                  bottom: -20,
                  left: "10%",
                  right: "10%",
                  height: 40,
                  background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
                  filter: "blur(8px)",
                  pointerEvents: "none",
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + tagline */}
          <AnimatePresence>
            {phase === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{ textAlign: "center", marginTop: 12, position: "relative", zIndex: 10 }}
              >
                <p style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 500,
                }}>
                  MYSTICFUSION7X &mdash; Roblox UI Design
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outro: "Loading" dots */}
          <AnimatePresence>
            {phase === "outro" && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.15, 0.7, 0.15], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          {[
            { top: 24, left: 24, borderTop: true, borderLeft: true },
            { top: 24, right: 24, borderTop: true, borderRight: true },
            { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
            { bottom: 24, right: 24, borderBottom: true, borderRight: true },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "absolute",
                width: 20,
                height: 20,
                borderColor: "rgba(255,255,255,0.10)",
                borderStyle: "solid",
                borderWidth: 0,
                borderTopWidth: (s as any).borderTop ? 1 : 0,
                borderBottomWidth: (s as any).borderBottom ? 1 : 0,
                borderLeftWidth: (s as any).borderLeft ? 1 : 0,
                borderRightWidth: (s as any).borderRight ? 1 : 0,
                top: (s as any).top,
                bottom: (s as any).bottom,
                left: (s as any).left,
                right: (s as any).right,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
