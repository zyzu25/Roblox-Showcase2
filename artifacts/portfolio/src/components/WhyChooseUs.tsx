import { motion } from "framer-motion";
import { Zap, Shield, MessageCircle, DollarSign } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "Most projects ship in 1–5 days. No waiting weeks for your UI — get it done while momentum is high.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    desc: "Every frame is polished, pixel-perfect, and built to fit your game's identity — no generic templates.",
    color: "var(--c-primary)",
    glow: "var(--c-glow-soft)",
  },
  {
    icon: MessageCircle,
    title: "Clear Communication",
    desc: "Progress updates throughout, revisions included, and I'm always reachable on Discord.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    desc: "Studio-quality UI starting at $5. USD saves you 20% vs Robux. Fair rates, real results.",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.15)",
  },
];

export function WhyChooseUs() {
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
            Why Us
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
            Why choose{" "}
            <span className="gradient-text">MYSTICFUSION7X</span>?
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="group relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                whileHover={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.12)",
                  y: -4,
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: r.glow, border: `1px solid ${r.color}28` }}
                >
                  <Icon className="w-5 h-5" style={{ color: r.color }} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white mb-1.5">{r.title}</p>
                  <p className="text-xs text-white/45 leading-relaxed">{r.desc}</p>
                </div>

                {/* Subtle bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}55, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
