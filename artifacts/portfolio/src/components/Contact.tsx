import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Contact() {
  return (
    <section className="py-28 border-t border-white/5 section-glow relative" id="contact">
      <div
        className="absolute bottom-0 right-0 w-[550px] h-[550px] opacity-12 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(26,71,255,0.5) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to upgrade<br />your game's UI?
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-10">
              Currently open for commissions. Fill out the form and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-3">
              <div className="glass-bright rounded-2xl p-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #5865F2, #404EED)', boxShadow: '0 0 14px rgba(88,101,242,0.4)' }}
                >
                  ds
                </div>
                <div>
                  <p className="text-xs text-white/25 mb-0.5">Discord</p>
                  <p className="text-sm font-semibold text-white">mysticfusion7x</p>
                </div>
              </div>
              <div className="glass-bright rounded-2xl p-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #ff6b35, #e84393)', boxShadow: '0 0 14px rgba(232,67,147,0.3)' }}
                >
                  rb
                </div>
                <div>
                  <p className="text-xs text-white/25 mb-0.5">Roblox</p>
                  <p className="text-sm font-semibold text-white">ZYZU25</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()} data-testid="contact-form">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/30 mb-2 font-medium">Your Name</label>
                  <input
                    placeholder="Your name"
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-colors glass"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/30 mb-2 font-medium">Roblox Username</label>
                  <input
                    placeholder="Player123"
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-colors glass"
                    data-testid="input-roblox"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-2 font-medium">Discord</label>
                <input
                  placeholder="mysticfusion7x"
                  className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-colors glass"
                  data-testid="input-discord"
                />
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-2 font-medium">Package</label>
                <select
                  className="w-full h-11 px-4 rounded-xl text-white/60 text-sm focus:outline-none transition-colors glass appearance-none"
                  data-testid="select-package"
                >
                  <option value="" className="bg-black">Select a package...</option>
                  <option value="starter" className="bg-black">Starter UI (R$1k to 4k / $5 to $15)</option>
                  <option value="game" className="bg-black">Game UI Package (R$4k to 12k / $15 to $50)</option>
                  <option value="full" className="bg-black">Full Game UI Package (R$12k to 30k / $50 to $100)</option>
                  <option value="premium" className="bg-black">Premium UI Package (R$30k+ / $100+)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/30 mb-2 font-medium">Project Details</label>
                <textarea
                  placeholder="Tell me about your game, the UIs you need, and any references..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/18 text-sm focus:outline-none transition-colors resize-none glass"
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full h-12 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm"
                data-testid="button-submit"
              >
                Send Request
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
