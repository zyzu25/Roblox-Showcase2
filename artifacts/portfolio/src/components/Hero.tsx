import { motion } from "framer-motion";
import { Users, Monitor } from "lucide-react";

const mosaicTiles = [
  { gradient: "from-violet-700 via-purple-800 to-indigo-900", label: "Loading Screen", delay: 0, type: "center" },
  { gradient: "from-slate-800 via-gray-900 to-zinc-950", label: "Main Menu", delay: 0.2, type: "split" },
  { gradient: "from-blue-900 via-indigo-900 to-slate-900", label: "HUD", delay: 0.4, type: "bars" },
  { gradient: "from-zinc-900 via-neutral-900 to-stone-900", label: "Shop UI", delay: 0.1, type: "grid" },
  { gradient: "from-indigo-900 via-purple-950 to-violet-950", label: "Dashboard", delay: 0.3, type: "list" },
  { gradient: "from-slate-900 via-blue-950 to-indigo-950", label: "Settings", delay: 0.5, type: "split" },
  { gradient: "from-purple-900 via-violet-900 to-indigo-800", label: "Notification", delay: 0.15, type: "center" },
  { gradient: "from-gray-900 via-slate-900 to-zinc-900", label: "Locker UI", delay: 0.35, type: "grid" },
  { gradient: "from-indigo-950 via-blue-900 to-violet-900", label: "Events UI", delay: 0.55, type: "list" },
  { gradient: "from-violet-950 via-purple-900 to-indigo-900", label: "ID Card", delay: 0.05, type: "center" },
  { gradient: "from-blue-950 via-indigo-900 to-slate-900", label: "Emote Wheel", delay: 0.25, type: "grid" },
  { gradient: "from-slate-950 via-gray-900 to-neutral-900", label: "Gloves Shop", delay: 0.45, type: "bars" },
];

const MockUI = ({ type, gradient, label }: { type: string; gradient: string; label: string }) => (
  <div className={`bg-gradient-to-br ${gradient} w-full h-full p-3 relative overflow-hidden`}>
    <div className="absolute inset-0 opacity-30"
      style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(72,0,255,0.3) 0%, transparent 60%)' }} />
    <div className="relative z-10 h-full flex flex-col gap-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/8 p-3">
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <div className="h-1.5 w-16 bg-white/20 rounded-full" />
        <div className="flex gap-1">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/15" />)}
        </div>
      </div>
      {type === 'grid' && (
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/8 rounded border border-white/5" />
          ))}
        </div>
      )}
      {type === 'bars' && (
        <div className="flex-1 flex flex-col justify-end gap-1.5 relative">
          <div className="h-2 w-1/2 rounded-full" style={{ background: 'rgba(72,0,255,0.5)' }} />
          <div className="h-1.5 w-1/3 bg-purple-500/40 rounded-full" />
          <div className="absolute top-1 right-1 w-8 h-8 rounded-full bg-white/5 border border-white/8" />
        </div>
      )}
      {type === 'center' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-400/70" />
          <div className="h-1 w-2/3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/5 rounded-full" style={{ background: 'rgba(72,0,255,0.7)' }} />
          </div>
        </div>
      )}
      {type === 'split' && (
        <div className="flex-1 flex gap-2">
          <div className="w-1/3 flex flex-col gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-white/8 rounded" />
            ))}
          </div>
          <div className="flex-1 bg-white/4 rounded border border-white/5" />
        </div>
      )}
      {type === 'list' && (
        <div className="flex-1 flex flex-col gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-7 bg-white/8 rounded flex items-center px-2 gap-2">
              <div className="w-3 h-3 rounded-full bg-white/15 flex-shrink-0" />
              <div className="h-1 w-1/3 bg-white/15 rounded-full" />
            </div>
          ))}
        </div>
      )}
      <div className="h-4 rounded-full flex items-center px-2" style={{ background: 'rgba(72,0,255,0.2)' }}>
        <span className="text-white/50 text-[7px] font-medium tracking-wide">{label}</span>
      </div>
    </div>
  </div>
);

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center" id="hero">
      {/* Animated water gradient background orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="orb-1 absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #4800ff 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="orb-2 absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7b5fff 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="orb-3 absolute top-[40%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4800ff 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Mosaic tiles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-2 opacity-55">
          {mosaicTiles.map((tile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: tile.delay }}
              className="rounded-xl overflow-hidden"
            >
              <MockUI gradient={tile.gradient} label={tile.label} type={tile.type} />
            </motion.div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 pill-badge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/70 font-medium">Open for commissions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-4"
          >
            Roblox UI<br />
            <span className="gradient-text">That Players</span><br />
            Remember.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base text-white/50 leading-relaxed mb-10 max-w-md"
          >
            I'm MYSTICFUSION7X — a Roblox UI designer with 1+ year of experience building polished, production-ready interfaces. High-quality work, affordable pricing, every project unique.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-3 mb-14"
          >
            <button
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 bg-white/8 text-white text-sm font-semibold rounded-full border border-white/12 hover:bg-white/12 transition-colors"
              data-testid="hero-view-work"
            >
              <Monitor className="w-4 h-4" />
              View Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(90deg, #7b5fff, #4800ff)' }}
              data-testid="hero-contact"
            >
              <Users className="w-4 h-4" />
              Commission Me
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-8"
          >
            {[
              { value: "50+", label: "UIs Shipped" },
              { value: "1+", label: "Year Experience" },
              { value: "3", label: "Notable Games" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                <div>
                  <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
