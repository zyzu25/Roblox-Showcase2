import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";

const testimonials = [
  {
    quote: "Bro literally made my game look like a completely different thing. The HUD and shop just hit different now, everyone in the server keeps asking who designed it.",
  },
  {
    quote: "The military UI was exactly what I needed. No back and forth, no weird revisions, just straight clean work. Understood the assignment immediately.",
  },
  {
    quote: "Loading screen alone got me like 5 extra players cause people were posting screenshots of it. The whole UI package was worth every robux. Def coming back for more.",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="testimonials" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Testimonials
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            <AnimatedText text="What clients say." delay={0.1} />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard className="glass rounded-2xl p-7 flex flex-col h-full card-hover" intensity={10} data-testid={`testimonial-card-${i}`}>
                <svg
                  className="w-7 h-7 mb-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: "var(--c-primary)", filter: "drop-shadow(0 0 6px var(--c-glow))", opacity: 0.7 }}
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/50 leading-relaxed text-sm flex-1 italic">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: "var(--c-primary)", boxShadow: "0 0 8px var(--c-glow)" }} />
                  <span className="text-xs text-white/25">Verified Client</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
