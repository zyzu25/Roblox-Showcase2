import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette } from "lucide-react";
import { useTheme } from "./ThemeContext";

const STORAGE_KEY = "mfx-theme-nudge-dismissed";

const SUGGESTIONS = [
  { id: "purple" as const, label: "Purple", dot: "#e000ff", desc: "Novara-inspired" },
  { id: "red"    as const, label: "Red",    dot: "#CC1A1A", desc: "Bold & striking" },
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
          className="fixed bottom-32 right-6 z-[300] w-44 rounded-xl overflow-hidden"
          style={{
            background: "rgba(8,6,20,0.93)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.04)",
          }}
        >
          {/* Header */}
          <div className="px-3 pt-2.5 pb-2 flex items-center gap-1.5 border-b border-white/6">
            <Palette className="w-3 h-3 flex-shrink-0" style={{ color: "var(--c-primary)" }} />
            <p className="text-[10px] font-semibold text-white flex-1">Try a different color</p>
            <button
              onClick={dismiss}
              className="text-white/25 hover:text-white/60 transition-colors -mr-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Color options */}
          <div className="p-2 space-y-1.5">
            {SUGGESTIONS.map(s => {
              const active = theme === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => apply(s.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all"
                  style={{
                    background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
                    border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      background: s.dot,
                      boxShadow: active ? `0 0 8px ${s.dot}80` : "none",
                      border: "none",
                      transform: active ? "scale(1.15)" : "scale(1)",
                      transition: "all 0.2s ease",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold" style={{ color: active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.55)" }}>
                      {s.label}
                    </p>
                    <p className="text-[8px] text-white/25">{s.desc}</p>
                  </div>
                  {active && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          <p className="text-[8px] text-white/15 text-center pb-2">Click to apply</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
