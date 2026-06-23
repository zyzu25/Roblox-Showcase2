import { motion } from "framer-motion";
import { AnimatedLine } from "./AnimatedText";
import { TiltCard } from "./TiltCard";
import { CountUp } from "./CountUp";

const skills = [
  "ScreenGuis", "Frames & Layouts", "UI Animations",
  "Tweening", "Responsive Design", "Roblox Studio",
  "Figma", "Iconography", "Military RP UIs", "Luau Scripting",
];

export function About() {
  return (
    <section className="py-28 relative border-t border-white/5 section-glow" id="about" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">About Me</p>

            <div className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="text-white"
              >
                Hello, I'm
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="gradient-text"
              >
                MYSTICFUSION7X.
              </motion.div>
            </div>

            <AnimatedLine
              text="I'm a Roblox UI designer who focuses on polished interfaces that help games stand out. With over a year of hands-on experience, I've built UI systems for military roleplay games, SCP environments, and general Roblox titles."
              className="text-white/50 text-base leading-relaxed mb-4"
              delay={0.3}
            />
            <AnimatedLine
              text="I offer high-quality work and affordable pricing while keeping every project unique and visually strong. No templates, everything is purpose-built for your game."
              className="text-white/50 text-base leading-relaxed mb-8"
              delay={0.45}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-3 text-sm text-white/35"
            >
              <img src="/images/roblox.png" alt="Roblox" className="w-8 h-8 rounded-lg object-cover" />
              <span>ZYZU25 on Roblox</span>
              <span className="text-white/15 mx-1">·</span>
              <img src="/images/discord.png" alt="Discord" className="w-8 h-8 rounded-lg object-cover" />
              <span>mysticfusion7x on Discord</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-5"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 1, suffix: "+", label: "Year of experience" },
                { value: 50, suffix: "+", label: "UI frames shipped" },
                { value: 3, suffix: "", label: "Notable games" },
              ].map((stat, i) => (
                <TiltCard key={i} className="glass rounded-2xl p-4 text-center card-hover" intensity={10}>
                  <p
                    className="text-2xl font-bold text-white font-display mb-1"
                    style={{ textShadow: '0 0 16px rgba(26,71,255,0.6)' }}
                  >
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[11px] text-white/35 leading-tight">{stat.label}</p>
                </TiltCard>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Skills and Tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                    whileHover={{ scale: 1.08, y: -2, transition: { duration: 0.2 } }}
                    className="px-3 py-1.5 rounded-full text-xs text-white/55 font-medium pill-badge hover:text-white/80 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <TiltCard className="glass-bright rounded-2xl p-5" intensity={8}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Notable Work</p>
              <div className="flex items-start gap-3">
                <img
                  src="/images/scp-icon.png"
                  alt="SCP Site Aether"
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-white">SCP Site Aether</p>
                  <p className="text-xs text-white/40 leading-relaxed mt-0.5">
                    Dark, immersive interfaces for a military/SCP roleplay environment. Loading screen, settings, locker UI, HUD, and proximity prompt designs.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
