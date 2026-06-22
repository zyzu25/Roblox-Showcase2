import { motion } from "framer-motion";
import { LayoutTemplate, Code2, Sparkles, RefreshCw, Image, Gamepad2 } from "lucide-react";

const services = [
  {
    icon: Gamepad2,
    title: "Full Game UI Design",
    description: "Complete UI systems built from the ground up — every screen, every frame, consistent theme across your whole game.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: LayoutTemplate,
    title: "HUDs & Shop Interfaces",
    description: "Combat HUDs, health bars, cooldown rings, and shop grids that feel native to your game's world.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Code2,
    title: "Inventory / Pets / Rebirth UIs",
    description: "Complex system UIs — drag-and-drop inventories, pet displays, rebirth screens — built to handle real gameplay logic.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Image,
    title: "Military RP Logos",
    description: "Custom insignia and logo design for military roleplay groups, with a sharp, professional finish.",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
  },
  {
    icon: RefreshCw,
    title: "UI Revamps & Redesigns",
    description: "Already have a UI that feels outdated? I'll modernize and elevate it while keeping your game's identity intact.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Sparkles,
    title: "Loading Screens & Menus",
    description: "Atmospheric loading screens and main menus that set the tone before a player even enters your game.",
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
  },
];

export function Services() {
  return (
    <section className="py-28 border-t border-white/5" id="services">
      {/* Orb */}
      <div className="absolute left-0 w-[350px] h-[350px] opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4800ff 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest gradient-text-accent mb-4">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What I offer.</h2>
          <p className="text-white/45 text-base leading-relaxed">
            Production-ready interfaces that plug directly into your game. No hand-holding required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="glass rounded-2xl p-6 hover:border-[rgba(72,0,255,0.3)] transition-colors group card-hover"
                data-testid={`service-card-${i}`}
              >
                <div className={`w-11 h-11 ${service.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-white/45 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
