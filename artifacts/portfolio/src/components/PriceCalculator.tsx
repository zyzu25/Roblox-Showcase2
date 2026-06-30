import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, Zap, ExternalLink } from "lucide-react";

const COMPLEXITY = ["Simple", "Standard", "Complex"] as const;
type Complexity = typeof COMPLEXITY[number];

function calcPrice(screens: number, complexity: Complexity, rush: boolean, robux: boolean) {
  let label = "";
  let low = 0;
  let high = 0;
  let days = "";

  if (screens <= 2 && complexity === "Simple") {
    label = "Starter UI"; low = 5; high = 15; days = "1-2 days";
  } else if (screens <= 2 && complexity === "Standard") {
    label = "Starter UI"; low = 10; high = 20; days = "1-3 days";
  } else if (screens <= 2 && complexity === "Complex") {
    label = "Game UI Package"; low = 20; high = 35; days = "2-4 days";
  } else if (screens <= 4 && complexity === "Simple") {
    label = "Game UI Package"; low = 15; high = 35; days = "2-4 days";
  } else if (screens <= 4 && complexity === "Standard") {
    label = "Game UI Package"; low = 25; high = 50; days = "3-5 days";
  } else if (screens <= 4 && complexity === "Complex") {
    label = "Full Game UI"; low = 45; high = 70; days = "4-7 days";
  } else if (screens <= 6 && complexity !== "Complex") {
    label = "Full Game UI"; low = 50; high = 80; days = "5-8 days";
  } else {
    label = screens >= 7 || complexity === "Complex" ? "Premium UI" : "Full Game UI";
    low = complexity === "Complex" ? 80 : 60;
    high = complexity === "Complex" ? 150 : 100;
    days = "1-3 weeks";
  }

  if (rush) { low += 5; high += 5; }

  if (robux) {
    return { label, low: Math.round(low * 250), high: Math.round(high * 250), days, currency: "R$" };
  }
  return { label, low, high, days, currency: "$" };
}

export function PriceCalculator() {
  const [open, setOpen] = useState(false);
  const [screens, setScreens] = useState(2);
  const [complexity, setComplexity] = useState<Complexity>("Standard");
  const [rush, setRush] = useState(false);
  const [robux, setRobux] = useState(false);

  const result = calcPrice(screens, complexity, rush, robux);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setOpen(o => !o)}
        title="Price Calculator"
        className="fixed bottom-6 left-6 z-[200] w-12 h-12 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer"
        style={{
          background: open ? "rgba(100,0,255,0.30)" : "rgba(0,0,0,0.55)",
          boxShadow: open ? "0 0 24px var(--c-glow)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="calc" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Calculator className="w-5 h-5" style={{ color: "var(--c-primary)" }} />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{ border: "1px solid var(--c-primary)" }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 left-6 z-[199] w-80 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(6,6,18,0.94)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/7 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                <Calculator className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-none">Price Calculator</p>
                <p className="text-[10px] text-white/30 mt-0.5">Live estimate · Instant</p>
              </div>
            </div>

            <div className="px-4 py-4 space-y-5">
              {/* Screens slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Screens</span>
                  <span className="text-xs font-bold" style={{ color: "var(--c-primary)" }}>
                    {screens === 8 ? "8+" : screens}
                  </span>
                </div>
                <input
                  type="range" min={1} max={8} value={screens}
                  onChange={e => setScreens(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--c-primary) ${((screens - 1) / 7) * 100}%, rgba(255,255,255,0.1) ${((screens - 1) / 7) * 100}%)`,
                    accentColor: "var(--c-primary)",
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-white/20">1</span>
                  <span className="text-[9px] text-white/20">8+</span>
                </div>
              </div>

              {/* Complexity */}
              <div>
                <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide block mb-2">Complexity</span>
                <div className="flex gap-2">
                  {COMPLEXITY.map(c => (
                    <button
                      key={c}
                      onClick={() => setComplexity(c)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                      style={{
                        background: complexity === c ? "var(--c-primary)" : "rgba(255,255,255,0.05)",
                        color: complexity === c ? "#fff" : "rgba(255,255,255,0.35)",
                        border: complexity === c ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-3">
                {/* Rush */}
                <button
                  onClick={() => setRush(r => !r)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all"
                  style={{
                    background: rush ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                    border: rush ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.07)",
                    color: rush ? "#f59e0b" : "rgba(255,255,255,0.35)",
                  }}
                >
                  <Zap className="w-3 h-3 flex-shrink-0" />
                  Rush +$5
                </button>

                {/* USD / Robux */}
                <button
                  onClick={() => setRobux(r => !r)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all"
                  style={{
                    background: robux ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                    border: robux ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(255,255,255,0.07)",
                    color: robux ? "#4ade80" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {robux ? "R$" : "USD"}
                </button>
              </div>

              {/* Result */}
              <motion.div
                key={`${result.low}-${result.high}-${result.currency}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(100,0,255,0.15), rgba(60,0,180,0.1))",
                  border: "1px solid rgba(120,60,255,0.25)",
                }}
              >
                <p className="text-[10px] text-white/35 mb-1 uppercase tracking-wide">{result.label}</p>
                <p className="text-xl font-bold text-white">
                  {result.currency}{result.low.toLocaleString()}
                  <span className="text-white/40 font-normal"> – </span>
                  {result.currency}{result.high.toLocaleString()}
                </p>
                <p className="text-[10px] text-white/30 mt-0.5">Delivered in {result.days}</p>
              </motion.div>

              {/* CTA */}
              <a
                href="https://discord.com/users/mysticfusion7x"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all btn-primary"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Commission on Discord
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
