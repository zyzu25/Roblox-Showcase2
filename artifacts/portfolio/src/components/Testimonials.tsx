import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "MYSTICFUSION7X completely transformed our game's look. The UI went from a basic Roblox template to something that looked genuinely professional. Fast turnaround and the scripting was flawless.",
    author: "xX_DragonSlayer_Xx",
    role: "Lead Dev, Fort Benning RP",
  },
  {
    quote: "What impressed me most was how well they understood the military aesthetic. The CIA dashboard UI was clean, sharp, and fit the game perfectly. Communication was easy throughout.",
    author: "BloxCreator99",
    role: "Studio Owner",
  },
  {
    quote: "The SCP Site Aether UIs really elevated the whole experience. Players keep complimenting the loading screen and HUD. Worth every Robux and already coming back for more.",
    author: "NeonViper",
    role: "Project Manager, Site Aether",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            What clients say.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-7 flex flex-col card-hover"
              data-testid={`testimonial-card-${i}`}
            >
              <svg
                className="w-7 h-7 mb-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: '#3366ff', filter: 'drop-shadow(0 0 6px rgba(26,71,255,0.5))', opacity: 0.7 }}
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white/50 leading-relaxed text-sm flex-1 mb-7 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3366ff, #1a47ff)',
                    boxShadow: '0 0 12px rgba(26,71,255,0.4)',
                  }}
                >
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-white/25">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
