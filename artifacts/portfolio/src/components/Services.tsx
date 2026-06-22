import { motion } from "framer-motion";
import { LayoutTemplate, Code2, Sparkles, RefreshCw, Image, Gamepad2 } from "lucide-react";

const services = [
  {
    icon: Gamepad2,
    title: "Full Game UI Design",
    description: "Complete UI systems built from the ground up. Every screen, every frame, consistent theme across your whole game.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    icon: LayoutTemplate,
    title: "HUDs and Shop Interfaces",
    description: "Combat HUDs, health bars, cooldown rings, and shop grids that feel native to your game's world.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    glow: "rgba(99,102,241,0.3)",
  },
  {
    icon: Code2,
    title: "Inventory / Pets / Rebirth UIs",
    description: "Complex system UIs including drag-and-drop inventories, pet displays, and rebirth screens built to handle real gameplay logic.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    icon: Image,
    title: "Military RP Logos",
    description: "Custom insignia and logo design for military roleplay groups, with a sharp, professional finish.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    glow: "rgba(56,189,248,0.3)",
  },
  {
    icon: RefreshCw,
    title: "UI Revamps and Redesigns",
    description: "Already have a UI that feels outdated? I'll modernize and elevate it while keeping your game's identity intact.",
    color: "text-blue-300",
    bg: "bg-blue-400/10",
    glow: "rgba(147,197,253,0.3)",
  },
  {
    icon: Sparkles,
    title: "Loading Screens and Menus",
    description: "Atmospheric loading screens and main menus that set the tone before a player even enters your game.",
    color: "text-indigo-300",
    bg: "bg-indigo-400/10",
    glow: "rgba(165,180,252,0.3)",
  },
];

export function Services() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="services">
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,71,255,0.6) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            What I offer.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-base leading-relaxed"
          >
            Production-ready interfaces that plug directly into your game. No hand-holding required.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 group cursor-default"
                style={{ transition: 'border-color 0.25s ease, box-shadow 0.25s ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `rgba(26,71,255,0.35)`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${service.glow}, 0 8px 32px rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
                data-testid={`service-card-${i}`}
              >
                <div className={`w-11 h-11 ${service.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
