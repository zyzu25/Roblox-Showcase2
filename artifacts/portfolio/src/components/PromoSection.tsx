import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, Loader2, MessageSquare, Percent, ChevronRight } from "lucide-react";

type RedeemState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; discount: string; code: string }
  | { status: "invalid" }
  | { status: "error"; message: string };

function RedeemPanel() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<RedeemState>({ status: "idle" });

  const validate = async () => {
    const c = code.trim().toUpperCase();
    if (!c) { setState({ status: "error", message: "Enter a promo code." }); return; }
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c }),
      });
      const data = await res.json();
      if (!res.ok) { setState({ status: "error", message: data.error ?? "Something went wrong." }); return; }
      if (!data.valid) { setState({ status: "invalid" }); return; }
      setState({ status: "valid", discount: data.discount, code: c });
      sessionStorage.setItem("promoCode", c);
      sessionStorage.setItem("promoDiscount", data.discount);
    } catch {
      setState({ status: "error", message: "Could not reach the server. Try again." });
    }
  };

  const apply = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>
          Promo Code
        </p>
        <h3 className="text-lg font-bold text-white mb-1">Got a code?</h3>
        <p className="text-xs text-white/35 leading-relaxed">
          Enter your promo code below to unlock a discount on your commission. Codes are case-insensitive.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-white/30 mb-2 font-medium">Promo code</label>
          <input
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setState({ status: "idle" }); }}
            onKeyDown={e => e.key === "Enter" && validate()}
            placeholder="ENTER CODE"
            className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none font-mono tracking-widest"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: state.status === "valid" ? "1px solid rgba(74,222,128,0.4)" : state.status === "invalid" || state.status === "error" ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.09)",
              transition: "border-color 0.25s ease",
            }}
          />
        </div>
      </div>

      <button
        onClick={validate}
        disabled={state.status === "loading" || !code.trim()}
        className="h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all btn-primary disabled:opacity-40"
      >
        {state.status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Percent className="w-4 h-4" />}
        {state.status === "loading" ? "Checking..." : "Apply code"}
      </button>

      <AnimatePresence mode="wait">
        {state.status === "invalid" && (
          <motion.p key="invalid" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400 text-center">
            That code doesn't exist or has expired.
          </motion.p>
        )}
        {state.status === "error" && (
          <motion.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400 text-center">
            {state.message}
          </motion.p>
        )}
        {state.status === "valid" && (
          <motion.div
            key="valid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-3"
          >
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-400">Code applied!</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Code <span className="font-mono font-bold text-white/80">{state.code}</span> gives you{" "}
                <span className="font-bold text-green-400">{state.discount}</span> off your commission.
              </p>
            </div>
            <button
              onClick={apply}
              className="w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              Go to commission form
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReferralInfo() {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5 h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>
          Referral Program
        </p>
        <h3 className="text-lg font-bold text-white mb-1">Want your own code?</h3>
        <p className="text-xs text-white/35 leading-relaxed">
          I run a personal referral program — when you refer someone who commissions, you both earn discounts on future orders.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { icon: "🤝", title: "You refer a friend", desc: "Point someone to my portfolio who needs Roblox UI work." },
          { icon: "💼", title: "They commission", desc: "Once their project is completed, the referral is counted." },
          { icon: "🎁", title: "You both save", desc: "You get a discount code for your next order. They save too." },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-lg flex-shrink-0">{step.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white/80">{step.title}</p>
              <p className="text-xs text-white/30 leading-relaxed mt-0.5">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <a
        href="https://discord.com/users/mysticfusion7x"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all btn-primary"
      >
        <MessageSquare className="w-4 h-4" />
        DM me to join the referral program
      </a>

      <p className="text-[10px] text-white/20 text-center">
        Referral codes are issued manually after your first commission. One discount per order.
      </p>
    </div>
  );
}

export function PromoSection() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative overflow-hidden" id="promo" style={{ zIndex: 2 }}>
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        05
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Discounts
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Save on your<br />
            <span className="gradient-text">commission.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base text-white/40 leading-relaxed"
          >
            Have a promo code? Redeem it instantly. Want your own code? DM me about the referral program.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <RedeemPanel />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <ReferralInfo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
