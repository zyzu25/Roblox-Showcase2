import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

const DEFAULT_VOLUME = 0.25;

export function AmbientAudio() {
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [ready,   setReady]     = useState(false);
  const [volume,  setVolume]    = useState(DEFAULT_VOLUME);
  const [showPanel, setShowPanel] = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);

  /* Init audio & attempt autoplay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = DEFAULT_VOLUME;
    audio.loop   = true;

    const tryPlay = () => {
      audio.play().then(() => { setPlaying(true); }).catch(() => {});
    };

    const onCanPlay = () => {
      setReady(true);
      tryPlay();
    };
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });

    /* Fallback: first user interaction unlocks autoplay */
    const onFirstClick = () => {
      if (audioRef.current && !audioRef.current.paused) return;
      tryPlay();
    };
    document.addEventListener("pointerdown", onFirstClick, { once: true });

    return () => {
      document.removeEventListener("pointerdown", onFirstClick);
    };
  }, []);

  /* Sync volume to audio element */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* Close panel on outside click */
  useEffect(() => {
    if (!showPanel) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setShowPanel(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  }, []);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" preload="auto" />

      <div
        ref={panelRef}
        className="fixed bottom-20 right-6 z-[200] flex flex-col items-end gap-2"
      >
        {/* Volume panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center gap-3 px-4 py-3.5 rounded-2xl border border-white/10 backdrop-blur-xl"
              style={{ background: "rgba(8,8,10,0.85)", minWidth: 44 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Vertical slider */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                className="audio-slider"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                  height: 90,
                  width: 4,
                  cursor: "pointer",
                  appearance: "slider-vertical" as React.CSSProperties["appearance"],
                  WebkitAppearance: "slider-vertical",
                  accentColor: "var(--c-primary)",
                }}
              />
              <span className="text-[10px] text-white/35 font-medium tabular-nums">
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/pause + volume toggle button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-1.5"
        >
          {/* Volume icon button */}
          <motion.button
            onClick={() => setShowPanel(p => !p)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Adjust volume"
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md cursor-pointer"
            style={{
              background: showPanel ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.4)",
              transition: "background 0.3s ease",
            }}
          >
            <VolumeIcon className="w-3.5 h-3.5 text-white/45" />
          </motion.button>

          {/* Main play/pause button */}
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            title={playing ? "Pause ambient music" : "Play ambient music"}
            className="relative w-10 h-10 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer"
            style={{
              background: playing ? "rgba(100,0,255,0.20)" : "rgba(0,0,0,0.45)",
              boxShadow: playing ? "0 0 20px var(--c-glow-soft)" : "none",
              transition: "background 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {playing ? (
                <motion.span
                  key="on"
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Volume2 className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
                </motion.span>
              ) : (
                <motion.span
                  key="off"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <VolumeX className="w-4 h-4 text-white/35" />
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pulsing ring when playing */}
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
