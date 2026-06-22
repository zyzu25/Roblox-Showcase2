import { motion } from "framer-motion";
import { LayoutTemplate, Code2, Sparkles, MonitorSmartphone } from "lucide-react";

const services = [
  {
    icon: LayoutTemplate,
    title: "UI/UX Design",
    description: "Wireframes, mockups, and fully realized UI assets in Figma — tailored to your game's aesthetic and brand.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Code2,
    title: "UI Scripting",
    description: "Static designs brought to life with optimized Luau code, handling state, client-server communication, and dynamic scaling.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Custom Animations",
    description: "Smooth tweening, hover effects, transition screens, and satisfying interaction feedback that makes players stop and notice.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Scaling",
    description: "UI that looks perfect on PC, mobile, and console — mastering anchor points, scale constraints, and aspect ratios.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export function Services() {
  return (
    <section className="py-28 border-t border-white/5" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">What I deliver.</h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Production-ready interface systems that plug directly into your workflow. No hand-holding required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-7 hover:border-white/15 transition-colors group"
                data-testid={`service-card-${i}`}
              >
                <div className={`w-12 h-12 ${service.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
