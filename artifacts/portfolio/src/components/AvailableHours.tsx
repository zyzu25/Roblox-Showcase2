import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscordData, useDiscordOnline, DiscordProfileCard, STATUS_COLOR, STATUS_AVAIL } from "./DiscordStatus";

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

function getTimezoneStatus(hour: number): "online" | "slow" | "offline" {
  const active = hour >= ACTIVE_START || hour < ACTIVE_END;
  if (!active) return "offline";
  if (hour >= 1 && hour < ACTIVE_END) return "slow";
  return "online";
}

export function AvailableHours() {
  const [{ h, m }, setTime] = useState(getGMT2Parts);
  const discordStatus = useDiscordOnline();
  const discordData   = useDiscordData();
  const [hovering, setHovering]   = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setTime(getGMT2Parts());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const tzStatus = getTimezoneStatus(h);

  // Discord presence overrides timezone when present
  let resolvedStatus: "online" | "slow" | "offline";
  if (discordStatus === "online")  resolvedStatus = "online";
  else if (discordStatus === "idle") resolvedStatus = "slow";
  else if (discordStatus === "dnd")  resolvedStatus = "slow";
  else resolvedStatus = tzStatus;

  const hh      = h.toString().padStart(2, "0");
  const mm      = m.toString().padStart(2, "0");
  const timeStr = `${hh}:${mm} GMT+2`;

  // Label — prefer Discord-aware status
  let availLabel: string;
  if (discordStatus === "online")   availLabel = "Available";
  else if (discordStatus === "idle")  availLabel = "Away";
  else if (discordStatus === "dnd")   availLabel = "Do Not Disturb";
  else if (discordStatus === "offline") availLabel = "Unavailable";
  else availLabel = resolvedStatus === "online" ? "Available" : resolvedStatus === "slow" ? "Away" : "Unavailable";

  const color = resolvedStatus === "online" ? "#23a559" : resolvedStatus === "slow" ? "#f0b232" : "#f23f43";
  const glow  = resolvedStatus === "online" ? "#23a55940" : resolvedStatus === "slow" ? "#f0b23240" : "#f23f4340";

  const showCard = hovering && discordData?.available;

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovering(true);
  };
  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setHovering(false), 200);
  };

  return (
    <div ref={wrapRef} className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-default select-none"
        style={{
          background: hovering && showCard ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
          transition: "background 0.2s ease",
        }}
      >
        {/* Animated status dot */}
        <motion.span
          animate={{ opacity: resolvedStatus === "online" ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "inline-block", width: 7, height: 7, borderRadius: "50%",
            background: color, boxShadow: `0 0 7px ${glow}`, flexShrink: 0,
          }}
        />

        {/* Status label */}
        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
          {availLabel}
        </span>

        {/* Time */}
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
          {timeStr}
        </span>

        {/* Discord icon hint */}
        {discordData?.available && (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 10, height: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        )}
      </motion.div>

      {/* Hover profile card */}
      <AnimatePresence>
        {showCard && discordData && (
          <DiscordProfileCard data={discordData} />
        )}
      </AnimatePresence>
    </div>
  );
}
