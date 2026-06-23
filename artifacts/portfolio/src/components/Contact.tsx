import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { AnimatedLine } from "./AnimatedText";
import { MagneticButton } from "./MagneticButton";

export function Contact() {
  const [selectedPackage, setSelectedPackage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedPackage');
    if (stored) {
      setSelectedPackage(stored);
      sessionStorage.removeItem('selectedPackage');
    }
  }, []);

  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="contact" style={{ zIndex: 2 }}>
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
                className="glass-bright rounded-2xl p-4 flex items-center gap-4"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <img src="/images/discord.png" alt="Discord" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
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
                className="glass-bright rounded-2xl p-4 flex items-center gap-4"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <img src="/images/roblox.png" alt="Roblox" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
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
              action="https://formsubmit.co/dangert913@gmail.com"
              method="POST"
              className="space-y-4"
              data-testid="contact-form"
            >
              <input type="hidden" name="_subject" value="New Commission Request - MYSTICFUSION7X Portfolio" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="Package" value={selectedPackage} />

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
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[rgba(26,71,255,0.4)]"
                    data-testid="input-name"
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
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[rgba(26,71,255,0.4)]"
                    data-testid="input-roblox"
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
                  className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all glass hover:border-white/20 focus:border-[rgba(26,71,255,0.4)]"
                  data-testid="input-discord"
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
                  className="w-full h-11 px-4 rounded-xl text-white/60 text-sm focus:outline-none transition-all glass appearance-none hover:border-white/20 focus:border-[rgba(26,71,255,0.4)]"
                  data-testid="select-package"
                  style={{ background: 'rgba(255,255,255,0.04)', color: selectedPackage ? 'rgba(255,255,255,0.85)' : '' }}
                >
                  <option value="" className="bg-[#060816]">Select a package...</option>
                  <option value="starter" className="bg-[#060816]">Starter UI (R$1k to 4k / $5 to $15)</option>
                  <option value="game" className="bg-[#060816]">Game UI Package (R$4k to 12k / $15 to $50)</option>
                  <option value="full" className="bg-[#060816]">Full Game UI Package (R$12k to 30k / $50 to $100)</option>
                  <option value="premium" className="bg-[#060816]">Premium UI Package (R$30k+ / $100+)</option>
                </select>
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
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-all resize-none glass hover:border-white/20 focus:border-[rgba(26,71,255,0.4)]"
                  data-testid="input-message"
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
