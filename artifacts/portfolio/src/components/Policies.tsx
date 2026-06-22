import { motion } from "framer-motion";

const policies = [
  {
    icon: "💳",
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
    icon: "📦",
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
    icon: "🔁",
    title: "Revisions Policy",
    items: [
      "Each order includes a limited number of revisions based on package",
      "Revisions are for adjustments, not full redesigns",
      "Extra revisions are charged separately at $3 each",
    ],
  },
  {
    icon: "⏱️",
    title: "Delivery Policy",
    items: [
      "Delivery times are estimates, not guarantees",
      "Timeframes may change depending on complexity or client response speed",
      "Rush delivery is available for an additional 25% of the original price",
      "Delays caused by client-side feedback are not counted against delivery time",
    ],
  },
  {
    icon: "🚫",
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
    <section className="py-28 border-t border-white/5" id="policies">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest gradient-text-accent mb-4">Policies & Terms</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Clear expectations.</h2>
          <p className="text-white/45 text-base leading-relaxed">
            These policies exist to keep all commissions fair and transparent. By ordering, you agree to the terms below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="glass rounded-2xl p-6"
              data-testid={`policy-card-${i}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{policy.icon}</span>
                <h3 className="text-base font-bold text-white">{policy.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {policy.items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2.5 text-sm text-white/50 leading-relaxed">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: 'linear-gradient(90deg, #7b5fff, #4800ff)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
