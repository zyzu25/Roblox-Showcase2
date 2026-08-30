import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Coins, Zap, ExternalLink, Info,
  Download,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────
type Tab        = "commission" | "importing";
type Complexity = "Basic" | "Standard" | "Detailed";
type ImportMode = "commission" | "standalone";

// ── Rush delivery table ─────────────────────────────────────────────────────
const RUSH: Record<string, string> = {
  "Starter UI":      "~1 day",
  "Game UI Package": "~1–3 days",
  "Full Game UI":    "~2–7 days",
  "Premium UI":      "~1–2 weeks",
};

// ── Price calculation ───────────────────────────────────────────────────────
function calcPrice(screens: number, complexity: Complexity, rush: boolean, robux: boolean) {
  let label = "", low = 0, high = 0, days = "";

  if      (screens <= 2 && complexity === "Basic")    { label = "Starter UI";      low = 5;   high = 15;  days = "~1–2 days";   }
  else if (screens <= 2 && complexity === "Standard") { label = "Starter UI";      low = 8;   high = 18;  days = "~1–2 days";   }
  else if (screens <= 2 && complexity === "Detailed") { label = "Game UI Package"; low = 18;  high = 32;  days = "~2–5 days";   }
  else if (screens <= 4 && complexity === "Basic")    { label = "Game UI Package"; low = 15;  high = 30;  days = "~2–5 days";   }
  else if (screens <= 4 && complexity === "Standard") { label = "Game UI Package"; low = 25;  high = 50;  days = "~2–5 days";   }
  else if (screens <= 4 && complexity === "Detailed") { label = "Full Game UI";    low = 45;  high = 75;  days = "~5–10 days";  }
  else if (screens <= 6 && complexity === "Basic")    { label = "Full Game UI";    low = 40;  high = 65;  days = "~5–10 days";  }
  else if (screens <= 6 && complexity === "Standard") { label = "Full Game UI";    low = 55;  high = 80;  days = "~5–10 days";  }
  else if (screens <= 6 && complexity === "Detailed") { label = "Premium UI";      low = 75;  high = 120; days = "~1–3 weeks";  }
  else {
    const isDetailed = complexity === "Detailed";
    label = (isDetailed || screens >= 8) ? "Premium UI" : "Full Game UI";
    low   = isDetailed ? 110 : screens >= 8 ? 85 : 65;
    high  = isDetailed ? 175 : screens >= 8 ? 130 : 100;
    days  = isDetailed ? "~2–3 weeks" : "~1–2 weeks";
  }

  if (rush) {
    const bump = Math.max(5, Math.round(low * 0.25));
    low  += bump;
    high += Math.max(5, Math.round(high * 0.25));
    days  = RUSH[label] ?? days;
  }

  if (robux) {
    return { label, low: Math.round(low * 250), high: Math.round(high * 250), days, currency: "R$" };
  }
  return { label, low, high, days, currency: "$" };
}

// ── Main component ──────────────────────────────────────────────────────────
export function PriceCalculator() {
  const [open, setOpen]           = useState(false);
  const [tab, setTab]             = useState<Tab>("commission");

  // Commission tab
  const [screens,    setScreens]    = useState(2);
  const [complexity, setComplexity] = useState<Complexity>("Standard");
  const [rush,       setRush]       = useState(false);
  const [robux,      setRobux]      = useState(false);
  const [showInfo,   setShowInfo]   = useState(false);

  // Importing tab
  const [importMode,       setImportMode]       = useState<ImportMode>("standalone");
  const [commissionPrice,  setCommissionPrice]  = useState("");
  const [frameCount,       setFrameCount]       = useState(3);

  // ── Price results ──
  const result = calcPrice(screens, complexity, rush, robux);

  const importResult = () => {
    if (importMode === "commission") {
      const p = parseFloat(commissionPrice);
      if (isNaN(p) || p <= 0) return null;
      return { price: (p * 0.3).toFixed(2), note: `30% of $${p.toFixed(2)} commission`, currency: "$" };
    }
    const total = frameCount * 7;
    return { price: total.toFixed(2), note: `$7 × ${frameCount} frame${frameCount !== 1 ? "s" : ""}`, currency: "$" };
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "commission", label: "Commission" },
    { id: "importing",  label: "Importing"  },
  ];

  const COMPLEXITY_DESC: Record<Complexity, string> = {
    Basic:    "Simple shapes, flat colors",
    Standard: "Gradients, icons, polished design",
    Detailed: "Complex layouts, many elements, premium finish",
  };

  return (
    <>
      {/* Toggle button */}
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
              <Coins className="w-5 h-5" style={{ color: "var(--c-primary)" }} />
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

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 left-6 z-[199] w-84 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(6,6,18,0.94)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
              maxHeight: "520px",
              width: 320,
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/7 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                <Coins className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white leading-none">Price Calculator</p>
                <p className="text-[10px] text-white/30 mt-0.5">UI Design · Estimate · Approximate</p>
              </div>
              <button onClick={() => setShowInfo(i => !i)} className="text-white/20 hover:text-white/50 transition-colors">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-[11px] text-white/40 leading-relaxed space-y-1 border-b border-white/5"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p>• I design UIs only — no scripting, no animations</p>
                    <p>• Rush = priority queue + reduced delivery time</p>
                    <p>• Extra revisions: $3 each beyond package limit</p>
                    <p>• USD payers get a 20% discount at checkout</p>
                    <p>• Final price confirmed before work starts</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex border-b border-white/7">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex-1 py-2.5 text-[11px] font-semibold transition-all relative"
                  style={{
                    color: tab === t.id ? "var(--c-primary)" : "rgba(255,255,255,0.30)",
                    background: tab === t.id ? "rgba(100,0,255,0.07)" : "transparent",
                  }}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: "var(--c-primary)" }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── COMMISSION TAB ── */}
            <AnimatePresence mode="wait">
              {tab === "commission" && (
                <motion.div key="commission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-4 py-4 space-y-4 overflow-y-auto flex-1" style={{ minHeight: 0 }}>

                  {/* Screens slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">UI Frames / Screens</span>
                      <span className="text-xs font-bold" style={{ color: "var(--c-primary)" }}>{screens >= 8 ? "8+" : screens}</span>
                    </div>
                    <input
                      type="range" min={1} max={8} value={screens}
                      onChange={e => setScreens(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, var(--c-primary) ${((screens - 1) / 7) * 100}%, rgba(255,255,255,0.1) ${((screens - 1) / 7) * 100}%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-white/20">1</span>
                      <span className="text-[9px] text-white/20">8+</span>
                    </div>
                  </div>

                  {/* Complexity */}
                  <div>
                    <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide block mb-2">Visual Complexity</span>
                    <div className="flex gap-1.5">
                      {(["Basic", "Standard", "Detailed"] as Complexity[]).map(c => (
                        <button key={c} onClick={() => setComplexity(c)}
                          className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                          style={{
                            background: complexity === c ? "var(--c-primary)" : "rgba(255,255,255,0.05)",
                            color: complexity === c ? "#fff" : "rgba(255,255,255,0.35)",
                            border: complexity === c ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                          }}
                        >{c}</button>
                      ))}
                    </div>
                    <p className="text-[9px] text-white/20 mt-1.5">{COMPLEXITY_DESC[complexity]}</p>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-2.5">
                    <button onClick={() => setRush(r => !r)}
                      className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all"
                      style={{
                        background: rush ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                        border: rush ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.07)",
                        color: rush ? "#f59e0b" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      <Zap className="w-3 h-3 flex-shrink-0" />
                      Rush (+25%)
                    </button>
                    <button onClick={() => setRobux(r => !r)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all"
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
                    key={`${result.low}-${result.high}-${result.currency}-${rush}`}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl px-4 py-3 text-center"
                    style={{ background: "linear-gradient(135deg,rgba(100,0,255,0.15),rgba(60,0,180,0.10))", border: "1px solid rgba(120,60,255,0.25)" }}
                  >
                    <p className="text-[10px] text-white/35 mb-1 uppercase tracking-wide">{result.label}</p>
                    <p className="text-xl font-bold text-white">
                      {result.currency}{result.low.toLocaleString()}
                      <span className="text-white/40 font-normal"> – </span>
                      {result.currency}{result.high.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">~ Delivered in {result.days.replace("~", "").trim()}</p>
                    {rush && <p className="text-[9px] mt-0.5" style={{ color: "#f59e0b", opacity: 0.8 }}>Priority queue · {RUSH[result.label] ? `Fast-tracked to ${RUSH[result.label]}` : "Reduced delivery"}</p>}
                    {!robux && <p className="text-[9px] mt-1" style={{ color: "var(--c-primary)", opacity: 0.7 }}>USD payers get 20% off at checkout</p>}
                  </motion.div>

                  <a href="https://discord.com/users/mysticfusion7x" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white btn-primary">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Commission on Discord
                  </a>
                </motion.div>
              )}

              {/* ── IMPORTING TAB ── */}
              {tab === "importing" && (
                <motion.div key="importing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-4 py-4 space-y-4 overflow-y-auto flex-1" style={{ minHeight: 0 }}>

                  <p className="text-[11px] text-white/35 leading-relaxed">
                    I can import your UI frames into Roblox Studio. Two pricing modes:
                  </p>

                  {/* Mode toggle */}
                  <div className="flex gap-1.5">
                    {[
                      { id: "standalone"  as ImportMode, label: "Standalone ($7/frame)" },
                      { id: "commission"  as ImportMode, label: "Added to commission (30%)" },
                    ].map(m => (
                      <button key={m.id} onClick={() => setImportMode(m.id)}
                        className="flex-1 py-2 rounded-lg text-[10px] font-semibold transition-all leading-tight px-1"
                        style={{
                          background: importMode === m.id ? "var(--c-primary)" : "rgba(255,255,255,0.05)",
                          color: importMode === m.id ? "#fff" : "rgba(255,255,255,0.35)",
                          border: importMode === m.id ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >{m.label}</button>
                    ))}
                  </div>

                  {importMode === "standalone" ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wide">Number of frames</span>
                        <span className="text-xs font-bold" style={{ color: "var(--c-primary)" }}>{frameCount}</span>
                      </div>
                      <input
                        type="range" min={1} max={20} value={frameCount}
                        onChange={e => setFrameCount(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, var(--c-primary) ${((frameCount - 1) / 19) * 100}%, rgba(255,255,255,0.1) ${((frameCount - 1) / 19) * 100}%)` }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-white/20">1</span>
                        <span className="text-[9px] text-white/20">20</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wide mb-2">Commission price ($)</label>
                      <input
                        type="number"
                        value={commissionPrice}
                        onChange={e => setCommissionPrice(e.target.value)}
                        placeholder="e.g. 100"
                        min={0}
                        className="w-full h-9 px-3 rounded-xl text-xs text-white placeholder:text-white/25 focus:outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                      />
                    </div>
                  )}

                  {/* Result */}
                  {(() => {
                    const ir = importResult();
                    return ir ? (
                      <motion.div
                        key={`${ir.price}`}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl px-4 py-3 text-center"
                        style={{ background: "linear-gradient(135deg,rgba(100,0,255,0.15),rgba(60,0,180,0.10))", border: "1px solid rgba(120,60,255,0.25)" }}
                      >
                        <p className="text-[10px] text-white/35 mb-1 uppercase tracking-wide">Importing cost</p>
                        <p className="text-xl font-bold text-white">${ir.price}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{ir.note}</p>
                      </motion.div>
                    ) : (
                      <div className="rounded-xl px-4 py-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] text-white/20">Enter a price above to see the cost</p>
                      </div>
                    );
                  })()}

                  <div className="text-[10px] text-white/20 leading-relaxed px-1">
                    Includes: import into Roblox Studio, LocalScript connections, basic open/close toggle. Does not include animations or advanced game logic.
                  </div>

                  <a href="https://discord.com/users/mysticfusion7x" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white btn-primary">
                    <Download className="w-3.5 h-3.5" />
                    Commission importing on Discord
                  </a>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
