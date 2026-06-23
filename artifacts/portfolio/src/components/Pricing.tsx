import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";
import { MagneticButton } from "./MagneticButton";

const plans = [
  {
    name: "Starter UI",
    value: "starter",
    robux: "1,000 to 4,000",
    usd: "$5 to $15",
    note: "after discount",
    timeframe: "1 to 2 days",
    description: "Simple UI elements such as a menu, shop, settings, or a single HUD frame.",
    features: ["1 UI frame", "1 revision", "Basic styling", "Up to 2 frames per order"],
    limit: "Extra frames charged separately",
    highlight: false,
  },
  {
    name: "Game UI Package",
    value: "game",
    robux: "4,000 to 12,000",
    usd: "$15 to $50",
    note: "after discount",
    timeframe: "2 to 5 days",
    description: "A small connected UI system for gameplay. HUD, shop, and inventory combined into a consistent design.",
    features: ["Up to 4 UI frames", "2 revisions", "Consistent theme across all UI", "For early-stage or mid-size games"],
    limit: "Large systems like rebirth or pets charged separately",
    highlight: true,
  },
  {
    name: "Full Game UI Package",
    value: "full",
    robux: "12,000 to 30,000",
    usd: "$50 to $100",
    note: "after discount",
    timeframe: "5 to 10 days",
    description: "Complete UI system including HUD, shop, inventory, rebirth, pets, and additional menus.",
    features: ["5+ UI screens", "Multiple revisions", "Full UI planning", "Consistent design system"],
    limit: "Requires full UI list before starting",
    highlight: false,
  },
  {
    name: "Premium UI Package",
    value: "premium",
    robux: "30,000+",
    usd: "$100+",
    note: "after discount",
    timeframe: "1 to 3 weeks",
    description: "High-end UI systems for serious or large-scale games with strong visual identity and advanced layout design.",
    features: ["Full UI architecture design", "Priority communication", "Structured revision stages", "Optional animations"],
    limit: "Requires clear project scope before starting",
    highlight: false,
  },
];

function handleGetStarted(packageValue: string) {
  sessionStorage.setItem('selectedPackage', packageValue);
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    const select = document.getElementById('select-package') as HTMLSelectElement | null;
    if (select) {
      select.value = packageValue;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, 750);
}

export function Pricing() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="pricing" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Pricing
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <AnimatedText text="Transparent pricing." delay={0.1} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/40 text-base leading-relaxed"
          >
            USD payments receive a <span className="text-white/65 font-semibold">20% discount</span> on the total price. Robux payments via Game Pass or Gift Card only.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard
                className={`relative rounded-2xl p-6 flex flex-col h-full card-hover ${
                  plan.highlight
                    ? 'border border-[rgba(26,71,255,0.5)] bg-[rgba(26,71,255,0.07)]'
                    : 'glass'
                }`}
                intensity={10}
                data-testid={`pricing-card-${i}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #3366ff, #1a47ff)',
                        boxShadow: '0 0 12px rgba(26,71,255,0.5)',
                      }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-5 pb-5 border-b border-white/7">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xs text-white/25">R$</span>
                    <span className="text-lg font-bold text-white font-display">{plan.robux}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-sm font-semibold gradient-text-blue"
                      style={{ textShadow: '0 0 12px rgba(26,71,255,0.4)' }}
                    >
                      {plan.usd}
                    </span>
                    <span className="text-xs text-white/25">{plan.note}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/4 border border-white/7">
                    <span className="text-[10px] text-white/30">Delivery:</span>
                    <span className="text-[10px] text-white/50 font-medium">{plan.timeframe}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-5">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-white/50">
                      <Check
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        style={{ color: '#3366ff', filter: 'drop-shadow(0 0 4px rgba(26,71,255,0.6))' }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-white/20 leading-relaxed mb-5 border-t border-white/5 pt-4">
                  {plan.limit}
                </p>

                <MagneticButton
                  onClick={() => handleGetStarted(plan.value)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight ? 'btn-primary text-white' : 'glass text-white/60 hover:text-white hover:border-[rgba(26,71,255,0.3)]'
                  }`}
                  dataTestid={`pricing-cta-${i}`}
                >
                  Get Started
                </MagneticButton>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 glass rounded-2xl p-5 flex flex-wrap items-center gap-6"
        >
          {[
            { color: '#3366ff', text: 'Extra revisions:', value: '$3 each' },
            { color: '#5588ff', text: 'Rush delivery:', value: '+25% of original price' },
            { color: '#7799ff', text: 'Large projects:', value: '50% deposit upfront' },
            { color: '#99bbff', text: 'Small projects:', value: '30% deposit upfront' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
              <span className="text-sm text-white/40">{item.text} <span className="text-white/60">{item.value}</span></span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
