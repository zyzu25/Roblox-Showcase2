import { motion } from "framer-motion";
import { ClipboardList, Paintbrush, RotateCcw, PackageCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Brief",
    desc: "Tell me your game, the screens you need, and any style references. The clearer the brief, the better the result.",
    color: "var(--c-primary)",
  },
  {
    number: "02",
    icon: Paintbrush,
    title: "First Draft",
    desc: "I design your UI in Figma and Roblox Studio and share a preview within the agreed timeframe.",
    color: "#22d3ee",
  },
  {
    number: "03",
    icon: RotateCcw,
    title: "Revisions",
    desc: "You give feedback, I adjust. We go back and forth until it's exactly what you envisioned.",
    color: "#f59e0b",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Delivery",
    desc: "Final files are handed over, ready to plug straight into your game. Done.",
    color: "#4ade80",
  },
];

export function Process() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--c-primary)" }}>
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
            Simple{" "}
            <span className="gradient-text">4-step process</span>
          </h2>
          <p className="mt-4 text-white/40 text-base max-w-md">
            From idea to finished UI — here's exactly what working with me looks like.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)" }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                {/* Icon circle */}
                <div
                  className="relative w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${step.color}30`,
                    boxShadow: `0 0 20px ${step.color}18`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.color }} />
                  {/* Step number badge */}
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </span>
                </div>

                <p className="text-base font-bold text-white mb-2">{step.title}</p>
                <p className="text-xs text-white/40 leading-relaxed max-w-[200px] md:max-w-none">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-7 py-6"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <p className="text-sm font-bold text-white mb-0.5">Ready to start?</p>
            <p className="text-xs text-white/40">Slots fill up fast — lock in yours today.</p>
          </div>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full whitespace-nowrap"
          >
            Start My Commission
          </button>
        </motion.div>
      </div>
    </section>
  );
}
