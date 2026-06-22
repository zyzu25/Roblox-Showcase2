import { motion } from "framer-motion";
import { Users, Monitor } from "lucide-react";

const mosaicTiles = [
  { gradient: "from-violet-600 to-indigo-800", label: "Shop UI", delay: 0 },
  { gradient: "from-blue-600 to-cyan-700", label: "HUD", delay: 0.3 },
  { gradient: "from-emerald-600 to-teal-800", label: "Inventory", delay: 0.6 },
  { gradient: "from-rose-600 to-pink-800", label: "Menu", delay: 0.1 },
  { gradient: "from-amber-600 to-orange-800", label: "Leaderboard", delay: 0.4 },
  { gradient: "from-indigo-700 to-purple-900", label: "Loading", delay: 0.7 },
  { gradient: "from-sky-600 to-blue-800", label: "Settings", delay: 0.2 },
  { gradient: "from-fuchsia-600 to-purple-800", label: "Lobby", delay: 0.5 },
  { gradient: "from-green-600 to-emerald-900", label: "Map UI", delay: 0.8 },
  { gradient: "from-red-600 to-rose-900", label: "Combat", delay: 0.15 },
  { gradient: "from-yellow-600 to-amber-800", label: "Store", delay: 0.45 },
  { gradient: "from-cyan-600 to-teal-900", label: "Profile", delay: 0.75 },
];

const MockUI = ({ gradient, label }: { gradient: string; label: string }) => (
  <div className={`bg-gradient-to-br ${gradient} w-full h-full p-3 relative overflow-hidden`}>
    <div className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)'
      }}
    />
    <div className="relative z-10 h-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="h-2 w-16 bg-white/30 rounded-full" />
        <div className="h-2 w-6 bg-white/20 rounded-full" />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 w-full bg-black/25 rounded" />
        <div className="flex-1 grid grid-cols-2 gap-1.5">
          {[0,1,2,3].map(i => (
            <div key={i} className="bg-black/20 rounded" />
          ))}
        </div>
      </div>
      <div className="h-5 bg-white/20 rounded-full flex items-center px-2">
        <span className="text-white/70 text-[8px] font-medium tracking-wide">{label}</span>
      </div>
    </div>
  </div>
);

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center" id="hero">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-2 opacity-60">
          {mosaicTiles.map((tile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: tile.delay }}
              className="rounded-xl overflow-hidden"
            >
              <MockUI gradient={tile.gradient} label={tile.label} />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/70 font-medium">Available for commissions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6"
          >
            Crafting Interfaces<br />
            Players <span className="text-primary">Remember.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/55 leading-relaxed mb-10 max-w-lg"
          >
            Roblox UI designer specializing in polished, pixel-perfect interfaces — from inventory systems to full main menus, scripted and ready for production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-4 mb-14"
          >
            <button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-semibold rounded-full border border-white/15 hover:bg-white/15 transition-colors"
              data-testid="hero-view-work"
            >
              <Monitor className="w-4 h-4" />
              View Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
              data-testid="hero-contact"
            >
              <Users className="w-4 h-4" />
              Work With Me
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-10"
          >
            <div>
              <p className="text-3xl font-bold text-white font-display">50+</p>
              <p className="text-sm text-white/45 mt-0.5">Projects Shipped</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white font-display">3+</p>
              <p className="text-sm text-white/45 mt-0.5">Years Experience</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white font-display">100%</p>
              <p className="text-sm text-white/45 mt-0.5">Satisfaction Rate</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
