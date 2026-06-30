import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiscordData {
  available: boolean;
  username?: string;
  displayName?: string;
  avatar?: string | null;
  status?: "online" | "idle" | "dnd" | "offline";
  customStatus?: string | null;
  activity?: string | null;
}

const STATUS_COLOR: Record<string, string> = {
  online:  "#4ade80",
  idle:    "#facc15",
  dnd:     "#f87171",
  offline: "#6b7280",
};

const STATUS_LABEL: Record<string, string> = {
  online:  "Online",
  idle:    "Away",
  dnd:     "Do Not Disturb",
  offline: "Offline",
};

export function DiscordStatus() {
  const [data, setData] = useState<DiscordData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/discord-status");
        if (!res.ok) return;
        const json = await res.json() as DiscordData;
        if (!cancelled) setData(json);
      } catch {}
    };

    load();
    const id = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (!data?.available) return null;

  const status = data.status ?? "offline";
  const dot = STATUS_COLOR[status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="glass rounded-2xl p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Discord Presence</p>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={data.displayName ?? "Discord"}
                className="w-12 h-12 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.1)" }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(88,101,242,0.3)", border: "2px solid rgba(88,101,242,0.4)" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#5865f2]">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </div>
            )}
            {/* Status dot */}
            <motion.span
              animate={{ opacity: status === "online" ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 13, height: 13, borderRadius: "50%",
                background: dot,
                border: "2px solid rgba(6,6,18,0.95)",
                boxShadow: `0 0 6px ${dot}60`,
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold text-white truncate">
                {data.displayName ?? data.username ?? "mysticfusion7x"}
              </p>
              {/* Discord verification-style mark */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <circle cx="12" cy="12" r="12" fill="#5865F2"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[11px] mb-1" style={{ color: dot }}>
              {STATUS_LABEL[status]}
            </p>
            {data.customStatus && (
              <p className="text-[10px] text-white/35 truncate">
                {data.customStatus}
              </p>
            )}
            {!data.customStatus && data.activity && (
              <p className="text-[10px] text-white/30 truncate">
                Playing {data.activity}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Compact inline badge for the AvailableHours — returns online status only */
export function useDiscordOnline(): "online" | "idle" | "dnd" | "offline" | null {
  const [status, setStatus] = useState<"online" | "idle" | "dnd" | "offline" | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/discord-status");
        if (!res.ok) return;
        const json = await res.json() as DiscordData;
        if (!cancelled && json.available && json.status) setStatus(json.status);
      } catch {}
    };
    load();
    const id = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return status;
}
