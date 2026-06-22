import { motion } from "framer-motion";

const projects = [
  {
    game: "Fort Benning",
    category: "Military RP",
    items: [
      { title: "Loading Screen", type: "center", gradient: "from-slate-800 via-gray-900 to-zinc-950" },
      { title: "Main Menu", type: "split", gradient: "from-zinc-900 via-slate-900 to-gray-950" },
      { title: "BCT Hosting UI", type: "list", gradient: "from-gray-900 via-neutral-900 to-stone-950" },
      { title: "Events UI", type: "grid", gradient: "from-slate-900 via-zinc-900 to-gray-950" },
      { title: "Emote Wheel", type: "center", gradient: "from-neutral-900 via-stone-900 to-slate-950" },
      { title: "ID Card UI", type: "split", gradient: "from-stone-900 via-gray-900 to-neutral-950" },
    ],
    desc: "Full UI suite for a military roleplay experience — loading screen, main menu, settings, events, BCT hosting, emote selection wheel, cover selection, and identification card UI.",
    tag: "8 Screens",
    color: "from-slate-700 to-gray-900",
  },
  {
    game: "Central Intelligence Agency",
    category: "Military RP",
    items: [
      { title: "Main Menu", type: "split", gradient: "from-blue-950 via-indigo-950 to-slate-950" },
      { title: "Case Dashboard", type: "list", gradient: "from-indigo-950 via-blue-950 to-violet-950" },
      { title: "Loading Screen", type: "center", gradient: "from-slate-950 via-blue-950 to-indigo-950" },
    ],
    desc: "Sleek, professional UI for a CIA-themed roleplay game, featuring a main menu, case dashboard, and loading screen with a cohesive intelligence-agency aesthetic.",
    tag: "3 Screens",
    color: "from-blue-900 to-indigo-950",
  },
  {
    game: "SCP Site Aether",
    category: "SCP / Military RP",
    items: [
      { title: "Loading Screen", type: "center", gradient: "from-violet-900 via-purple-950 to-indigo-950" },
      { title: "Locker UI", type: "grid", gradient: "from-indigo-900 via-violet-950 to-purple-950" },
      { title: "Health & Stamina HUD", type: "bars", gradient: "from-purple-900 via-indigo-950 to-violet-950" },
      { title: "Settings UI", type: "split", gradient: "from-violet-950 via-indigo-900 to-purple-950" },
      { title: "Notifications", type: "list", gradient: "from-indigo-950 via-purple-900 to-violet-950" },
    ],
    desc: "Dark, immersive UI system for an SCP roleplay site — loading screen, locker, notifications, custom proximity prompt, settings, and a health/stamina HUD.",
    tag: "6 Screens",
    color: "from-violet-800 to-indigo-950",
  },
  {
    game: "Troll Tower X",
    category: "Shop UI",
    items: [
      { title: "Gloves Shop", type: "grid", gradient: "from-amber-900 via-orange-950 to-red-950" },
    ],
    desc: "Clean, branded gloves shop UI with item display grid and purchase flow for Troll Tower X.",
    tag: "1 Screen",
    color: "from-amber-800 to-orange-950",
  },
  {
    game: "Various Clients",
    category: "Mixed",
    items: [
      { title: "Anime UI", type: "center", gradient: "from-pink-900 via-fuchsia-950 to-purple-950" },
      { title: "Car Shop UI", type: "grid", gradient: "from-blue-900 via-cyan-950 to-slate-950" },
      { title: "Daily Rewards", type: "list", gradient: "from-emerald-900 via-teal-950 to-green-950" },
    ],
    desc: "Standalone commissions including glowing anime-style UIs, a car shop interface, and a daily rewards popup system.",
    tag: "3 Screens",
    color: "from-fuchsia-800 to-purple-950",
  },
];

const MockPreview = ({ type, gradient }: { type: string; gradient: string }) => (
  <div className={`bg-gradient-to-br ${gradient} w-full h-full p-2 relative overflow-hidden`}>
    <div className="absolute inset-0 opacity-25"
      style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(72,0,255,0.4) 0%, transparent 55%)' }} />
    <div className="relative z-10 h-full bg-black/40 backdrop-blur-sm rounded-md border border-white/8 p-2 flex flex-col gap-1.5">
      <div className="flex items-center justify-between border-b border-white/8 pb-1.5">
        <div className="h-1 w-10 bg-white/20 rounded-full" />
        <div className="flex gap-1">
          {[0,1].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/15" />)}
        </div>
      </div>
      {type === 'grid' && (
        <div className="flex-1 grid grid-cols-3 gap-1">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white/8 rounded" />)}
        </div>
      )}
      {type === 'bars' && (
        <div className="flex-1 flex flex-col justify-end gap-1">
          <div className="h-1.5 w-1/2 rounded-full" style={{ background: 'rgba(72,0,255,0.6)' }} />
          <div className="h-1 w-1/3 bg-purple-500/40 rounded-full" />
        </div>
      )}
      {type === 'center' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-purple-400/70" />
          <div className="h-0.5 w-2/3 bg-white/10 rounded-full" />
        </div>
      )}
      {type === 'split' && (
        <div className="flex-1 flex gap-1.5">
          <div className="w-1/3 flex flex-col gap-1">
            {[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-white/8 rounded" />)}
          </div>
          <div className="flex-1 bg-white/4 rounded border border-white/5" />
        </div>
      )}
      {type === 'list' && (
        <div className="flex-1 flex flex-col gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-white/8 rounded flex items-center px-1.5 gap-1">
              <div className="w-2 h-2 rounded-full bg-white/15" />
              <div className="h-0.5 w-1/3 bg-white/15 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export function Portfolio() {
  return (
    <section className="py-28 border-t border-white/5" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-accent mb-3">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Featured work.</h2>
          </div>
          <p className="hidden md:block text-white/35 text-sm max-w-xs text-right leading-relaxed">
            Real projects shipped for live Roblox games.
          </p>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass rounded-2xl overflow-hidden card-hover"
              data-testid={`project-card-${index}`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{project.game}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-white/60 pill-badge">
                        {project.tag}
                      </span>
                    </div>
                    <p className="text-xs text-white/35 uppercase tracking-widest">{project.category}</p>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed max-w-md">{project.desc}</p>
                </div>

                {/* Screens grid */}
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(project.items.length, 6)}, 1fr)` }}>
                  {project.items.map((item, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <MockPreview type={item.type} gradient={item.gradient} />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-[10px] font-medium leading-tight">{item.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
