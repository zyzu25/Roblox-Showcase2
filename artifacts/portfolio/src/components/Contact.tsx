import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, RotateCcw, Mail } from "lucide-react";
import { AnimatedLine } from "./AnimatedText";
import { MagneticButton } from "./MagneticButton";
import confetti from "canvas-confetti";

const INPUT_CLS =
  "w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[var(--c-border)]";

export function Contact() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [extraRevisions, setExtraRevisions]   = useState(false);
  const [rushDelivery, setRushDelivery]       = useState(false);
  const [status, setStatus]                   = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [confirmSent, setConfirmSent]         = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const pkg = sessionStorage.getItem("selectedPackage");
    if (pkg) { setSelectedPackage(pkg); sessionStorage.removeItem("selectedPackage"); }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const packageLabels: Record<string, string> = {
      starter: "Starter UI (R$1k to 4k / $5 to $15)",
      game:    "Game UI Package (R$4k to 12k / $15 to $50)",
      full:    "Full Game UI Package (R$12k to 30k / $50 to $100)",
      premium: "Premium UI Package (R$30k+ / $100+)",
      logos:   "Logo Design (R$229 to 779 / $2 to $7)",
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:            data.get("Name"),
          email:           data.get("Email"),
          roblox:          data.get("Roblox Username"),
          discord:         data.get("Discord"),
          packageSelected: packageLabels[selectedPackage] ?? selectedPackage,
          extraRevisions:  extraRevisions ? "Yes (+$3 each)" : "No",
          rushDelivery:    rushDelivery   ? "Yes (priority)"  : "No",
          details:         data.get("Project Details"),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Request failed");

      confetti({
        particleCount: 120, spread: 80, origin: { y: 0.7 },
        colors: ["#7c3aed","#a855f7","#ffffff","#c4b5fd","#6d28d9"], scalar: 0.9,
      });
      setConfirmSent(!!json.confirmationSent);
      setStatus("sent");
      form.reset();
      setSelectedPackage(""); setExtraRevisions(false); setRushDelivery(false);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="contact" style={{ zIndex: 2 }}>
      {/* Section number bg */}
      <div className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }} aria-hidden>06</div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* ── Left: intro + social cards ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">Contact</p>
            <div className="text-4xl md:text-5xl font-bold text-white mb-6">
              {["Ready to upgrade", "your game's UI?"].map((line, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                >{line}</motion.div>
              ))}
            </div>
            <AnimatedLine
              text="Currently open for commissions. Fill out the form and I'll get back to you as soon as possible."
              className="text-white/40 text-base leading-relaxed mb-10"
              delay={0.3}
            />

            <div className="space-y-3">
              {[
                { icon: "/images/discord.png", label: "Discord", value: "mysticfusion7x",
                  bg: "rgba(88,101,242,0.20)", bdr: "rgba(88,101,242,0.30)" },
                { icon: "/images/roblox.png",  label: "Roblox",  value: "ZYZU25",
                  bg: "rgba(255,80,40,0.18)",  bdr: "rgba(255,80,40,0.25)"  },
              ].map((card, i) => (
                <motion.div key={card.label}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="contact-social-card glass-bright rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                  whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.22 } }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--c-border)";
                    el.style.boxShadow   = "0 0 28px var(--c-glow-soft), 0 8px 24px rgba(0,0,0,0.35)";
                    el.style.background  = "var(--c-glass-bright)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = ""; el.style.boxShadow = ""; el.style.background = "";
                  }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: card.bg, border: `1px solid ${card.bdr}` }}>
                    <img src={card.icon} alt={card.label} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-white/25 mb-0.5">{card.label}</p>
                    <p className="text-sm font-semibold text-white">{card.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: form ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnimatePresence mode="wait">

              {/* Success */}
              {status === "sent" ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}>
                    <CheckCircle2 className="w-7 h-7" style={{ color: "#4ade80" }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-4 max-w-xs">
                    Your commission request landed in my inbox. I'll get back to you on Discord shortly.
                  </p>

                  {confirmSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl"
                      style={{ background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.20)" }}
                    >
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#a855f7" }} />
                      <p className="text-xs" style={{ color: "#a855f7" }}>A confirmation email was sent to you.</p>
                    </motion.div>
                  )}
                  {!confirmSent && <div className="mb-6" />}

                  <button
                    onClick={() => { setStatus("idle"); setConfirmSent(false); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white/80 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Send another request
                  </button>
                </motion.div>

              ) : (

              /* Form */
              <motion.form key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                ref={formRef} className="space-y-4" data-testid="contact-form" onSubmit={handleSubmit}
              >
                {/* Name + Roblox */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }}>
                    <label className="block text-xs text-white/30 mb-2 font-medium">Your Name</label>
                    <input name="Name" placeholder="Your name" required className={INPUT_CLS}
                      data-testid="input-name" style={{ borderColor: "var(--c-border-soft)" }} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.38, duration: 0.4 }}>
                    <label className="block text-xs text-white/30 mb-2 font-medium">Roblox Username</label>
                    <input name="Roblox Username" placeholder="Player123" className={INPUT_CLS}
                      data-testid="input-roblox" style={{ borderColor: "var(--c-border-soft)" }} />
                  </motion.div>
                </div>

                {/* Email + Discord */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.46, duration: 0.4 }}>
                    <label className="block text-xs text-white/30 mb-2 font-medium">
                      Email <span className="text-white/18 font-normal">(optional)</span>
                    </label>
                    <input name="Email" type="email" placeholder="your@email.com" className={INPUT_CLS}
                      data-testid="input-email" style={{ borderColor: "var(--c-border-soft)" }} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.52, duration: 0.4 }}>
                    <label className="block text-xs text-white/30 mb-2 font-medium">Discord</label>
                    <input name="Discord" placeholder="yourusername" className={INPUT_CLS}
                      data-testid="input-discord" style={{ borderColor: "var(--c-border-soft)" }} />
                  </motion.div>
                </div>

                {/* Package */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.58, duration: 0.4 }}>
                  <label className="block text-xs text-white/30 mb-2 font-medium">Package</label>
                  <select id="select-package" name="Package Selected"
                    value={selectedPackage} onChange={e => setSelectedPackage(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl text-sm focus:outline-none transition-all glass appearance-none hover:border-white/20 focus:border-[var(--c-border)]"
                    data-testid="select-package"
                    style={{ background: "rgba(255,255,255,0.04)", color: selectedPackage ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)", borderColor: "var(--c-border-soft)" }}
                  >
                    <option value="" className="bg-[#060816]">Select a package...</option>
                    <option value="starter" className="bg-[#060816]">Starter UI (R$1k to 4k / $5 to $15)</option>
                    <option value="game"    className="bg-[#060816]">Game UI Package (R$4k to 12k / $15 to $50)</option>
                    <option value="full"    className="bg-[#060816]">Full Game UI Package (R$12k to 30k / $50 to $100)</option>
                    <option value="premium" className="bg-[#060816]">Premium UI Package (R$30k+ / $100+)</option>
                    <option value="logos"   className="bg-[#060816]">Logo Design (R$229 to 779 / $2 to $7)</option>
                  </select>
                </motion.div>

                {/* Checkboxes */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.63, duration: 0.4 }} className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={extraRevisions} onChange={e => setExtraRevisions(e.target.checked)} className="w-4 h-4 rounded accent-[var(--c-primary)]" />
                    <span className="text-sm text-white/50">Extra Revisions <span className="text-white/70 font-semibold">+$3</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rushDelivery} onChange={e => setRushDelivery(e.target.checked)} className="w-4 h-4 rounded accent-[var(--c-primary)]" />
                    <span className="text-sm text-white/50">Rush Delivery <span className="text-white/70 font-semibold">+$5</span></span>
                  </label>
                </motion.div>

                {/* Details */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.68, duration: 0.4 }}>
                  <label className="block text-xs text-white/30 mb-2 font-medium">Project Details</label>
                  <textarea name="Project Details" rows={5}
                    placeholder="Tell me about your game, the UIs you need, and any references..."
                    className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all resize-none glass hover:border-white/20 focus:border-[var(--c-border)]"
                    data-testid="input-message" style={{ borderColor: "var(--c-border-soft)" }} />
                </motion.div>

                {/* Hint */}
                <p className="text-xs text-white/20 -mt-1">
                  Add your email above and you'll get a confirmation sent to your inbox.
                </p>

                {/* Error */}
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.22)" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f87171" }}>Couldn't send your request</p>
                      <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                        Something went wrong. DM me directly on Discord: <span className="text-white/65 font-medium">mysticfusion7x</span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Submit */}
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.75, duration: 0.4 }}>
                  <MagneticButton
                    type="submit" disabled={status === "sending"}
                    className="btn-primary w-full h-12 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
                    dataTestid="button-submit"
                    style={{ opacity: status === "sending" ? 0.7 : 1, cursor: status === "sending" ? "not-allowed" : "pointer" }}
                  >
                    {status === "sending"
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                      : <>Send Request<Send className="w-4 h-4" /></>}
                  </MagneticButton>
                </motion.div>
              </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
