import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette } from "lucide-react";
import { useTheme } from "./ThemeContext";

const STORAGE_KEY = "mfx-theme-nudge-dismissed";

const SUGGESTIONS = [
  { id: "red"   as const, label: "Red",   dot: "#CC1A1A", desc: "Bold & striking" },
  { id: "white" as const, label: "White", dot: "#e8e8e8", desc: "Clean & minimal" },
];

export function ThemeNudgePopup() {
  const [visible, setVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const apply = (id: typeof SUGGESTIONS[number]["id"]) => {
    setTheme(id);
    dismiss();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40, y: 10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-24 right-6 z-[300] w-56 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(8,6,20,0.93)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-2 border-b border-white/6">
            <Palette className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--c-primary)" }} />
            <p className="text-xs font-semibold text-white flex-1">Try a different color</p>
            <button
              onClick={dismiss}
              className="text-white/25 hover:text-white/60 transition-colors -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color options */}
          <div className="p-3 space-y-2">
            {SUGGESTIONS.map(s => {
              const active = theme === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => apply(s.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{
                      background: s.dot,
                      boxShadow: active ? `0 0 10px ${s.dot}80` : "none",
                      border: s.id === "white" ? "1px solid rgba(255,255,255,0.2)" : "none",
                      transform: active ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)" }}>
                      {s.label}
                    </p>
                    <p className="text-[9px] text-white/25">{s.desc}</p>
                  </div>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          <p className="text-[9px] text-white/15 text-center pb-2.5">Click to apply · Dark is the default</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
