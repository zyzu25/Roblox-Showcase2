import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "NexusUI completely transformed our game's feel. The UI went from feeling like a standard Roblox template to a standalone AAA title. Fast delivery and flawless scripting.",
    author: "xX_DragonSlayer_Xx",
    role: "Lead Dev, Fantasy Realm RPG",
  },
  {
    quote: "I've worked with many UI designers, but rarely do they understand the actual implementation. Delivered pixel-perfect Figma files and scripted them perfectly for mobile and PC.",
    author: "BloxCreator99",
    role: "Studio Owner",
  },
  {
    quote: "The animations on the inventory system alone increased our retention. Players just love interacting with the menus now. Worth every Robux.",
    author: "NeonViper",
    role: "Project Manager",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 border-t border-white/5" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">What clients say.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-7 flex flex-col"
              data-testid={`testimonial-card-${i}`}
            >
              <svg className="w-8 h-8 text-primary/40 mb-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-white/60 leading-relaxed text-sm flex-1 mb-7">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{t.author[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-white/35">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
