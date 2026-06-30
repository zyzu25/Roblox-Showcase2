import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Gift, Users, Percent, ChevronRight, Loader2, TrendingUp } from "lucide-react";

const STEPS = [
  { icon: Gift,    title: "Generate your code",       desc: "Enter your Discord to get a personal referral link." },
  { icon: Users,   title: "Share with your friends",  desc: "Send the code to anyone looking for Roblox UI work." },
  { icon: Percent, title: "Both get 10% off",         desc: "You earn 10% off your next order. They save 10% too." },
];

function GeneratePanel() {
  const [discord, setDiscord]   = useState("");
  const [code, setCode]         = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const [existing, setExisting] = useState(false);

  const generate = async () => {
    const d = discord.trim();
    if (!d) { setError("Enter your Discord username first."); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/referral/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discord: d }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      setCode(data.code);
      setExisting(data.existing);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5 h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>
          Step 1
        </p>
        <h3 className="text-lg font-bold text-white mb-1">Your referral code</h3>
        <p className="text-xs text-white/35 leading-relaxed">
          Generate a personal code tied to your Discord. Share it with anyone who needs Roblox UI work.
        </p>
      </div>

      {!code ? (
        <>
          <div>
            <label className="block text-xs text-white/30 mb-2 font-medium">Your Discord username</label>
            <input
              value={discord}
              onChange={e => { setDiscord(e.target.value); setError(null); }}
              onKeyDown={e => e.key === "Enter" && generate()}
              placeholder="yourusername"
              className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            />
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>
          <button
            onClick={generate}
            disabled={loading || !discord.trim()}
            className="h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all btn-primary disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate my code"}
          </button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-4"
        >
          {existing && (
            <p className="text-xs text-white/40 px-1">You already had a code. Here it is again.</p>
          )}
          <div
            className="rounded-xl p-4 flex items-center justify-between gap-3"
            style={{
              background: "rgba(120,60,255,0.10)",
              border: "1px solid rgba(120,60,255,0.25)",
            }}
          >
            <span
              className="text-2xl font-bold tracking-widest font-display"
              style={{ color: "var(--c-primary)", textShadow: "0 0 20px var(--c-glow)" }}
            >
              {code}
            </span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
              style={{
                background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)",
                color: copied ? "#4ade80" : "rgba(255,255,255,0.6)",
                border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-xs text-white/30 leading-relaxed space-y-1 px-1">
            <p>Share this code with friends who need Roblox UI design.</p>
            <p>When they use it in their commission request, you both get 10% off.</p>
          </div>
          <button
            onClick={() => { setCode(null); setDiscord(""); }}
            className="text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            Generate for a different username
          </button>
        </motion.div>
      )}
    </div>
  );
}

type ValidateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; referrer: string; discount: string; selfReferral: boolean; code: string }
  | { status: "invalid" }
  | { status: "error"; message: string };

function RedeemPanel() {
  const [code, setCode]     = useState("");
  const [claimer, setClaimer] = useState("");
  const [state, setState]   = useState<ValidateState>({ status: "idle" });

  const validate = async () => {
    const c = code.trim().toUpperCase();
    if (!c) { setState({ status: "error", message: "Enter a referral code." }); return; }
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c, claimerDiscord: claimer.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setState({ status: "error", message: data.error ?? "Something went wrong." }); return; }
      if (!data.valid) { setState({ status: "invalid" }); return; }
      setState({ status: "valid", referrer: data.referrer, discount: data.discount, selfReferral: data.selfReferral ?? false, code: data.code });
      // Store in sessionStorage so Contact form can pick it up
      sessionStorage.setItem("referralCode", data.code);
      sessionStorage.setItem("referralReferrer", data.referrer);
    } catch {
      setState({ status: "error", message: "Could not reach the server. Try again." });
    }
  };

  const apply = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-5 h-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--c-primary)" }}>
          Step 2
        </p>
        <h3 className="text-lg font-bold text-white mb-1">Redeem a referral code</h3>
        <p className="text-xs text-white/35 leading-relaxed">
          Got a code from a friend? Verify it here and it will automatically apply your discount to your commission request.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-white/30 mb-2 font-medium">Referral code</label>
          <input
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setState({ status: "idle" }); }}
            onKeyDown={e => e.key === "Enter" && validate()}
            placeholder="XXX-XXXXX"
            className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none font-mono tracking-widest"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          />
        </div>
        <div>
          <label className="block text-xs text-white/30 mb-2 font-medium">Your Discord <span className="text-white/20">(to verify it's not self-referral)</span></label>
          <input
            value={claimer}
            onChange={e => setClaimer(e.target.value)}
            placeholder="yourusername"
            className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
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
        {state.status === "loading" ? "Verifying..." : "Verify code"}
      </button>

      {state.status === "invalid" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 text-center">
          That code does not exist. Double-check it and try again.
        </motion.p>
      )}

      {state.status === "error" && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 text-center">
          {state.message}
        </motion.p>
      )}

      {state.status === "valid" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-3"
        >
          {state.selfReferral ? (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <p className="text-sm font-semibold text-red-400 mb-1">Self-referral detected</p>
              <p className="text-xs text-red-300/60">
                This code belongs to you. Referral discounts only apply when a different person uses your code.
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-sm font-semibold text-green-400">Valid code</p>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                Referred by <span className="text-white/80 font-semibold">{state.referrer}</span>. 
                Your discount has been noted. Fill in your commission request and it will be applied automatically.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
                  You: 10% off
                </span>
                <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ background: "rgba(120,60,255,0.12)", color: "var(--c-primary)", border: "1px solid var(--c-border)" }}>
                  {state.referrer}: 10% off next order
                </span>
              </div>
            </div>
          )}
          {!state.selfReferral && (
            <button
              onClick={apply}
              className="w-full h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
            >
              Apply to my commission request
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}

export function ReferralSection() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative overflow-hidden" id="referral" style={{ zIndex: 2 }}>
      {/* Section number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        05
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-xl mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Referral Program
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Spread the word,<br />
            <span className="gradient-text">earn discounts.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-base text-white/40 leading-relaxed"
          >
            Know a game developer who needs UI work? Refer them with your personal code. When they commission, you both save 10%.
          </motion.p>
        </div>

        {/* Two-tier explanation */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {/* Tier 1 — one-time */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                <Percent className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">One-Time Referral</p>
                <p className="text-[10px] text-white/30 mt-0.5">Send one friend, get rewarded</p>
              </div>
              <span className="ml-auto text-[10px] px-2 py-1 rounded-full font-semibold flex-shrink-0"
                style={{ background: "rgba(120,60,255,0.12)", color: "var(--c-primary)", border: "1px solid var(--c-border)" }}>
                Standard
              </span>
            </div>
            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <step.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--c-primary)", opacity: 0.7 }} />
                  <div>
                    <p className="text-xs font-semibold text-white/70">{step.title}</p>
                    <p className="text-[10px] text-white/30 leading-snug">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tier 2 — long-term partner */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(120,60,255,0.08))",
              border: "1px solid rgba(251,191,36,0.20)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Long-Term Partner</p>
                <p className="text-[10px] text-white/30 mt-0.5">Consistently bring clients</p>
              </div>
              <span className="ml-auto text-[10px] px-2 py-1 rounded-full font-semibold flex-shrink-0"
                style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}>
                Partner
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#fbbf24", opacity: 0.8 }} />
                <div>
                  <p className="text-xs font-semibold text-white/70">Earn a cut, not a discount</p>
                  <p className="text-[10px] text-white/30 leading-snug">Instead of 10% off your order, you receive a percentage of every commission you bring in — paid directly.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#fbbf24", opacity: 0.8 }} />
                <div>
                  <p className="text-xs font-semibold text-white/70">Ongoing, per-commission</p>
                  <p className="text-[10px] text-white/30 leading-snug">Every client you send earns you a cut of that specific job — no cap, no expiry.</p>
                </div>
              </div>
              <div
                className="rounded-xl px-3 py-2 mt-1"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)" }}
              >
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Partner status is earned by consistently referring paying clients. Rate is agreed on a case-by-case basis — DM to discuss.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Two panels */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <GeneratePanel />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <RedeemPanel />
          </motion.div>
        </div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs text-white/20 mt-6 text-center"
        >
          Discount applies to the next completed commission after a successful referral. Self-referrals are automatically detected and rejected. One discount per order.
        </motion.p>
      </div>
    </section>
  );
}
