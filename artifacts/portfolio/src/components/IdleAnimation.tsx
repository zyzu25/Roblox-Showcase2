import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IDLE_SECONDS = 10;

const IDLE_MESSAGES = [
  "Still there? 👀",
  "Taking your time… 😌",
  "No rush, I'll wait ✨",
  "The portfolio's still glowing 💜",
  "Whenever you're ready 🎨",
];

export function IdleAnimation() {
  const [idle, setIdle]     = useState(false);
  const [msgIdx]            = useState(() => Math.floor(Math.random() * IDLE_MESSAGES.length));
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      setIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIdle(true), IDLE_SECONDS * 1000);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel"];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {idle && (
        <motion.div
          key="idle"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-8 left-1/2 z-[9000] pointer-events-none"
          style={{ transform: "translateX(-50%)" }}
        >
          {/* Signature pulse behind the pill */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              opacity: [0, 0.22, 0],
              scale:   [0.85, 1.35, 0.85],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "var(--c-primary)", filter: "blur(10px)" }}
          />

          <motion.div
            animate={{
              boxShadow: [
                "0 0 18px var(--c-glow)",
                "0 0 36px var(--c-glow)",
                "0 0 18px var(--c-glow)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative px-5 py-2.5 rounded-full text-sm text-white/80 font-medium"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--c-border)",
              backdropFilter: "blur(20px)",
              letterSpacing: "0.02em",
            }}
          >
            {IDLE_MESSAGES[msgIdx]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
