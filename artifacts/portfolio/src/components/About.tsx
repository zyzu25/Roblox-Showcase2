import { motion } from "framer-motion";

const skills = [
  "ScreenGuis", "Frames & Layouts", "UI Animations",
  "Tweening", "Responsive Design", "Roblox Studio",
  "Figma", "Iconography", "Luau Scripting"
];

const stats = [
  { value: "3+", label: "Years of experience" },
  { value: "50+", label: "Projects completed" },
  { value: "20+", label: "Happy clients" },
];

export function About() {
  return (
    <section className="py-28 relative" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About Me</p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
              Engineering the feel<br />of great games.
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              I specialize in bridging the gap between aesthetics and functionality. Every interface I design is built to feel intuitive, look stunning, and run flawlessly within the Roblox engine. From high-fantasy RPG HUDs to sleek sci-fi menus, I adapt to your game's soul.
            </p>
            <p className="text-white/55 text-lg leading-relaxed">
              Whether you need a single screen or a full UI system — I handle design, scripting, and delivery. No template reuse. Everything is purpose-built.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-5 text-center"
                >
                  <p className="text-3xl font-bold text-white font-display mb-1">{stat.value}</p>
                  <p className="text-xs text-white/45 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Skills & Tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-full text-sm text-white/70 font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
