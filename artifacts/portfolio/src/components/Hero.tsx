import { motion } from "framer-motion";
import { Users, Monitor } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero" style={{ zIndex: 1 }}>
      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-10 pill-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 glow-pulse" />
            <span className="text-xs text-white/70 font-medium tracking-wide">Open for commissions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight text-white mb-6"
          >
            Roblox UI<br />
            <span className="gradient-text">That Players</span><br />
            Remember.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/55 leading-relaxed mb-12 max-w-lg"
          >
            I'm MYSTICFUSION7X, a Roblox UI designer with 1+ year of experience building polished, production-ready interfaces. High-quality work, affordable pricing, every project unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
              data-testid="hero-view-work"
            >
              <Monitor className="w-4 h-4" />
              View Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full"
              data-testid="hero-contact"
            >
              <Users className="w-4 h-4" />
              Commission Me
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex items-center gap-10"
          >
            {[
              { value: "50+", label: "UIs Shipped" },
              { value: "1+",  label: "Year Experience" },
              { value: "3",   label: "Notable Games" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-10">
                {i > 0 && <div className="w-px h-9 bg-white/10" />}
                <div>
                  <p
                    className="text-3xl font-bold text-white font-display"
                    style={{ textShadow: '0 0 24px rgba(60,120,255,0.7)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/35 mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
