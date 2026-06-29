import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.30;
    audio.loop = true;

    const onCanPlay = () => {
      setReady(true);
      audio.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        setShowHint(true);
      });
    };
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });

    const handleFirstClick = () => {
      if (!playing && ready) {
        audio.play().then(() => {
          setPlaying(true);
          setShowHint(false);
        }).catch(() => {});
      }
    };
    document.addEventListener("click", handleFirstClick, { once: true });

    return () => {
      document.removeEventListener("click", handleFirstClick);
    };
  }, [ready, playing]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        setShowHint(false);
      }).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/ambient.mp3" preload="auto" />

      <motion.div
        className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              className="text-xs text-white/50 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap"
            >
              Click to play ambient music
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggle}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          title={playing ? "Pause ambient music" : "Play ambient music"}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer"
          style={{
            background: playing
              ? "rgba(var(--c-primary-rgb, 100,0,255), 0.18)"
              : "rgba(0,0,0,0.45)",
            boxShadow: playing
              ? "0 0 20px var(--c-glow-soft), 0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.4)",
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.span
                key="on"
                initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2
                  className="w-4 h-4"
                  style={{ color: "var(--c-primary)" }}
                />
              </motion.span>
            ) : (
              <motion.span
                key="off"
                initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: -15 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX className="w-4 h-4 text-white/40" />
              </motion.span>
            )}
          </AnimatePresence>

          {playing && (
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ border: "1px solid var(--c-primary)", pointerEvents: "none" }}
            />
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
