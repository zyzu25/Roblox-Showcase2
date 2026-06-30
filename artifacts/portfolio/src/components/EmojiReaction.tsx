import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

const REACTIONS = [
  { emoji: "🔥", label: "Fire", dir: "right" as const },
  { emoji: "😍", label: "Love it", dir: "right" as const },
  { emoji: "💎", label: "Premium", dir: "right" as const },
  { emoji: "😐", label: "Mid", dir: "left" as const },
  { emoji: "💀", label: "No way", dir: "left" as const },
];

const DRAG_THRESHOLD = 80; // px to trigger

function getStoredCounts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem("emojiReacts") ?? "{}");
  } catch { return {}; }
}

function saveCounts(c: Record<string, number>) {
  try { localStorage.setItem("emojiReacts", JSON.stringify(c)); } catch {}
}

function EmojiCard({ onSwipe }: { onSwipe: (dir: "left" | "right", emoji: string, label: string) => void }) {
  const [idx, setIdx] = useState(Math.floor(Math.random() * REACTIONS.length));
  const reaction = REACTIONS[idx];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const scale  = useTransform(x, [-150, 0, 150], [0.92, 1.08, 0.92]);

  // Hint overlays
  const leftOpacity  = useTransform(x, [-120, -30, 0], [1, 0.3, 0]);
  const rightOpacity = useTransform(x, [0, 30, 120], [0, 0.3, 1]);
  const emojiScale   = useTransform(x, [-150, 0, 150], [0.7, 1, 0.7]);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { x: number } }) => {
    const ox = info.offset.x;
    if (Math.abs(ox) >= DRAG_THRESHOLD) {
      const dir = ox > 0 ? "right" : "left";
      onSwipe(dir, reaction.emoji, reaction.label);
      // Fly off screen, then reset
      animate(x, dir === "right" ? 400 : -400, { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] });
      setTimeout(() => {
        x.set(0);
        setIdx(i => (i + 1) % REACTIONS.length);
      }, 380);
    } else {
      // Snap back with spring
      animate(x, 0, { type: "spring", stiffness: 350, damping: 28 });
    }
  }, [reaction, onSwipe, x]);

  return (
    <div ref={constraintsRef} className="relative flex items-center justify-center h-36">
      {/* Left zone hint */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute left-0 top-0 h-full flex items-center px-4 rounded-2xl pointer-events-none"
        transition={{ duration: 0 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">😐</span>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Nah</span>
        </div>
      </motion.div>

      {/* Right zone hint */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute right-0 top-0 h-full flex items-center px-4 rounded-2xl pointer-events-none"
        transition={{ duration: 0 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl">🔥</span>
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Fire</span>
        </div>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        style={{ x, rotate, scale }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragStart={() => { dragging.current = true; }}
        onDragEnd={handleDragEnd}
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        whileTap={{ scale: 1.12 }}
      >
        <div
          className="w-28 h-28 rounded-3xl flex flex-col items-center justify-center gap-2"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <motion.span style={{ scale: emojiScale, display: "block", lineHeight: 1 }} className="text-5xl">
            {reaction.emoji}
          </motion.span>
          <span className="text-[10px] text-white/40 font-semibold tracking-wide">{reaction.label}</span>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingEmoji({ emoji, id }: { emoji: string; id: number }) {
  return (
    <motion.span
      key={id}
      initial={{ opacity: 1, y: 0, scale: 1, x: (Math.random() - 0.5) * 60 }}
      animate={{ opacity: 0, y: -80, scale: 1.6, x: (Math.random() - 0.5) * 100 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className="absolute text-3xl pointer-events-none select-none"
      style={{ bottom: "50%", left: "50%", transform: "translate(-50%, 0)", zIndex: 20 }}
    >
      {emoji}
    </motion.span>
  );
}

export function EmojiReaction() {
  const [counts, setCounts] = useState<Record<string, number>>(getStoredCounts);
  const [floaters, setFloaters] = useState<{ emoji: string; id: number }[]>([]);
  const [lastSwipe, setLastSwipe] = useState<{ dir: "left" | "right"; label: string } | null>(null);
  const nextId = useRef(0);
  const [hasReacted, setHasReacted] = useState(false);

  const handleSwipe = useCallback((dir: "left" | "right", emoji: string, label: string) => {
    const key = label;
    const updated = { ...counts, [key]: (counts[key] ?? 0) + 1 };
    setCounts(updated);
    saveCounts(updated);
    setHasReacted(true);
    setLastSwipe({ dir, label });

    const id = nextId.current++;
    setFloaters(f => [...f, { emoji, id }]);
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 1200);
  }, [counts]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const topReaction = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
      {/* Floating emoji particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floaters.map(f => <FloatingEmoji key={f.id} emoji={f.emoji} id={f.id} />)}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>Vibe Check</p>
        <h3 className="text-base font-bold text-white">Swipe on the portfolio</h3>
        <p className="text-[11px] text-white/30 mt-0.5">drag left or right to react</p>
      </div>

      {/* The draggable card */}
      <EmojiCard onSwipe={handleSwipe} />

      {/* Hint arrows */}
      <div className="flex justify-between items-center px-2 -mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-white/20 text-lg">←</span>
          <span className="text-[10px] text-white/20 font-medium">Not feeling it</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/20 font-medium">This is it</span>
          <span className="text-white/20 text-lg">→</span>
        </div>
      </div>

      {/* Result feedback */}
      <AnimatePresence mode="wait">
        {lastSwipe && (
          <motion.div
            key={lastSwipe.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-xs font-semibold" style={{ color: lastSwipe.dir === "right" ? "#4ade80" : "#f87171" }}>
              {lastSwipe.dir === "right" ? `🔥 You said "${lastSwipe.label}"` : `😐 Fair enough — "${lastSwipe.label}"`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live reaction counts */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 justify-center pt-2 border-t border-white/5"
        >
          {Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => {
              const r = REACTIONS.find(x => x.label === label);
              return (
                <span key={label} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                  {r?.emoji} {count}
                </span>
              );
            })}
        </motion.div>
      )}

      {total > 0 && (
        <p className="text-[10px] text-white/20 text-center">
          {total} {total === 1 ? "reaction" : "reactions"} total
          {topReaction ? ` · most common: ${topReaction[0]}` : ""}
        </p>
      )}
    </div>
  );
}
