import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DiscordData {
  available: boolean;
  userId?: string;
  username?: string;
  displayName?: string;
  discriminator?: string;
  avatar?: string | null;
  banner?: string | null;
  bannerColor?: string | null;
  status?: "online" | "idle" | "dnd" | "offline";
  customStatus?: string | null;
  customEmoji?: string | null;
  activity?: string | null;
  activityDetails?: string | null;
  activityState?: string | null;
  activityType?: number | null;
}

export const STATUS_COLOR: Record<string, string> = {
  online:  "#23a559",
  idle:    "#f0b232",
  dnd:     "#f23f43",
  offline: "#80848e",
};

export const STATUS_LABEL: Record<string, string> = {
  online:  "Online",
  idle:    "Away",
  dnd:     "Do Not Disturb",
  offline: "Offline",
};

export const STATUS_AVAIL: Record<string, string> = {
  online:  "Available",
  idle:    "Away",
  dnd:     "Do Not Disturb",
  offline: "Unavailable",
};

// ── Shared fetch hook ────────────────────────────────────────────────────────
let _cache: DiscordData | null = null;
const _listeners = new Set<(d: DiscordData | null) => void>();

async function fetchDiscord() {
  try {
    const res = await fetch("/api/discord-status");
    if (!res.ok) return;
    const json = (await res.json()) as DiscordData;
    _cache = json;
    _listeners.forEach((fn) => fn(json));
  } catch { /* silent */ }
}

let _interval: ReturnType<typeof setInterval> | null = null;
function ensurePolling() {
  if (_interval) return;
  fetchDiscord();
  _interval = setInterval(fetchDiscord, 30_000);
}

export function useDiscordData(): DiscordData | null {
  const [data, setData] = useState<DiscordData | null>(_cache);
  useEffect(() => {
    _listeners.add(setData);
    ensurePolling();
    if (_cache) setData(_cache);
    return () => { _listeners.delete(setData); };
  }, []);
  return data;
}

export function useDiscordOnline(): "online" | "idle" | "dnd" | "offline" | null {
  const data = useDiscordData();
  if (!data?.available || !data.status) return null;
  return data.status;
}

// ── Discord-style profile popup card ────────────────────────────────────────
export function DiscordProfileCard({ data }: { data: DiscordData }) {
  const status  = data.status ?? "offline";
  const dot     = STATUS_COLOR[status];
  const bgColor = data.bannerColor ?? "#1e1f22";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="absolute z-[999] left-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "#111214",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Banner */}
      <div
        className="h-16 w-full"
        style={{
          background: data.banner
            ? `url(${data.banner}) center/cover no-repeat`
            : `linear-gradient(135deg, ${bgColor}cc, ${bgColor}44)`,
        }}
      />

      {/* Avatar row */}
      <div className="px-4 pb-0 relative" style={{ marginTop: -28 }}>
        <div className="relative inline-block">
          {data.avatar ? (
            <img
              src={data.avatar}
              alt={data.displayName ?? "Discord"}
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: "4px solid #111214" }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(88,101,242,0.3)", border: "4px solid #111214" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#5865f2]">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            </div>
          )}
          {/* Status dot */}
          <span
            style={{
              position: "absolute", bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: "50%",
              background: dot,
              border: "3px solid #111214",
              boxShadow: `0 0 6px ${dot}80`,
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-2 pb-4 space-y-3">
        {/* Name */}
        <div>
          <p className="text-base font-bold text-white leading-tight">
            {data.displayName ?? data.username ?? "mysticfusion7x"}
          </p>
          <p className="text-xs text-white/40">{data.username ?? "mysticfusion7x"}</p>
        </div>

        <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* Status */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Discord Status</p>
          <div className="flex items-center gap-2">
            <span
              style={{ width: 10, height: 10, borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}`, display: "inline-block", flexShrink: 0 }}
            />
            <span className="text-sm font-medium" style={{ color: dot }}>{STATUS_LABEL[status]}</span>
          </div>
          {data.customStatus && (
            <p className="text-xs text-white/45 pl-5 leading-relaxed">
              {data.customEmoji && `${data.customEmoji} `}{data.customStatus}
            </p>
          )}
        </div>

        {/* Activity */}
        {data.activity && (
          <>
            <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {data.activityType === 0 ? "Playing" : data.activityType === 2 ? "Listening to" : "Activity"}
              </p>
              <p className="text-sm text-white/70 font-medium leading-tight">{data.activity}</p>
              {data.activityDetails && (
                <p className="text-xs text-white/35">{data.activityDetails}</p>
              )}
              {data.activityState && (
                <p className="text-xs text-white/30">{data.activityState}</p>
              )}
            </div>
          </>
        )}

        {/* Discord button */}
        <a
          href={`https://discord.com/users/${data.userId ?? "1064172887839342674"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold text-white transition-all"
          style={{ background: "#5865f2", border: "none" }}
          onClick={e => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Message on Discord
        </a>
      </div>
    </motion.div>
  );
}

// ── Full card for About section ──────────────────────────────────────────────
export function DiscordStatus() {
  const data = useDiscordData();

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
          <div className="relative flex-shrink-0">
            {data.avatar ? (
              <img src={data.avatar} alt={data.displayName ?? "Discord"} className="w-12 h-12 rounded-full object-cover"
                style={{ border: "2px solid rgba(255,255,255,0.1)" }} />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "rgba(88,101,242,0.3)", border: "2px solid rgba(88,101,242,0.4)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#5865f2]">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </div>
            )}
            <motion.span
              animate={{ opacity: status === "online" ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: "50%", background: dot, border: "2px solid rgba(6,6,18,0.95)", boxShadow: `0 0 6px ${dot}60`, display: "block" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold text-white truncate">{data.displayName ?? data.username ?? "mysticfusion7x"}</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <circle cx="12" cy="12" r="12" fill="#5865F2"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[11px] mb-1" style={{ color: dot }}>{STATUS_LABEL[status]}</p>
            {data.customStatus && <p className="text-[10px] text-white/35 truncate">{data.customStatus}</p>}
            {!data.customStatus && data.activity && <p className="text-[10px] text-white/30 truncate">Playing {data.activity}</p>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
