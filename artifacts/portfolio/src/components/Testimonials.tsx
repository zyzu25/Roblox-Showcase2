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
    quote: "The SCP Site Aether UIs really elevated the whole experience. Players keep complimenting the loading screen and HUD. Worth every Robux — already coming back for more.",
    author: "NeonViper",
    role: "Project Manager, Site Aether",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-white/5" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest gradient-text-accent mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">What clients say.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-7 flex flex-col"
              data-testid={`testimonial-card-${i}`}
            >
              <svg className="w-7 h-7 mb-5 opacity-30" viewBox="0 0 24 24" fill="currentColor"
                style={{ color: '#7b5fff' }}>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white/55 leading-relaxed text-sm flex-1 mb-7 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7b5fff, #4800ff)' }}>
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-white/30">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
