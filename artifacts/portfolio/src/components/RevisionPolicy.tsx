import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RotateCcw, Plus, Clock, AlertCircle } from "lucide-react";

const packages = [
  {
    name: "Starter UI",
    price: "$5–$15",
    revisions: 1,
    maxRevisions: 3,
    turnaround: "1–2 days",
    extraCost: "$2",
    notes: "Each revision is one round of feedback addressed. Additional revisions available at $2 each.",
    color: "#4ade80",
  },
  {
    name: "Game UI Package",
    price: "$15–$50",
    revisions: 2,
    maxRevisions: 3,
    turnaround: "2–5 days",
    extraCost: "$2",
    notes: "Two full revision rounds included. Any feedback is consolidated per round, not per individual comment.",
    color: "var(--c-primary)",
    popular: true,
  },
  {
    name: "Full Game UI",
    price: "$50–$100",
    revisions: 3,
    maxRevisions: 3,
    turnaround: "5–10 days",
    extraCost: "$2",
    notes: "Three revision rounds with detailed feedback sessions. Extra rounds available if needed.",
    color: "#22d3ee",
  },
  {
    name: "Premium UI",
    price: "$100+",
    revisions: 99,
    maxRevisions: 3,
    turnaround: "1–3 weeks",
    extraCost: "Included",
    notes: "Revisions are collaborative. We work together until the result is exactly right. No limit.",
    color: "#f59e0b",
  },
];

const faqItems = [
  {
    q: "What counts as one revision?",
    a: "One revision = one round of feedback. You collect all your notes, send them together, and I address everything in one pass. Sending feedback in multiple separate messages uses up revision rounds faster.",
  },
  {
    q: "What happens after I run out of revisions?",
    a: "Additional rounds are $2 each. If you need a major structural change (not covered in the original brief), that may be quoted separately.",
  },
  {
    q: "Can I request changes after the project is marked done?",
    a: "New features or significant design changes after final delivery are charged as a new project. Minor touch-ups within 48 hours of delivery are handled case by case.",
  },
  {
    q: "What if I change my mind mid-project?",
    a: "Direction changes mid-project use up a revision round. If the scope changes significantly, we'll discuss a price adjustment before continuing.",
  },
];

function RevisionDots({ count, max }: { count: number; max: number }) {
  const isUnlimited = count === 99;
  const dots = isUnlimited ? max : Math.min(count, max);
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.07, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-2 h-2 rounded-full"
          style={{
            background: (isUnlimited || i < dots) ? "var(--c-primary)" : "rgba(255,255,255,0.1)",
            boxShadow: (isUnlimited || i < dots) ? "0 0 6px var(--c-glow)" : "none",
          }}
        />
      ))}
      {isUnlimited && (
        <span className="text-[10px] font-bold ml-0.5" style={{ color: "var(--c-primary)" }}>∞</span>
      )}
    </div>
  );
}

export function RevisionPolicy() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/5">
      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: "var(--c-primary)" }}>
            Revision Policy
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
            How revisions <span className="gradient-text">actually work</span>
          </h2>
          <p className="mt-4 text-white/40 text-base max-w-md">
            No surprises. Know exactly what's included before you commission.
          </p>
        </motion.div>

        {/* Package revision cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative rounded-2xl p-5 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: pkg.popular ? `1px solid ${pkg.color}40` : "1px solid rgba(255,255,255,0.07)",
                boxShadow: pkg.popular ? `0 0 24px ${pkg.color}10` : "none",
              }}
            >
              {pkg.popular && (
                <span
                  className="absolute -top-2.5 left-4 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: pkg.color, color: "#fff" }}
                >
                  Most Popular
                </span>
              )}

              <div>
                <p className="text-xs font-bold text-white mb-0.5">{pkg.name}</p>
                <p className="text-[10px]" style={{ color: pkg.color }}>{pkg.price}</p>
              </div>

              {/* Revision count visual */}
              <div>
                <p className="text-[10px] text-white/35 uppercase tracking-wide mb-2">Revisions included</p>
                <RevisionDots count={pkg.revisions} max={pkg.maxRevisions} />
                <p className="mt-1.5 text-sm font-bold text-white">
                  {pkg.revisions === 99 ? "Unlimited" : `${pkg.revisions} round${pkg.revisions > 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-white/7">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-white/25 flex-shrink-0" />
                  <span className="text-[10px] text-white/35">{pkg.turnaround} delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Plus className="w-3 h-3 text-white/25 flex-shrink-0" />
                  <span className="text-[10px] text-white/35">Extra revisions: {pkg.extraCost}</span>
                </div>
              </div>

              <p className="text-[10px] text-white/25 leading-relaxed">{pkg.notes}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
            <p className="text-sm font-semibold text-white/70">Common Questions</p>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: openFaq === i ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white/70 pr-4">{item.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="px-5 pb-4 text-sm text-white/40 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex items-start gap-2.5 px-5 py-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <RotateCcw className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--c-primary)" }} />
          <p className="text-xs text-white/35 leading-relaxed">
            All revision counts reset per project. Revisions are for adjusting existing elements, not adding new screens or features outside the original brief.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
