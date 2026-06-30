import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Volume1, Music, ChevronDown } from "lucide-react";

interface Track {
  id: string;
  label: string;
  src: string | null;
  youtubeId: string | null;
}

const TRACKS: Track[] = [
  { id: "ambient",   label: "Let Go - Ark Patrol",                   src: "/ambient.mp3",    youtubeId: null },
  { id: "jazz-noir", label: "The Last Sip Comes Slow - Sean Broke",  src: "/jazz-noir.mp3",  youtubeId: null },
];

function pickRandom(): Track {
  return TRACKS[Math.floor(Math.random() * TRACKS.length)];
}

const DEFAULT_VOLUME = 0.25;

export function AmbientAudio() {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const iframeRef  = useRef<HTMLIFrameElement | null>(null);

  const [track,      setTrack]      = useState<Track>(() => pickRandom());
  const [playing,    setPlaying]    = useState(false);
  const [ready,      setReady]      = useState(false);
  const [volume,     setVolume]     = useState(DEFAULT_VOLUME);
  const [showPanel,  setShowPanel]  = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [ytReady,    setYtReady]    = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isLocal = track.src !== null;
  const isYT    = track.youtubeId !== null;

  /* ── Local audio ── */
  useEffect(() => {
    if (!isLocal) return;
    const audio = new Audio(track.src!);
    audio.loop   = true;
    audio.volume = volume;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    const onCanPlay = () => { setReady(true); tryPlay(); };
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });
    const onFirstClick = () => { if (!audio.paused) return; tryPlay(); };
    document.addEventListener("pointerdown", onFirstClick, { once: true });

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      document.removeEventListener("pointerdown", onFirstClick);
    };
  }, [track.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── YouTube iframe ── */
  useEffect(() => {
    if (!isYT) return;
    setYtReady(false);
    const onMsg = (ev: MessageEvent) => {
      try {
        const d = JSON.parse(typeof ev.data === "string" ? ev.data : "{}");
        if (d.event === "onReady") setYtReady(true);
        if (d.event === "onStateChange" && d.info === 1) setPlaying(true);
        if (d.event === "onStateChange" && d.info === 2) setPlaying(false);
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [track.id]);

  const sendYT = useCallback((func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }), "*"
    );
  }, []);

  useEffect(() => {
    if (!isYT || !ytReady) return;
    if (playing) sendYT("playVideo"); else sendYT("pauseVideo");
  }, [playing, ytReady, isYT, sendYT]);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!showPanel && !showTracks) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
        setShowTracks(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel, showTracks]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocal && audioRef.current) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}); }
    } else if (isYT) {
      setPlaying(p => !p);
    }
  };

  const switchTrack = (t: Track) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    setPlaying(false);
    setYtReady(false);
    setReady(false);
    setTrack(t);
    setShowTracks(false);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      {/* Hidden YouTube iframe */}
      {isYT && (
        <iframe
          ref={iframeRef}
          key={track.youtubeId!}
          src={`https://www.youtube.com/embed/${track.youtubeId}?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=${track.youtubeId}`}
          allow="autoplay"
          style={{ position: "fixed", width: 1, height: 1, opacity: 0, bottom: 0, right: 0, border: "none", pointerEvents: "none" }}
          title="bg-music"
        />
      )}

      <div ref={panelRef} className="fixed bottom-20 right-6 z-[8500] flex flex-col items-end gap-2">

        {/* Track picker */}
        <AnimatePresence>
          {showTracks && (
            <motion.div
              key="tracks"
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.94 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(6,4,18,0.94)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                minWidth: 188,
              }}
            >
              <div className="px-4 pt-3 pb-3">
                <p className="text-[9px] uppercase tracking-widest font-semibold text-white/25 mb-2">Tracks</p>
                {TRACKS.map(t => {
                  const active = t.id === track.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => switchTrack(t)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-1 text-left transition-all"
                      style={{
                        background: active ? "rgba(255,255,255,0.08)" : "transparent",
                        border: active ? "1px solid var(--c-border-soft)" : "1px solid transparent",
                      }}
                    >
                      <Music className="w-3 h-3 flex-shrink-0"
                        style={{ color: active ? "var(--c-primary)" : "rgba(255,255,255,0.30)" }} />
                      <span className="text-xs font-medium flex-1"
                        style={{ color: active ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.45)" }}>
                        {t.label}
                      </span>
                      {t.youtubeId && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(255,0,0,0.15)", color: "rgba(255,100,100,0.8)", border: "1px solid rgba(255,0,0,0.15)" }}>
                          YT
                        </span>
                      )}
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1"
                          style={{ background: "var(--c-primary)", boxShadow: "0 0 6px var(--c-glow)" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/10 backdrop-blur-xl"
              style={{ background: "rgba(8,8,10,0.85)", minWidth: 44 }}
              onClick={e => e.stopPropagation()}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                disabled={isYT}
                className="audio-slider"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  height: 90,
                  width: 4,
                  cursor: isYT ? "not-allowed" : "pointer",
                  appearance: "slider-vertical" as React.CSSProperties["appearance"],
                  WebkitAppearance: "slider-vertical",
                  accentColor: "var(--c-primary)",
                  opacity: isYT ? 0.35 : 1,
                }}
              />
              <span className="text-[10px] text-white/35 font-medium tabular-nums">
                {isYT ? "YT" : `${Math.round(volume * 100)}%`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-1.5"
        >
          {/* Track selector */}
          <motion.button
            onClick={() => { setShowTracks(p => !p); setShowPanel(false); }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="Switch track"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md cursor-pointer"
            style={{ background: showTracks ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.4)", transition: "background 0.3s" }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <Music className="w-3 h-3 text-white/40" />
              <ChevronDown className="w-2 h-2 text-white/25" />
            </div>
          </motion.button>

          {/* Volume icon */}
          <motion.button
            onClick={() => { setShowPanel(p => !p); setShowTracks(false); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Adjust volume"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md cursor-pointer"
            style={{ background: showPanel ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.4)", transition: "background 0.3s" }}
          >
            <VolumeIcon className="w-3.5 h-3.5 text-white/45" />
          </motion.button>

          {/* Main play/pause */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            title={playing ? "Pause music" : "Play music"}
            className="relative w-10 h-10 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer"
            style={{
              background: playing ? "rgba(100,0,255,0.20)" : "rgba(0,0,0,0.45)",
              boxShadow: playing ? "0 0 20px var(--c-glow-soft)" : "none",
              transition: "background 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.span key="on"
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Volume2 className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
                </motion.span>
              ) : (
                <motion.span key="off"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <VolumeX className="w-4 h-4 text-white/35" />
                </motion.span>
              )}
            </AnimatePresence>
            {playing && (
              <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{ scale: [1, 1.65, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ border: "1px solid var(--c-primary)" }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
