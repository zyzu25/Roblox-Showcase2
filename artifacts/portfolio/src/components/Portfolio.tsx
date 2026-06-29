import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";

const SCREENSHOTS: Record<string, string[]> = {
  "Fort Benning": [
    "", // Loading Screen
    "", // Main Menu
    "", // BCT Hosting UI
    "", // Events UI
    "", // Emote Wheel
    "", // ID Card UI
    "", // Settings UI
    "", // Cover Selection UI
  ],
  "Central Intelligence Agency": [
    "/images/ui/Group_1_(1)_1782698895070.png", // Main Menu
    "/images/ui/CIA_CASE_DASHBOARD_1782698943338.png", // Case Dashboard
    "/images/ui/Screenshot_2_1782698943343.png", // Loading Screen
  ],
  "SCP Site Aether": [
    "/images/ui/Group_2_(1)_1782698943340.png", // Loading Screen
    "/images/ui/Screenshot_6_1782698943344.png", // Class Icons
    "/images/ui/Screenshot_3_1782698943343.png", // Health & Stamina HUD
    "/images/ui/Screenshot_4_1782698943344.png", // Settings UI
    "/images/ui/Group_2_(2)_1782698943341.png", // Notifications
    "/images/ui/image-Photoroom_(3)_1782698943342.png", // Proximity Prompt
  ],
  "Troll Tower X": [
    "/images/ui/Slide_16_9_-_1_(1)_1782698895072.png", // Gloves Shop
  ],
  "Various Clients": [
    "/images/ui/Slide_16_9_-_2_(2)_1782698895073.png", // Anime UI
    "/images/ui/Group_23_1782698895072.png", // Car Shop UI
    "/images/ui/DailyRewardsUI_1782698895071.png", // Daily Rewards
    "/images/ui/Frame_2_1782698895068.png", // Redeem Codes
    "/images/ui/Frame_1_1782698895069.png", // Leaderboard
    "/images/ui/Group_5_1782698943341.png", // Quests
    "/images/ui/Group_1_(2)_1782698943338.png", // Kill Feed
  ],
};

const projects = [
  {
    game: "Fort Benning",
    category: "Military RP",
    screens: ["Loading Screen", "Main Menu", "BCT Hosting UI", "Events UI", "Emote Wheel", "ID Card UI", "Settings UI", "Cover Selection UI"],
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
    screens: ["Loading Screen", "Class Icons", "Health & Stamina HUD", "Settings UI", "Notifications", "Proximity Prompt"],
    desc: "Dark, immersive UI system for an SCP roleplay site. Loading screen, class selection, notifications, custom proximity prompt, settings, and a health/stamina HUD.",
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
    screens: ["Anime UI", "Car Shop UI", "Daily Rewards", "Redeem Codes", "Leaderboard", "Quests", "Kill Feed"],
    desc: "Standalone commissions including anime-style interfaces, car shop, daily rewards, redeem codes, leaderboards, quests, and kill feed systems.",
    tag: "7 Screens",
  },
];

function ScreenSlot({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative rounded-xl overflow-hidden"
      style={{ aspectRatio: '4/3' }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-end p-2"
          style={{
            background: 'linear-gradient(160deg, rgba(8,5,25,0.95) 0%, rgba(3,2,18,0.98) 100%)',
            border: '1px solid var(--c-border-soft)',
          }}
        >
          <span className="text-[9px] text-white/20 leading-tight font-medium">{alt}</span>
        </div>
      )}
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
                    <ScreenSlot
                      key={i}
                      src={SCREENSHOTS[project.game]?.[i] ?? ""}
                      alt={screen}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
