import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

const projects = [
  {
    game: "Fort Benning",
    category: "Military RP",
    screens: [
      "Loading Screen",
      "Main Menu",
      "BCT Hosting UI",
      "Events UI",
      "Emote Wheel",
      "ID Card UI",
      "Settings UI",
      "Cover Selection UI",
    ],
    desc: "Full UI suite for a military roleplay experience. Loading screen, main menu, settings, events, BCT hosting, emote selection wheel, cover selection, and identification card.",
    tag: "8 Screens",
  },
  {
    game: "Central Intelligence Agency",
    category: "Military RP",
    screens: ["Main Menu", "Case Dashboard", "Loading Screen"],
    desc: "Professional UI for a CIA-themed roleplay game. A main menu, case dashboard, and loading screen with a sleek intelligence-agency aesthetic.",
    tag: "3 Screens",
  },
  {
    game: "SCP Site Aether",
    category: "SCP / Military RP",
    screens: [
      "Loading Screen",
      "Locker UI",
      "Health & Stamina HUD",
      "Settings UI",
      "Notifications",
      "Proximity Prompt",
    ],
    desc: "Dark, immersive UI system for an SCP roleplay site. Loading screen, locker, notifications, custom proximity prompt, settings, and a health/stamina HUD.",
    tag: "6 Screens",
  },
  {
    game: "Troll Tower X",
    category: "Shop UI",
    screens: ["Gloves Shop"],
    desc: "Clean, branded gloves shop UI with item display grid and purchase flow.",
    tag: "1 Screen",
  },
  {
    game: "Various Clients",
    category: "Mixed",
    screens: ["Anime UI", "Car Shop UI", "Daily Rewards"],
    desc: "Standalone commissions including glowing anime-style interfaces, a car shop UI, and a daily rewards popup system.",
    tag: "3 Screens",
  },
];

function PlaceholderSlot({ label }: { label: string }) {
  return (
    <div
      className="placeholder-img rounded-xl flex flex-col items-center justify-center gap-2 select-none cursor-pointer"
      style={{ aspectRatio: '4/3' }}
      title={`Replace with screenshot: ${label}`}
    >
      <ImagePlus className="w-5 h-5 text-white/20" />
      <span className="text-[10px] text-white/20 font-medium text-center leading-tight px-2">{label}</span>
    </div>
  );
}

export function Portfolio() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="portfolio">
      {/* Section glow */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(26,71,255,0.6) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-3"
            >
              Portfolio
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Featured work.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block text-white/30 text-sm max-w-xs text-right leading-relaxed"
          >
            Real projects shipped for live Roblox games.
          </motion.p>
        </div>

        <div className="space-y-5">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.55 }}
              className="glass rounded-2xl overflow-hidden card-hover"
              data-testid={`project-card-${index}`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{project.game}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-white/55 pill-badge">
                        {project.tag}
                      </span>
                    </div>
                    <p className="text-xs text-white/30 uppercase tracking-widest">{project.category}</p>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed max-w-md">{project.desc}</p>
                </div>

                {/* Placeholder image grid */}
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${Math.min(project.screens.length, 6)}, 1fr)` }}
                >
                  {project.screens.map((screen, i) => (
                    <PlaceholderSlot key={i} label={screen} />
                  ))}
                </div>
                <p className="text-[11px] text-white/18 mt-3 text-center">
                  Hover a slot and replace with your screenshot
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
