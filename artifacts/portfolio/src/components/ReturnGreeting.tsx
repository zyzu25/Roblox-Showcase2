import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDiscordAvatar } from "@/hooks/useDiscordAvatar";

function getVisitData(): { count: number; lastSeen: string } {
  try {
    const raw = localStorage.getItem("mfx-visit");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastSeen: "" };
}

function saveVisitData(data: { count: number; lastSeen: string }) {
  try { localStorage.setItem("mfx-visit", JSON.stringify(data)); } catch {}
}

const RETURN_MESSAGES = [
  "Welcome back! 👋 Always great to see a familiar face.",
  "You're back! Hope you found what you were looking for. 🎨",
  "Hey again! The portfolio's been waiting for you. ✨",
  "Welcome back — ready to make something great? 💜",
  "Good to see you again! Slide into my DMs when you're ready. 🚀",
];

export function ReturnGreeting() {
  const [show, setShow] = useState(false);
  const [msg, setMsg]   = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const data  = getVisitData();
    const isReturn = data.count > 0 && data.lastSeen !== today;

    saveVisitData({ count: data.count + 1, lastSeen: today });

    if (isReturn) {
      setMsg(RETURN_MESSAGES[Math.floor(Math.random() * RETURN_MESSAGES.length)]);
      const t = setTimeout(() => setShow(true), 3200);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="greeting"
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="fixed top-20 right-5 z-[8000] max-w-xs"
        >
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "rgba(6,4,18,0.90)",
              border: "1px solid var(--c-border-soft)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04)",
            }}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5"
              style={{ boxShadow: "0 0 10px var(--c-glow-soft)" }}>
              <img src={useDiscordAvatar()} alt="MysticFusion7x" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-0.5">MYSTICFUSION7X</p>
              <p className="text-xs text-white/80 leading-relaxed">{msg}</p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white/25 hover:text-white/60 transition-colors mt-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Glow dot */}
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full"
            style={{ background: "var(--c-primary)", transform: "translateX(-50%)", boxShadow: "0 0 8px var(--c-glow)" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
