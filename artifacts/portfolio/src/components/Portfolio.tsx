import { motion } from "framer-motion";

const projects = [
  {
    title: "Aura Shop",
    category: "Shop UI",
    description: "Responsive shop interface with item previews, dynamic grids, and smooth purchase animations.",
    gradient: "from-violet-600 to-indigo-800",
    wireframe: "grid",
  },
  {
    title: "Battle HUD",
    category: "HUD",
    description: "Minimalist combat HUD with animated health bars, cooldown rings, and kill feed.",
    gradient: "from-blue-600 to-cyan-700",
    wireframe: "bars",
  },
  {
    title: "Vault Inventory",
    category: "Inventory",
    description: "Drag-and-drop inventory system with rarity filters, tooltips, and sorting logic.",
    gradient: "from-emerald-600 to-teal-800",
    wireframe: "grid",
  },
  {
    title: "Void Loader",
    category: "Loading Screen",
    description: "Atmospheric loading screen with tweened transitions, tip rotation, and progress tracking.",
    gradient: "from-slate-700 to-gray-900",
    wireframe: "center",
  },
  {
    title: "Nexus Hub",
    category: "Main Menu",
    description: "Full main menu with parallax backgrounds, settings sliders, and character selection.",
    gradient: "from-indigo-700 to-purple-900",
    wireframe: "split",
  },
  {
    title: "Rankings Board",
    category: "Leaderboard",
    description: "Real-time leaderboard with top-player highlights, tier styling, and stat toggles.",
    gradient: "from-amber-600 to-orange-800",
    wireframe: "list",
  },
];

const MockPreview = ({ type, gradient }: { type: string; gradient: string }) => (
  <div className={`w-full h-full bg-gradient-to-br ${gradient} p-5 relative overflow-hidden`}>
    <div className="absolute inset-0"
      style={{ backgroundImage: 'radial-gradient(circle at 25% 15%, rgba(255,255,255,0.12) 0%, transparent 55%)' }}
    />
    <div className="relative z-10 h-full flex flex-col gap-3 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="h-2 w-24 bg-white/25 rounded-full" />
        <div className="flex gap-1.5">
          {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/20" />)}
        </div>
      </div>
      {type === 'grid' && (
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 rounded-md border border-white/5" />
          ))}
        </div>
      )}
      {type === 'bars' && (
        <div className="flex-1 flex flex-col justify-end gap-2 relative">
          <div className="h-3 w-1/2 bg-green-500/50 rounded-full" />
          <div className="h-2 w-1/3 bg-blue-500/50 rounded-full" />
          <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/10 border border-white/10" />
        </div>
      )}
      {type === 'center' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-white/60" />
          <div className="h-1.5 w-2/3 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full w-2/5 bg-white/60 rounded-full" />
          </div>
        </div>
      )}
      {type === 'split' && (
        <div className="flex-1 flex gap-3">
          <div className="w-1/3 flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-7 bg-white/10 rounded-md" />
            ))}
          </div>
          <div className="flex-1 bg-white/5 rounded-md" />
        </div>
      )}
      {type === 'list' && (
        <div className="flex-1 flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-white/10 rounded-md flex items-center px-3 gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex-shrink-0" />
              <div className="h-1.5 w-1/3 bg-white/20 rounded-full" />
              <div className="h-1.5 w-10 bg-white/10 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export function Portfolio() {
  return (
    <section className="py-28" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Featured work.</h2>
          </div>
          <p className="hidden md:block text-white/40 text-sm max-w-xs text-right">
            A selection of interfaces built for live Roblox games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border card-hover"
              data-testid={`project-card-${index}`}
            >
              <div className="aspect-video w-full relative overflow-hidden">
                <MockPreview type={project.wireframe} gradient={project.gradient} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-sm font-semibold border border-white/30 px-5 py-2 rounded-full">
                    View Details
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
                    {project.category}
                  </span>
                </div>
                <p className="text-sm text-white/45 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
