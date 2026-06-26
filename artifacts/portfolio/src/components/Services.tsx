import { motion } from "framer-motion";
import { LayoutTemplate, Code2, Sparkles, RefreshCw, Image, Gamepad2 } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";

const services = [
  {
    icon: Gamepad2,
    title: "Full Game UI Design",
    description: "Complete UI systems built from the ground up. Every screen, every frame, consistent theme across your whole game.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    icon: LayoutTemplate,
    title: "HUDs and Shop Interfaces",
    description: "Combat HUDs, health bars, cooldown rings, and shop grids that feel native to your game's world.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    icon: Code2,
    title: "Inventory / Pets / Rebirth UIs",
    description: "Complex system UIs including drag-and-drop inventories, pet displays, and rebirth screens built to handle real gameplay logic.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    icon: Image,
    title: "Military RP Logos",
    description: "Custom insignia and logo design for military roleplay groups, with a sharp, professional finish.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    icon: RefreshCw,
    title: "UI Revamps and Redesigns",
    description: "Already have a UI that feels outdated? I'll modernize and elevate it while keeping your game's identity intact.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
  {
    icon: Sparkles,
    title: "Loading Screens and Menus",
    description: "Atmospheric loading screens and main menus that set the tone before a player even enters your game.",
    color: "text-white/90",
    bg: "bg-white/8",
    glow: "rgba(255,255,255,0.08)",
  },
];

export function Services() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="services" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Services
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <AnimatedText text="What I offer." delay={0.1} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <TiltCard className="glass rounded-2xl p-6 group cursor-default h-full" intensity={12}>
                  <div className={`w-11 h-11 ${service.bg} rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}>
                    <Icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{service.description}</p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
