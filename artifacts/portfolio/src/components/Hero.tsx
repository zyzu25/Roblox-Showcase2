import { motion } from "framer-motion";
import { Users, Monitor } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center" id="hero">

      {/* ── Atmospheric glow background (matches reference images) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main center-left large blue glow */}
        <div
          className="orb-1 absolute"
          style={{
            top: '10%', left: '-5%',
            width: '70vw', height: '70vw', maxWidth: 900, maxHeight: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,80,255,0.55) 0%, rgba(15,40,180,0.25) 35%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Secondary upper-right glow */}
        <div
          className="orb-2 absolute"
          style={{
            top: '-15%', right: '5%',
            width: '50vw', height: '50vw', maxWidth: 700, maxHeight: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,60,220,0.4) 0%, rgba(10,30,150,0.15) 40%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        {/* Bottom right accent glow */}
        <div
          className="orb-3 absolute"
          style={{
            bottom: '-10%', right: '20%',
            width: '40vw', height: '40vw', maxWidth: 600, maxHeight: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(40,90,255,0.3) 0%, rgba(20,50,200,0.1) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-24 w-full">
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
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
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
            className="text-lg text-white/50 leading-relaxed mb-12 max-w-lg"
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
              className="flex items-center gap-2 px-7 py-3.5 bg-white/7 text-white text-sm font-semibold rounded-full border border-white/12 hover:bg-white/12 hover:border-white/20 transition-all"
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
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-10"
          >
            {[
              { value: "50+", label: "UIs Shipped" },
              { value: "1+",  label: "Year Experience" },
              { value: "3",   label: "Notable Games" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-10">
                {i > 0 && <div className="w-px h-9 bg-white/8" />}
                <div>
                  <p className="text-3xl font-bold text-white font-display"
                    style={{ textShadow: '0 0 20px rgba(26,71,255,0.5)' }}>
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
