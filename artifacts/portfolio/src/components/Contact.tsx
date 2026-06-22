import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Contact() {
  return (
    <section className="py-28 border-t border-white/5 relative" id="contact">
      {/* Orb */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4800ff 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-accent mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to upgrade<br />your game's UI?
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-10">
              Currently open for commissions. Fill out the form and I'll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #5865F2, #404EED)' }}>ds</div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Discord</p>
                  <p className="text-sm font-semibold text-white">mysticfusion7x</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #ff6b35, #e84393)' }}>rb</div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Roblox</p>
                  <p className="text-sm font-semibold text-white">ZYZU25</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
              data-testid="contact-form"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/35 mb-2 font-medium">Your Name</label>
                  <input
                    placeholder="Your name"
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors glass"
                    style={{ background: 'rgba(72,0,255,0.04)' }}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/35 mb-2 font-medium">Roblox Username</label>
                  <input
                    placeholder="Player123"
                    className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors glass"
                    style={{ background: 'rgba(72,0,255,0.04)' }}
                    data-testid="input-roblox"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/35 mb-2 font-medium">Discord</label>
                <input
                  placeholder="mysticfusion7x"
                  className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors glass"
                  style={{ background: 'rgba(72,0,255,0.04)' }}
                  data-testid="input-discord"
                />
              </div>
              <div>
                <label className="block text-xs text-white/35 mb-2 font-medium">Package</label>
                <select
                  className="w-full h-11 px-4 rounded-xl text-white/70 text-sm focus:outline-none transition-colors glass appearance-none"
                  style={{ background: 'rgba(72,0,255,0.04)' }}
                  data-testid="select-package"
                >
                  <option value="" className="bg-black">Select a package...</option>
                  <option value="starter" className="bg-black">Starter UI (R$1k–4k / $5–$15)</option>
                  <option value="game" className="bg-black">Game UI Package (R$4k–12k / $15–$50)</option>
                  <option value="full" className="bg-black">Full Game UI Package (R$12k–30k / $50–$100)</option>
                  <option value="premium" className="bg-black">Premium UI Package (R$30k+ / $100+)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/35 mb-2 font-medium">Project Details</label>
                <textarea
                  placeholder="Tell me about your game, the UIs you need, and any references..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/20 text-sm focus:outline-none transition-colors resize-none glass"
                  style={{ background: 'rgba(72,0,255,0.04)' }}
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                style={{ background: 'linear-gradient(90deg, #7b5fff, #4800ff)' }}
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
