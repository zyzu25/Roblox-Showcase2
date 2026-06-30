import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedText, AnimatedLine } from "./AnimatedText";

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer:
      "I accept Robux (via Game Pass or Gift Card) and USD. USD payments get a 20% discount on the total price. Discord Nitro may occasionally be accepted depending on the deal. Group funds are only accepted from trustworthy groups.",
  },
  {
    question: "Do I pay upfront?",
    answer:
      "Yes, a deposit is required before work begins. Large projects require 50% upfront, and small projects require 30% upfront. Full payment details are agreed before any work starts.",
  },
  {
    question: "How many revisions do I get?",
    answer:
      "The number of revisions included depends on your package. Revisions are for adjustments and tweaks, not full redesigns. If you need extra revisions beyond what's included, each additional one is charged at $3.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times are estimates and can vary depending on project complexity and how quickly you respond to feedback. Delays caused by your side (slow feedback, changing details) don't count against the delivery window. If you need it faster, Rush Delivery is available for an additional 25% of the original price.",
  },
  {
    question: "Can I add new features after the project has started?",
    answer:
      "New features or additions requested after initial approval are treated as a separate order and charged accordingly. To avoid extra costs, make sure to provide clear and complete project details before we begin.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds are only available if no work has been delivered yet. Once work has started, no refunds are issued, including for partially completed work. This is why payment and project scope are always agreed upfront.",
  },
  {
    question: "What format will my UI be delivered in?",
    answer:
      "Deliverables are built for Roblox and handed off in formats compatible with Roblox Studio, including ScreenGui files and any associated assets. Specifics depend on your project, so ask before ordering if you have particular requirements.",
  },
  {
    question: "Do you use templates?",
    answer:
      "No. Every project is purpose-built for your game from scratch. You won't receive a reskinned template. All UI systems are designed around your game's identity and requirements.",
  },
  {
    question: "Do you script / do you do scripting?",
    answer:
      "No. I'm a UI designer, not a scripter. I design and build the visual side of your UI (layouts, frames, icons, animations in Figma/Roblox Studio), but I don't write Lua scripts to make them functional. You'll need a separate developer to handle scripting.",
  },
  {
    question: "What tools and platforms do you use?",
    answer:
      "My primary design tool is Figma, where I do the majority of my design work: wireframing, layout, iconography, and asset creation. I also work directly in Roblox Studio to build and implement UI within your game.",
  },
  {
    question: "Can you refuse my order?",
    answer:
      "Yes. I reserve the right to refuse unclear or incomplete requests. If your brief isn't detailed enough to work from, I'll ask for more information. Providing clear project details upfront is the best way to avoid delays.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-28 border-t border-white/5 section-glow" id="faq" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Got Questions?
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <AnimatedText text="Frequently asked." delay={0.1} />
          </h2>
          <AnimatedLine
            text="Everything you need to know before placing a commission. Still unsure? Reach out directly."
            className="text-white/40 text-base leading-relaxed"
            delay={0.25}
          />
        </div>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const triggerId = `faq-trigger-${i}`;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                <button
                  id={triggerId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full text-left glass rounded-2xl px-6 py-5 flex items-center justify-between gap-4 group transition-all duration-300 hover:bg-white/[0.06]"
                  style={{
                    borderColor: isOpen ? "var(--c-primary)" : undefined,
                    boxShadow: isOpen ? "0 0 18px var(--c-glow)" : undefined,
                  }}
                >
                  <span
                    className="text-sm font-semibold transition-colors duration-200"
                    style={{ color: isOpen ? "var(--c-primary)" : "rgba(255,255,255,0.85)" }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  >
                    <ChevronDown
                      className="w-4 h-4 transition-colors duration-200"
                      style={{ color: isOpen ? "var(--c-primary)" : "rgba(255,255,255,0.3)" }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-2 text-sm text-white/50 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
