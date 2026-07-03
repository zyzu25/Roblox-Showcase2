import { motion } from "framer-motion";
import { Users, Monitor, ChevronDown, UserPlus } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { CountUp } from "./CountUp";

const headline = [
  { text: "Interfaces That", gradient: false },
  { text: "Make Your Game", gradient: false },
  { text: "Unforgettable.", gradient: true },
];

function VerifiedBadge({ size = 16, color = "var(--c-primary)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 inline-block align-middle">
      <circle cx="12" cy="12" r="12" fill={color} />
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero" style={{ zIndex: 2 }}>
      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="max-w-3xl">

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-10 pill-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px #4ade80' }} />
            <span className="text-xs text-white/70 font-medium tracking-wide">Open for commissions</span>
          </motion.div>

          <h1 className="font-bold leading-[1.04] tracking-tight mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}>
            {headline.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + i * 0.18,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className={line.gradient ? "gradient-text block" : "text-white block"}
              >
                {line.text}
              </motion.div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.72, ease: [0.23, 1, 0.32, 1] }}
            className="text-lg text-white/55 leading-relaxed mb-12 max-w-lg"
          >
            I'm MYSTICFUSION7X, a Roblox UI designer with 1+ year of experience building polished, production-ready interfaces. High-quality work, affordable pricing, every project unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <MagneticButton
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
              dataTestid="hero-view-work"
            >
              <Monitor className="w-4 h-4" />
              View Work
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full"
              dataTestid="hero-contact"
            >
              <Users className="w-4 h-4" />
              Commission Me
            </MagneticButton>
            {/* Roblox follow CTA */}
            <motion.a
              href="https://www.roblox.com/users/1510973392/profile"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold rounded-full transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
              }}
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.85)" }}
              whileTap={{ scale: 0.97 }}
            >
              <img src="/images/roblox.png" alt="Roblox" className="w-4 h-4 rounded object-cover" />
              Follow on Roblox
              <UserPlus className="w-3.5 h-3.5 opacity-60" />
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex items-center gap-10"
          >
            {[
              { end: 60, suffix: "+", label: "UIs Shipped" },
              { end: 1,  suffix: "+", label: "Year Experience" },
              { end: 6,  suffix: "",  label: "Notable Games" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-10">
                {i > 0 && <div className="w-px h-9 bg-white/10" />}
                <div>
                  <p
                    className="text-3xl font-bold text-white font-display"
                    style={{ textShadow: '0 0 24px var(--c-glow)' }}
                  >
                    <CountUp end={stat.end} suffix={stat.suffix} duration={1600} />
                  </p>
                  <p className="text-xs text-white/35 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-white/25" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
