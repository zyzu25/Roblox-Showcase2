import { motion } from "framer-motion";

const skills = [
  "ScreenGuis", "Frames & Layouts", "UI Animations",
  "Tweening", "Responsive Design", "Roblox Studio",
  "Figma", "Iconography", "Military RP UIs", "Luau Scripting",
];

export function About() {
  return (
    <section className="py-28 relative border-t border-white/5 section-glow" id="about">
      <div
        className="absolute right-0 top-0 w-[500px] h-[500px] opacity-12 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,71,255,0.5) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">About Me</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
              Hello, I'm<br />
              <span className="gradient-text">MYSTICFUSION7X.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-4">
              I'm a Roblox UI designer who focuses on polished interfaces that help games stand out. With over a year of hands-on experience, I've built UI systems for military roleplay games, SCP environments, and general Roblox titles.
            </p>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              I offer high-quality work and affordable pricing while keeping every project unique and visually strong. No templates, everything is purpose-built for your game.
            </p>
            <div className="flex items-center gap-3 text-sm text-white/35">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs font-mono font-bold text-white/40">rb</div>
              <span>ZYZU25 on Roblox</span>
              <span className="text-white/15 mx-1">·</span>
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-xs font-mono font-bold text-white/40">ds</div>
              <span>mysticfusion7x on Discord</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "1+", label: "Year of experience" },
                { value: "50+", label: "UI frames shipped" },
                { value: "3", label: "Notable games" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-4 text-center card-hover"
                >
                  <p
                    className="text-2xl font-bold text-white font-display mb-1"
                    style={{ textShadow: '0 0 16px rgba(26,71,255,0.6)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/35 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Skills and Tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="px-3 py-1.5 rounded-full text-xs text-white/55 font-medium pill-badge hover:text-white/80 transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="glass-bright rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Notable Work</p>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #1a47ff, #3366ff)',
                    boxShadow: '0 0 16px rgba(26,71,255,0.5)',
                  }}
                >
                  SCP
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">SCP Site Aether</p>
                  <p className="text-xs text-white/40 leading-relaxed mt-0.5">
                    Dark, immersive interfaces for a military/SCP roleplay environment. Loading screen, settings, locker UI, HUD, and proximity prompt designs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
