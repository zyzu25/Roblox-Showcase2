import { motion } from "framer-motion";
import { MessageSquare, DollarSign, Share2, CheckCircle2, Coins, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Share2,
    title: "Share my portfolio",
    desc: "Send my link to someone who needs Roblox UI design. That's literally all you have to do first.",
    num: "01",
  },
  {
    icon: CheckCircle2,
    title: "They commission me",
    desc: "Once they commission and we start the project, tell them to mention your name in the form.",
    num: "02",
  },
  {
    icon: DollarSign,
    title: "You earn 30%",
    desc: "After the commission is complete and paid, I send you 30% of what I charged — via Robux or PayPal.",
    num: "03",
  },
];

export function PromoSection() {
  return (
    <section
      className="py-28 border-t border-white/5 section-glow relative overflow-hidden"
      id="promo"
      style={{ zIndex: 2 }}
    >
      {/* Section number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        30%
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-14 items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
            >
              Commission Partner
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Help me get<br />
              <span className="gradient-text">commissions.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-base text-white/40 leading-relaxed"
            >
              No complicated codes. Just refer someone, they commission me, you earn 30% of whatever I charge. Paid in Robux or PayPal.
            </motion.p>
          </div>

          {/* Example card */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="glass-bright rounded-2xl p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-4">Example payout</p>
            <div className="space-y-3">
              {[
                { label: "Commission price", value: "$100" },
                { label: "Your earnings (30%)", value: "$30", highlight: true },
                { label: "Payment", value: "Robux or PayPal" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-white/40">{row.label}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: row.highlight ? "var(--c-primary)" : "rgba(255,255,255,0.75)" }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-4 pt-4 border-t border-white/6 text-xs text-white/25 leading-relaxed"
            >
              Earnings sent after the commission is fully completed and paid. No cap — refer as many clients as you want.
            </div>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {steps.map(({ icon: Icon, title, desc, num }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="glass rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              <div
                className="absolute top-4 right-4 font-display font-bold text-white/4 select-none"
                style={{ fontSize: "3.5rem", lineHeight: 1 }}
              >
                {num}
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border-soft)" }}
              >
                <Icon className="w-5 h-5" style={{ color: "var(--c-primary)" }} />
              </div>
              <div>
                <p className="text-base font-bold text-white mb-1">{title}</p>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="https://discord.com/users/mysticfusion7x"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white btn-primary"
          >
            <MessageSquare className="w-4 h-4" />
            DM me to become a partner
          </a>
          <p className="text-xs text-white/25">
            No requirements · Anyone can refer · Commission must complete before payout
          </p>
        </motion.div>
      </div>
    </section>
  );
}
