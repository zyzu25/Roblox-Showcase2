import { motion } from "framer-motion";
import { Download, DollarSign, Layers, ExternalLink, Info } from "lucide-react";

const examples = [
  {
    icon: "💼",
    title: "Added to a commission",
    price: "30% of the design price",
    desc: "Commissioning UI design AND importing together? I add 30% on top of the design cost.",
    example: "$100 commission + importing = $130 total",
    highlight: false,
  },
  {
    icon: "📦",
    title: "Standalone importing",
    price: "$7 per frame",
    desc: "Already have UI designed (by me or someone else)? I'll import it into your game.",
    example: "5 frames × $7 = $35 total",
    highlight: true,
  },
];

const included = [
  "Import UI frames into Roblox Studio",
  "Connect frames to LocalScript / ScreenGui",
  "Basic open/close toggle scripting",
  "Organized folder structure in StarterGui",
];

export function ImportingSection() {
  return (
    <section
      className="py-28 border-t border-white/5 section-glow relative overflow-hidden"
      id="importing"
      style={{ zIndex: 2 }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        UI
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Additional Service
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            UI Importing<br />
            <span className="gradient-text">into your game.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base text-white/40 leading-relaxed"
          >
            Don't have time to import UIs into Roblox Studio? I can handle that for you. Two simple pricing models.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pricing cards */}
          {examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
              style={ex.highlight ? {
                border: "1px solid rgba(var(--c-primary-rgb, 124,58,237), 0.35)",
                background: "rgba(100,0,255,0.06)",
              } : undefined}
            >
              {ex.highlight && (
                <div
                  className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: "var(--c-glow-soft)", color: "var(--c-primary)", border: "1px solid var(--c-border-soft)" }}
                >
                  Popular
                </div>
              )}
              <span className="text-3xl">{ex.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-1">{ex.title}</p>
                <p className="text-2xl font-bold text-white">{ex.price}</p>
              </div>
              <p className="text-sm text-white/45 leading-relaxed">{ex.desc}</p>
              <div
                className="px-3 py-2 rounded-xl text-xs font-mono text-white/50 mt-auto"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {ex.example}
              </div>
            </motion.div>
          ))}

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="glass rounded-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
              <p className="text-sm font-semibold text-white">What's included</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border-soft)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--c-primary)" }} />
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
            <div
              className="flex items-start gap-2 p-3 rounded-xl text-xs text-white/30 leading-relaxed"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Info className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "var(--c-primary)" }} />
              Importing does not include UI design, animations, or advanced game logic — only the import into Roblox Studio.
            </div>
            <a
              href="https://discord.com/users/mysticfusion7x"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all btn-primary mt-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Commission importing on Discord
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
