import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";
import { AnimatedLine } from "./AnimatedText";

const policies = [
  {
    icon: "\ud83d\udcb3",
    title: "Payment Policy",
    items: [
      "All payments must be agreed before starting any work",
      "Work does not begin without confirmed payment or deposit",
      "Robux payments via Game Pass or Gift Card only",
      "Group funds not accepted unless from a trustworthy group",
      "USD payments receive a 20% discount on total price",
      "Discord Nitro may be accepted occasionally depending on the deal",
      "Large projects require 50% upfront; small projects require 30% upfront",
    ],
  },
  {
    icon: "\ud83d\udce6",
    title: "Order Policy",
    items: [
      "Pricing is based on project scope, not the number of UI frames",
      "Final price is locked before work begins",
      "New features or additions after approval are charged separately",
      "Clear project details must be provided before starting",
      "I reserve the right to refuse unclear requests",
    ],
  },
  {
    icon: "\ud83d\udd01",
    title: "Revisions Policy",
    items: [
      "Each order includes a limited number of revisions based on package",
      "Revisions are for adjustments, not full redesigns",
      "Extra revisions are charged separately at $3 each",
    ],
  },
  {
    icon: "\u23f1\ufe0f",
    title: "Delivery Policy",
    items: [
      "Delivery times are estimates, not guarantees",
      "Timeframes may change depending on complexity or client response speed",
      "Rush delivery is available for an additional 25% of the original price",
      "Delays caused by client-side feedback are not counted against delivery time",
    ],
  },
  {
    icon: "\ud83d\udeab",
    title: "Refund Policy",
    items: [
      "No refunds once work has started",
      "Refunds only apply if no work has been delivered",
      "Partially completed work is non-refundable",
      "Scams will result in permanent refusal of future work",
    ],
  },
];

export function Policies() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="policies" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Policies and Terms
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <AnimatedText text="Clear expectations." delay={0.1} />
          </h2>
          <AnimatedLine
            text="These policies exist to keep all commissions fair and transparent. By ordering, you agree to the terms below."
            className="text-white/40 text-base leading-relaxed"
            delay={0.25}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard className="glass rounded-2xl p-6 h-full" intensity={8} data-testid={`policy-card-${i}`}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{policy.icon}</span>
                  <h3 className="text-base font-bold text-white">{policy.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {policy.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2.5 text-sm text-white/45 leading-relaxed">
                      <div
                        className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                        style={{ background: 'linear-gradient(90deg, #3366ff, #1a47ff)', boxShadow: '0 0 4px rgba(26,71,255,0.6)' }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
