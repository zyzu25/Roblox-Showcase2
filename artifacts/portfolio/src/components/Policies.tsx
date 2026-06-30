import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";
import { AnimatedLine } from "./AnimatedText";
import { ChevronDown } from "lucide-react";

const policies = [
  {
    icon: "💳",
    title: "Payment Policy",
    color: "#C8A94A",
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
    color: "#7c3aed",
    items: [
      "Pricing is based on project scope, not the number of UI frames",
      "Final price is locked before work begins",
      "New features or additions after approval are charged separately",
      "Clear project details must be provided before starting",
      "I reserve the right to refuse unclear requests",
    ],
  },
  {
    icon: "🔄",
    title: "Revisions Policy",
    color: "#0ea5e9",
    items: [
      "Each order includes a limited number of revisions based on package",
      "Revisions are for adjustments, not full redesigns",
      "Extra revisions are charged separately at $3 each",
    ],
  },
  {
    icon: "⏱️",
    title: "Delivery Policy",
    color: "#10b981",
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
    color: "#ef4444",
    items: [
      "No refunds once work has started",
      "Refunds only apply if no work has been delivered",
      "Partially completed work is non-refundable",
      "Scams will result in permanent refusal of future work",
    ],
  },
];

function PolicyCard({ policy, i }: { policy: typeof policies[number]; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <TiltCard
        className="glass rounded-2xl overflow-hidden cursor-pointer select-none"
        intensity={6}
        onClick={() => setOpen(o => !o)}
      >
        {/* Header row */}
        <motion.div
          className="flex items-center gap-3 px-6 py-5"
          animate={{ background: open ? `${policy.color}0f` : "transparent" }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated icon container */}
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            animate={{ scale: open ? 1.1 : 1, rotate: open ? [0, -8, 8, 0] : 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ background: `${policy.color}20`, border: `1px solid ${policy.color}40` }}
          >
            {policy.icon}
          </motion.div>

          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{policy.title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: `${policy.color}99` }}>
              {policy.items.length} rule{policy.items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="mx-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${policy.color}50, transparent)` }}
          animate={{ opacity: open ? 1 : 0, scaleX: open ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <ul className="px-6 pb-5 pt-4 space-y-2.5">
                {policy.items.map((item, ii) => (
                  <motion.li
                    key={ii}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ii * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-start gap-3 text-sm text-white/50 leading-relaxed"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: policy.color, boxShadow: `0 0 6px ${policy.color}80` }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ delay: ii * 0.05 + 0.15, duration: 0.4 }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </TiltCard>
    </motion.div>
  );
}

export function Policies() {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <section className="py-28 border-t border-white/5 section-glow relative overflow-hidden" id="policies" style={{ zIndex: 2 }}>
      {/* Decorative background number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.018)" }}
        aria-hidden="true"
      >
        06
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ background: "var(--c-primary)", left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%`, opacity: 0.15 }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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

        {/* Expand all toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-end mb-4"
        >
          <button
            onClick={() => setAllOpen(o => !o)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
          >
            <motion.span animate={{ rotate: allOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policies.map((policy, i) => (
            <PolicyCardControlled key={i} policy={policy} i={i} forceOpen={allOpen} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 p-5 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-white/30 leading-relaxed max-w-2xl mx-auto">
            By commissioning, you acknowledge and agree to all policies above. If you have any questions before ordering,{" "}
            <a href="https://discord.com/users/mysticfusion7x" target="_blank" rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors" style={{ color: "var(--c-primary)" }}>
              DM me on Discord
            </a>{" "}
            first.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Controlled version that respects forceOpen
function PolicyCardControlled({ policy, i, forceOpen }: { policy: typeof policies[number]; i: number; forceOpen: boolean }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = forceOpen || localOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <TiltCard
        className="glass rounded-2xl overflow-hidden cursor-pointer select-none"
        intensity={6}
        onClick={() => setLocalOpen(o => !o)}
      >
        {/* Header row */}
        <motion.div
          className="flex items-center gap-3 px-6 py-5"
          animate={{ background: open ? `${policy.color}0f` : "transparent" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            animate={{ scale: open ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            style={{ background: `${policy.color}20`, border: `1px solid ${policy.color}40` }}
          >
            {policy.icon}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{policy.title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: `${policy.color}99` }}>
              {policy.items.length} rule{policy.items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35 }}>
            <ChevronDown className="w-4 h-4 text-white/30" />
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${policy.color}50, transparent)` }}
          animate={{ opacity: open ? 1 : 0, scaleX: open ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        />

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <ul className="px-6 pb-5 pt-4 space-y-2.5">
                {policy.items.map((item, ii) => (
                  <motion.li
                    key={ii}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ii * 0.05, duration: 0.35 }}
                    className="flex items-start gap-3 text-sm text-white/50 leading-relaxed"
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: policy.color, boxShadow: `0 0 6px ${policy.color}80` }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </TiltCard>
    </motion.div>
  );
}
