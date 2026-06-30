import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDiscordOnline } from "./DiscordStatus";

const ACTIVE_START = 12;
const ACTIVE_END   = 3;

function getGMT2Parts() {
  const now = new Date();
  const str = now.toLocaleString("en-GB", {
    timeZone: "Africa/Cairo",
    hour:     "2-digit",
    minute:   "2-digit",
    hourCycle: "h23",
  });
  const [hStr, mStr] = str.split(":");
  const h = parseInt(hStr, 10) % 24;
  const m = parseInt(mStr, 10);
  return { h, m };
}

function getTimezoneStatus(hour: number) {
  const active = hour >= ACTIVE_START || hour < ACTIVE_END;
  if (!active) return "offline";
  if (hour >= 1 && hour < ACTIVE_END) return "slow";
  return "online";
}

export function AvailableHours() {
  const [{ h, m }, setTime] = useState(getGMT2Parts);
  const discordStatus = useDiscordOnline();

  useEffect(() => {
    const tick = () => setTime(getGMT2Parts());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const tzStatus = getTimezoneStatus(h);

  // Discord presence overrides timezone when it says online/idle/dnd
  let status: string;
  if (discordStatus === "online") {
    status = "online";
  } else if (discordStatus === "idle") {
    status = "slow";
  } else if (discordStatus === "dnd") {
    status = "slow";
  } else {
    status = tzStatus;
  }

  const hh       = h.toString().padStart(2, "0");
  const mm       = m.toString().padStart(2, "0");
  const timeStr  = `${hh}:${mm} GMT+2`;

  const label = status === "online" ? (discordStatus === "online" ? "Online Now" : "Online") :
                status === "slow"   ? "Slow replies" :
                "Unavailable";
  const color = status === "online" ? "#4ade80" : status === "slow" ? "#facc15" : "#f87171";
  const glow  = status === "online" ? "#4ade8040" : status === "slow" ? "#facc1540" : "#f8717140";

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
      title="Available 12 PM – 3 AM GMT+2"
    >
      <motion.span
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "inline-block", width: 6, height: 6, borderRadius: "50%",
          background: color, boxShadow: `0 0 6px ${glow}`, flexShrink: 0,
        }}
      />
      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
        {label}
      </span>
      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
        {timeStr}
      </span>
    </motion.div>
  );
}
