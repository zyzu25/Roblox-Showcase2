import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { AnimatedLine } from "./AnimatedText";
import { MagneticButton } from "./MagneticButton";
import confetti from "canvas-confetti";

export function Contact() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [extraRevisions, setExtraRevisions] = useState(false);
  const [rushDelivery, setRushDelivery]   = useState(false);
  const [referralCode, setReferralCode]   = useState("");
  const [referralBy, setReferralBy]       = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const pkg = sessionStorage.getItem("selectedPackage");
    if (pkg) { setSelectedPackage(pkg); sessionStorage.removeItem("selectedPackage"); }
    const code = sessionStorage.getItem("referralCode");
    const ref  = sessionStorage.getItem("referralReferrer");
    if (code) { setReferralCode(code); sessionStorage.removeItem("referralCode"); }
    if (ref)  { setReferralBy(ref);   sessionStorage.removeItem("referralReferrer"); }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Fire confetti, then let the native form submit proceed after a brief delay
    e.preventDefault();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#7c3aed", "#a855f7", "#ffffff", "#c4b5fd", "#6d28d9"],
      scalar: 0.9,
    });
    setTimeout(() => {
      formRef.current?.submit();
    }, 700);
  };

  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="contact" style={{ zIndex: 2 }}>
      {/* Section number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        06
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">Contact</p>
            <div className="text-4xl md:text-5xl font-bold text-white mb-6">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              >
                Ready to upgrade
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                your game's UI?
              </motion.div>
            </div>
            <AnimatedLine
              text="Currently open for commissions. Fill out the form and I'll get back to you as soon as possible."
              className="text-white/40 text-base leading-relaxed mb-10"
              delay={0.3}
            />

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="contact-social-card glass-bright rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.22 } }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--c-border)";
                  el.style.boxShadow = "0 0 28px var(--c-glow-soft), 0 8px 24px rgba(0,0,0,0.35)";
                  el.style.background = "var(--c-glass-bright)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "";
                  el.style.boxShadow = "";
                  el.style.background = "";
                }}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(88,101,242,0.20)", border: "1px solid rgba(88,101,242,0.30)" }}>
                  <img src="/images/discord.png" alt="Discord" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-white/25 mb-0.5">Discord</p>
                  <p className="text-sm font-semibold text-white">mysticfusion7x</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="contact-social-card glass-bright rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.22 } }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--c-border)";
                  el.style.boxShadow = "0 0 28px var(--c-glow-soft), 0 8px 24px rgba(0,0,0,0.35)";
                  el.style.background = "var(--c-glass-bright)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "";
                  el.style.boxShadow = "";
                  el.style.background = "";
                }}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(255,80,40,0.18)", border: "1px solid rgba(255,80,40,0.25)" }}>
                  <img src="/images/roblox.png" alt="Roblox" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-white/25 mb-0.5">Roblox</p>
                  <p className="text-sm font-semibold text-white">ZYZU25</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <form
              ref={formRef}
              action="https://formsubmit.co/dangert913@gmail.com"
              method="POST"
              className="space-y-4"
              data-testid="contact-form"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value="New Commission Request - MYSTICFUSION7X Portfolio" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="Package" value={selectedPackage} />
              <input type="hidden" name="Extra Revisions" value={extraRevisions ? "Yes (+$2 each)" : "No"} />
              <input type="hidden" name="Rush Delivery" value={rushDelivery ? "Yes (+$5)" : "No"} />
              <input type="hidden" name="Referral Code" value={referralCode || "None"} />
              <input type="hidden" name="Referred By" value={referralBy || "None"} />

              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <label className="block text-xs text-white/30 mb-2 font-medium">Your Name</label>
                  <input
                    name="Name"
                    placeholder="Your name"
                    required
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[var(--c-border)]"
                    data-testid="input-name"
                    style={{ borderColor: "var(--c-border-soft)" }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <label className="block text-xs text-white/30 mb-2 font-medium">Roblox Username</label>
                  <input
                    name="Roblox Username"
                    placeholder="Player123"
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[var(--c-border)]"
                    data-testid="input-roblox"
                    style={{ borderColor: "var(--c-border-soft)" }}
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="block text-xs text-white/30 mb-2 font-medium">Discord</label>
                <input
                  name="Discord"
                  placeholder="yourusername"
                  className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[var(--c-border)]"
                  data-testid="input-discord"
                  style={{ borderColor: "var(--c-border-soft)" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <label className="block text-xs text-white/30 mb-2 font-medium">Package</label>
                <select
                  id="select-package"
                  name="Package Selected"
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-white/60 text-sm focus:outline-none transition-all glass appearance-none hover:border-white/20 focus:border-[var(--c-border)]"
                  data-testid="select-package"
                  style={{ background: "rgba(255,255,255,0.04)", color: selectedPackage ? "rgba(255,255,255,0.85)" : "", borderColor: "var(--c-border-soft)" }}
                >
                  <option value="" className="bg-[#060816]">Select a package...</option>
                  <option value="starter" className="bg-[#060816]">Starter UI (R$1k to 4k / $5 to $15)</option>
                  <option value="game" className="bg-[#060816]">Game UI Package (R$4k to 12k / $15 to $50)</option>
                  <option value="full" className="bg-[#060816]">Full Game UI Package (R$12k to 30k / $50 to $100)</option>
                  <option value="premium" className="bg-[#060816]">Premium UI Package (R$30k+ / $100+)</option>
                  <option value="logos" className="bg-[#060816]">Logo Design (R$229 to 779 / $2 to $7)</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="flex gap-4"
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extraRevisions}
                    onChange={(e) => setExtraRevisions(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--c-primary)]"
                  />
                  <span className="text-sm text-white/50">Extra Revisions <span className="text-white/70 font-semibold">+$2</span></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rushDelivery}
                    onChange={(e) => setRushDelivery(e.target.checked)}
                    className="w-4 h-4 rounded accent-[var(--c-primary)]"
                  />
                  <span className="text-sm text-white/50">Rush Delivery <span className="text-white/70 font-semibold">+$5</span></span>
                </label>
              </motion.div>

              {/* Referral code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.68, duration: 0.4 }}
              >
                {referralBy ? (
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)" }}
                  >
                    <span className="text-green-400 text-base">✓</span>
                    <div>
                      <p className="text-xs font-semibold text-green-400 leading-none mb-0.5">Referral applied</p>
                      <p className="text-xs text-white/35">Referred by <span className="text-white/60 font-medium">{referralBy}</span> · code <span className="font-mono text-white/50">{referralCode}</span>. 10% discount will be applied.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-white/30 mb-2 font-medium">Referral code <span className="text-white/20">(optional)</span></label>
                    <input
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="XXX-XXXXX"
                      className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[var(--c-border)] font-mono tracking-widest"
                      style={{ borderColor: "var(--c-border-soft)" }}
                    />
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <label className="block text-xs text-white/30 mb-2 font-medium">Project Details</label>
                <textarea
                  name="Project Details"
                  placeholder="Tell me about your game, the UIs you need, and any references..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all resize-none glass hover:border-white/20 focus:border-[var(--c-border)]"
                  data-testid="input-message"
                  style={{ borderColor: "var(--c-border-soft)" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <MagneticButton
                  type="submit"
                  className="btn-primary w-full h-12 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
                  dataTestid="button-submit"
                >
                  Send Request
                  <Send className="w-4 h-4" />
                </MagneticButton>
              </motion.div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
