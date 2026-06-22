import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";

const projects = [
  {
    game: "Fort Benning",
    category: "Military RP",
    screens: [
      "Loading Screen", "Main Menu", "BCT Hosting UI", "Events UI",
      "Emote Wheel", "ID Card UI", "Settings UI", "Cover Selection UI",
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
      "Loading Screen", "Locker UI", "Health & Stamina HUD",
      "Settings UI", "Notifications", "Proximity Prompt",
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

function PlaceholderSlot({ label, index }: { label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="placeholder-img rounded-xl flex flex-col items-center justify-center gap-2 select-none cursor-pointer group"
      style={{ aspectRatio: '4/3' }}
      title={`Replace with screenshot: ${label}`}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <ImagePlus className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors duration-300" />
      <span className="text-[10px] text-white/20 group-hover:text-white/40 font-medium text-center leading-tight px-2 transition-colors duration-300">{label}</span>
    </motion.div>
  );
}

export function Portfolio() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="portfolio" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-3"
            >
              Portfolio
            </motion.p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              <AnimatedText text="Featured work." delay={0.1} />
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:block text-white/30 text-sm max-w-xs text-right leading-relaxed"
          >
            Real projects shipped for live Roblox games.
          </motion.p>
        </div>

        <div className="space-y-5">
          {projects.map((project, index) => (
            <TiltCard key={index} className="glass rounded-2xl overflow-hidden card-hover" intensity={6}>
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

                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${Math.min(project.screens.length, 6)}, 1fr)` }}
                >
                  {project.screens.map((screen, i) => (
                    <PlaceholderSlot key={i} label={screen} index={i} />
                  ))}
                </div>
                <p className="text-[11px] text-white/18 mt-3 text-center">
                  Hover a slot and replace with your screenshot
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
