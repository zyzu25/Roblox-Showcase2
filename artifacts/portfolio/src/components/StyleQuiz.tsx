import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, RotateCcw, ExternalLink } from "lucide-react";

const questions = [
  {
    q: "What type of game are you building?",
    opts: ["Simulator", "FPS / Military", "RPG / Adventure", "Other"],
  },
  {
    q: "How many screens do you need?",
    opts: ["1-2 screens", "3-4 screens", "5-7 screens", "8+ screens"],
  },
  {
    q: "What vibe fits your game?",
    opts: ["Clean & Modern", "Dark & Gritty", "Bright & Fun", "Minimal"],
  },
  {
    q: "What's your budget range?",
    opts: ["$5-$15", "$15-$50", "$50-$100", "$100+"],
  },
];

const packages: Record<string, { name: string; price: string; desc: string; days: string; color: string }> = {
  starter: { name: "Starter UI", price: "$5–$15", days: "1-2 days", color: "#4ade80", desc: "Perfect for a simple 1-2 screen UI. Clean, fast, and affordable." },
  game: { name: "Game UI Package", price: "$15–$50", days: "2-5 days", color: "var(--c-primary)", desc: "Up to 4 connected screens. The most popular choice for growing games." },
  full: { name: "Full Game UI", price: "$50–$100", days: "5-10 days", color: "#22d3ee", desc: "Complete UI system with 5+ screens, cohesive style, and full polish." },
  premium: { name: "Premium UI", price: "$100+", days: "1-3 weeks", color: "#f59e0b", desc: "High-end, large-scale UI for games that demand a strong visual identity." },
};

type ResultState =
  | { mismatch: false; pkg: keyof typeof packages }
  | { mismatch: true; neededPkg: keyof typeof packages; affordPkg: keyof typeof packages; neededPrice: string; gap: number };

function getResult(answers: number[]): ResultState {
  const [, screens, , budget] = answers;
  // screens: 0="1-2 screens", 1="3-4", 2="5-7", 3="8+"
  // budget:  0="$5-$15",      1="$15-$50", 2="$50-$100", 3="$100+"

  const byScreens: Array<keyof typeof packages> = ["starter", "game", "full", "premium"];
  const neededPkg  = byScreens[screens];

  const byBudget: Array<keyof typeof packages> = ["starter", "game", "full", "premium"];
  const affordPkg  = byBudget[budget];

  const rank: Record<keyof typeof packages, number> = { starter: 0, game: 1, full: 2, premium: 3 };
  const gap = rank[neededPkg] - rank[affordPkg];

  if (gap > 0) {
    // Budget can't cover the scope — show the "math doesn't work" screen
    const neededPrice = packages[neededPkg].price;
    return { mismatch: true, neededPkg, affordPkg, neededPrice, gap };
  }
  return { mismatch: false, pkg: neededPkg };
}

export function StyleQuiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const resultState = done ? getResult(answers) : null;
  const result = resultState && !resultState.mismatch ? packages[resultState.pkg] : null;

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };
  const close = () => { setOpen(false); setTimeout(reset, 400); };

  const pick = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <>
      {/* Trigger button — bottom right */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setOpen(true)}
        title="Style Quiz"
        className="fixed bottom-6 right-6 z-[200] h-10 px-4 rounded-full flex items-center gap-2 border border-white/15 backdrop-blur-md cursor-pointer text-xs font-semibold"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: "rgba(255,255,255,0.6)",
          transition: "background 0.3s ease",
        }}
        whileHover={{ scale: 1.05, background: "rgba(100,0,255,0.25)", color: "#fff" }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
        Not sure what you need?
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[300]"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-0 z-[301] flex items-center justify-center p-6"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(8,6,20,0.97)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                  pointerEvents: "auto",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/7">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none">Package Finder</p>
                      <p className="text-[10px] text-white/30 mt-0.5">4 quick questions</p>
                    </div>
                  </div>
                  <button onClick={close} className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="px-6 py-6">
                  <AnimatePresence mode="wait">
                    {!done ? (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {/* Progress */}
                        <div className="flex gap-1.5 mb-5">
                          {questions.map((_, i) => (
                            <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-300"
                              style={{ background: i <= step ? "var(--c-primary)" : "rgba(255,255,255,0.1)" }} />
                          ))}
                        </div>

                        <p className="text-[10px] text-white/35 uppercase tracking-wide mb-2">Question {step + 1} of {questions.length}</p>
                        <h3 className="text-base font-bold text-white mb-5 leading-snug">{questions[step].q}</h3>

                        <div className="space-y-2.5">
                          {questions[step].opts.map((opt, i) => (
                            <motion.button
                              key={opt}
                              onClick={() => pick(i)}
                              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/60 transition-all"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                              }}
                              whileHover={{
                                background: "rgba(100,0,255,0.12)",
                                borderColor: "rgba(120,60,255,0.35)",
                                color: "#fff",
                                x: 4,
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="flex items-center justify-between">
                                {opt}
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" style={{ color: "var(--c-primary)" }} />
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ) : resultState?.mismatch ? (
                      /* ── Budget mismatch screen ── */
                      <motion.div
                        key="mismatch"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="text-center"
                      >
                        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.25)" }}>
                          <span className="text-2xl leading-none select-none">💸</span>
                        </div>

                        <p className="text-[10px] text-white/35 uppercase tracking-wide mb-1">Heads up</p>
                        <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                          The math ain't mathing
                        </h3>
                        <p className="text-sm text-white/45 leading-relaxed mb-5 px-1">
                          That many screens costs more than your budget allows. Here's the gap:
                        </p>

                        {/* Gap visual */}
                        <div className="rounded-xl p-4 mb-5 text-left space-y-3"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Your scope needs</span>
                            <span className="text-sm font-bold" style={{ color: "#f87171" }}>
                              {packages[resultState.neededPkg].name} · {resultState.neededPrice}
                            </span>
                          </div>
                          <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/40">Your budget covers</span>
                            <span className="text-sm font-bold" style={{ color: "var(--c-primary)" }}>
                              {packages[resultState.affordPkg].name} · {packages[resultState.affordPkg].price}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-white/30 leading-relaxed mb-5 px-1">
                          Either reduce the number of screens, raise your budget, or DM me — sometimes we can work something out.
                        </p>

                        <div className="flex flex-col gap-2.5">
                          <a
                            href="https://discord.com/users/mysticfusion7x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white btn-primary"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Let's talk it out
                          </a>
                          <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                          >
                            <RotateCcw className="w-3 h-3" />
                            Adjust my answers
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* ── Normal match screen ── */
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="text-center"
                      >
                        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                          style={{ background: `${result!.color}18`, border: `1px solid ${result!.color}35` }}>
                          <Sparkles className="w-6 h-6" style={{ color: result!.color }} />
                        </div>

                        <p className="text-[10px] text-white/35 uppercase tracking-wide mb-1">Your match</p>
                        <h3 className="text-xl font-bold text-white mb-1">{result!.name}</h3>
                        <p className="text-2xl font-bold mb-1" style={{ color: result!.color }}>{result!.price}</p>
                        <p className="text-[11px] text-white/30 mb-4">Delivered in {result!.days}</p>

                        <p className="text-sm text-white/50 leading-relaxed mb-6 px-2">{result!.desc}</p>

                        <div className="flex flex-col gap-2.5">
                          <a
                            href="https://discord.com/users/mysticfusion7x"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white btn-primary"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Commission This Package
                          </a>
                          <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retake Quiz
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
