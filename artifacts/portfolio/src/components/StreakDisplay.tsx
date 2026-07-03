import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakData {
  streak: number;
  lastDate: string;
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem("mfx-streak");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { streak: 0, lastDate: "" };
}

function saveStreak(data: StreakData) {
  try { localStorage.setItem("mfx-streak", JSON.stringify(data)); } catch {}
}

function daysBetween(a: string, b: string) {
  const msA = new Date(a).setHours(0, 0, 0, 0);
  const msB = new Date(b).setHours(0, 0, 0, 0);
  return Math.round(Math.abs(msB - msA) / 86_400_000);
}

export function StreakDisplay() {
  const [streak, setStreak] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const data  = loadStreak();

    let newStreak = 1;
    if (data.lastDate) {
      const diff = daysBetween(data.lastDate, today);
      if (diff === 0) {
        newStreak = data.streak;
      } else if (diff === 1) {
        newStreak = data.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    saveStreak({ streak: newStreak, lastDate: today });
    setStreak(newStreak);
    if (newStreak >= 2) {
      const t = setTimeout(() => setVisible(true), 4500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  if (!visible || streak < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-20 left-5 z-[7900] pointer-events-none"
    >
      <div
        className="flex items-center gap-2 px-3.5 py-2 rounded-full"
        style={{
          background: "rgba(6,4,18,0.88)",
          border: "1px solid var(--c-border-soft)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame className="w-3.5 h-3.5" style={{ color: "#ff7a2e" }} />
        </motion.div>
        <span className="text-[11px] font-semibold text-white/70">
          Active{" "}
          <span className="text-white font-bold">{streak} day{streak !== 1 ? "s" : ""}</span>
          {" "}straight
        </span>
      </div>
    </motion.div>
  );
}
