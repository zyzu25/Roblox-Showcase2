import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, RotateCcw, CheckCircle2, Clock, DollarSign } from "lucide-react";

/* ── Questions ────────────────────────────────────────────────────────────── */
const questions = [
  {
    q: "What best describes your project?",
    hint: "Pick the closest match to your scope",
    opts: [
      { label: "Single feature UI",      sub: "Shop, HUD, leaderboard, one screen",   weight: 0 },
      { label: "Full game UI",           sub: "Hub + 3–5 connected screens",           weight: 1 },
      { label: "Large multi-system game",sub: "6+ screens, multiple UI systems",       weight: 2 },
      { label: "Complete brand identity",sub: "Custom style guide, everything built",  weight: 3 },
    ],
  },
  {
    q: "How many UI screens do you need?",
    hint: "Count each distinct window or frame",
    opts: [
      { label: "1–2 screens",  sub: "e.g. just a shop or just a HUD",        weight: 0 },
      { label: "3–4 screens",  sub: "e.g. HUD + shop + inventory",            weight: 1 },
      { label: "5–7 screens",  sub: "e.g. full game hub with multiple menus", weight: 2 },
      { label: "8+ screens",   sub: "Full game suite or complex system",       weight: 3 },
    ],
  },
  {
    q: "How polished do you want it?",
    hint: "Higher polish = more time, higher tier",
    opts: [
      { label: "Clean & functional",     sub: "No frills, gets the job done",          weight: 0 },
      { label: "Professionally polished",sub: "Gradients, icons, smooth feel",         weight: 1 },
      { label: "Premium / cinematic",    sub: "Complex layouts, high visual impact",   weight: 2 },
      { label: "Fastest delivery first", sub: "I prioritize speed over detail",        weight: -1 },
    ],
  },
  {
    q: "What's your total budget?",
    hint: "This determines what's feasible for your scope",
    opts: [
      { label: "Under $15",   sub: "Best for small, simple requests",   weight: 0 },
      { label: "$15 – $50",   sub: "Mid-range, most popular",           weight: 1 },
      { label: "$50 – $100",  sub: "Full-featured, detailed builds",    weight: 2 },
      { label: "$100+",       sub: "Premium, no compromises",           weight: 3 },
    ],
  },
];

/* ── Packages ─────────────────────────────────────────────────────────────── */
const packages = {
  starter: {
    name: "Starter UI",
    price: "$5–$15",
    days: "1–2 days",
    color: "#4ade80",
    emoji: "🌱",
    includes: ["1–2 UI screens", "Clean, polished design", "1 revision round", "PNG + RBXM file"],
    bestFor: "Single-feature UIs, small games, or tight budgets.",
  },
  game: {
    name: "Game UI Package",
    price: "$15–$50",
    days: "2–5 days",
    color: "var(--c-primary)",
    emoji: "🎮",
    includes: ["3–4 connected screens", "Cohesive style across all frames", "2 revision rounds", "Full source files"],
    bestFor: "Growing games that need a consistent UI system.",
  },
  full: {
    name: "Full Game UI",
    price: "$50–$100",
    days: "5–10 days",
    color: "#22d3ee",
    emoji: "🏆",
    includes: ["5–7 screens", "Unified design system", "3 revision rounds", "Priority support"],
    bestFor: "Established games needing a complete, polished UI suite.",
  },
  premium: {
    name: "Premium UI",
    price: "$100+",
    days: "1–3 weeks",
    color: "#f59e0b",
    emoji: "👑",
    includes: ["8+ screens", "Custom style guide & identity", "Unlimited revisions", "Dedicated collaboration"],
    bestFor: "High-profile games requiring a full brand-level UI experience.",
  },
} as const;

type PackageKey = keyof typeof packages;

/* ── Scoring logic ────────────────────────────────────────────────────────── */
type ResultState =
  | { mismatch: false; pkg: PackageKey; confidence: "exact" | "rounded" }
  | { mismatch: true; neededPkg: PackageKey; affordPkg: PackageKey; neededPrice: string };

function getResult(answers: { weight: number }[][]): ResultState {
  const [project, screens, polish, budget] = answers;

  const projectW = project?.[0]?.weight ?? 0;
  const screenW  = screens?.[0]?.weight  ?? 0;
  const polishW  = polish?.[0]?.weight   ?? 0;
  const budgetW  = budget?.[0]?.weight   ?? 0;

  // Screen count is the primary driver (1.5×), project scope secondary (0.5×), polish tertiary (0.4×)
  const rawScore = screenW * 1.5 + projectW * 0.5 + polishW * 0.4;

  let neededPkg: PackageKey;
  let confidence: "exact" | "rounded" = "exact";

  if      (rawScore < 1.0) neededPkg = "starter";
  else if (rawScore < 2.3) neededPkg = "game";
  else if (rawScore < 3.6) neededPkg = "full";
  else                     neededPkg = "premium";

  // Detect if score is near a boundary (±0.25) → "rounded" confidence
  const boundaries = [1.0, 2.3, 3.6];
  if (boundaries.some(b => Math.abs(rawScore - b) < 0.3)) confidence = "rounded";

  const rank: Record<PackageKey, number> = { starter: 0, game: 1, full: 2, premium: 3 };
  const pkgOrder: PackageKey[] = ["starter", "game", "full", "premium"];
  const affordPkg = pkgOrder[Math.min(budgetW, 3)];

  if (rank[neededPkg] > rank[affordPkg]) {
    return { mismatch: true, neededPkg, affordPkg, neededPrice: packages[neededPkg].price };
  }
  return { mismatch: false, pkg: neededPkg, confidence };
}

/* ── Component ────────────────────────────────────────────────────────────── */
export function StyleQuiz() {
  const [open, setOpen]       = useState(false);
  const [step, setStep]       = useState(0);
  const [picks, setPicks]     = useState<{ weight: number }[][]>([]);
  const [done, setDone]       = useState(false);

  const resultState = done ? getResult(picks) : null;

  const reset = () => { setStep(0); setPicks([]); setDone(false); };
  const close = () => { setOpen(false); setTimeout(reset, 400); };

  const pick = (optIdx: number) => {
    const opt    = questions[step].opts[optIdx];
    const next   = [...picks, [{ weight: opt.weight }]];
    setPicks(next);
    if (step < questions.length - 1) setStep(s => s + 1);
    else setDone(true);
  };

  const pkg = resultState && !resultState.mismatch ? packages[resultState.pkg] : null;

  return (
    <>
      {/* Trigger */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[200] h-10 px-4 rounded-full flex items-center gap-2 border border-white/15 backdrop-blur-md cursor-pointer text-xs font-semibold"
        style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.6)" }}
        whileHover={{ scale: 1.05, background: "rgba(100,0,255,0.25)", color: "#fff" }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
        Not sure what you need?
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[300]"
              style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
            />

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-0 z-[301] flex items-center justify-center p-6"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(7,5,18,0.98)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
                  pointerEvents: "auto",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/7">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-none">Package Finder</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {done ? "Your result is ready" : `Question ${step + 1} of ${questions.length}`}
                      </p>
                    </div>
                  </div>
                  <button onClick={close}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="px-5 py-5">
                  <AnimatePresence mode="wait">

                    {/* ── Questions ── */}
                    {!done && (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {/* Progress bar */}
                        <div className="flex gap-1.5 mb-5">
                          {questions.map((_, i) => (
                            <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden"
                              style={{ background: "rgba(255,255,255,0.08)" }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: "var(--c-primary)" }}
                                initial={{ width: 0 }}
                                animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                                transition={{ duration: 0.4, ease: [0.23,1,0.32,1] }}
                              />
                            </div>
                          ))}
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                          {questions[step].q}
                        </h3>
                        <p className="text-[10px] text-white/30 mb-4">{questions[step].hint}</p>

                        <div className="space-y-2">
                          {questions[step].opts.map((opt, i) => (
                            <motion.button
                              key={opt.label}
                              onClick={() => pick(i)}
                              className="w-full text-left px-4 py-3 rounded-xl transition-all group"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                              whileHover={{
                                background: "rgba(100,0,255,0.11)",
                                borderColor: "rgba(120,60,255,0.30)",
                                x: 3,
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                                    {opt.label}
                                  </p>
                                  <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{opt.sub}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ color: "var(--c-primary)" }} />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ── Mismatch ── */}
                    {done && resultState?.mismatch && (
                      <motion.div
                        key="mismatch"
                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <div className="text-center mb-5">
                          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.22)" }}>
                            <span className="text-xl select-none">💸</span>
                          </div>
                          <h3 className="text-base font-bold text-white mb-1">Scope vs Budget Mismatch</h3>
                          <p className="text-xs text-white/40 leading-relaxed">
                            Based on your answers, your project scope needs a higher budget than selected.
                          </p>
                        </div>

                        <div className="rounded-xl p-4 mb-4 space-y-3"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Your scope needs</p>
                              <p className="text-sm font-bold" style={{ color: "#f87171" }}>
                                {packages[resultState.neededPkg].name}
                              </p>
                              <p className="text-xs text-white/35">{resultState.neededPrice}</p>
                            </div>
                            <DollarSign className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "#f87171" }} />
                          </div>
                          <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Your budget covers</p>
                              <p className="text-sm font-bold" style={{ color: "var(--c-primary)" }}>
                                {packages[resultState.affordPkg].name}
                              </p>
                              <p className="text-xs text-white/35">{packages[resultState.affordPkg].price}</p>
                            </div>
                            <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--c-primary)" }} />
                          </div>
                        </div>

                        <p className="text-[10px] text-white/30 leading-relaxed mb-4 text-center">
                          Options: reduce screen count, raise your budget, or DM me — sometimes we can work something out.
                        </p>

                        <div className="flex flex-col gap-2">
                          <a href="https://discord.com/users/1064172887839342674" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
                            Let's talk it out
                          </a>
                          <button onClick={reset}
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <RotateCcw className="w-3 h-3" /> Adjust my answers
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ── Match ── */}
                    {done && pkg && !resultState?.mismatch && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                      >
                        {/* Package header */}
                        <div className="flex items-center gap-3 p-4 rounded-2xl mb-4"
                          style={{ background: `${pkg.color === "var(--c-primary)" ? "rgba(100,0,255" : pkg.color.replace("#","rgba(").replace(/^rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/, (_,r,g,b) => `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)}`)},0.10)`, border: `1px solid ${pkg.color}30` }}>
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                            style={{ background: "rgba(0,0,0,0.35)" }}>
                            {pkg.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Your match</p>
                            <p className="text-sm font-bold text-white leading-none">{pkg.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold" style={{ color: pkg.color }}>{pkg.price}</span>
                              <span className="text-white/20">·</span>
                              <span className="text-[10px] text-white/35 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />{pkg.days}
                              </span>
                            </div>
                          </div>
                          {resultState.confidence === "rounded" && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full text-white/40 flex-shrink-0"
                              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              ~match
                            </span>
                          )}
                        </div>

                        {/* Best for */}
                        <p className="text-[11px] text-white/40 leading-relaxed mb-4 px-1">{pkg.bestFor}</p>

                        {/* Includes */}
                        <div className="rounded-xl p-3.5 mb-4"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className="text-[9px] uppercase tracking-widest text-white/25 mb-2.5">What's included</p>
                          <div className="space-y-1.5">
                            {pkg.includes.map(item => (
                              <div key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: pkg.color }} />
                                <span className="text-xs text-white/55">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <a href="https://discord.com/users/1064172887839342674" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
                            Commission This Package
                          </a>
                          <button onClick={reset}
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <RotateCcw className="w-3 h-3" /> Retake Quiz
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
