import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Contact() {
  return (
    <section className="py-28 border-t border-white/5" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Contact</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to upgrade<br />your game's UI?
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Currently accepting new commissions. Fill out the form and I'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 text-xs font-mono">ds</div>
                <span className="text-white/50 text-sm">Available on Discord</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 text-xs font-mono">rb</div>
                <span className="text-white/50 text-sm">Roblox messages accepted</span>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-2 font-medium">Name</label>
                  <input
                    placeholder="Your name"
                    className="w-full h-12 px-4 bg-card border border-border rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-2 font-medium">Roblox Username</label>
                  <input
                    placeholder="Player123"
                    className="w-full h-12 px-4 bg-card border border-border rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    data-testid="input-roblox"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 font-medium">Discord</label>
                <input
                  placeholder="username#0000"
                  className="w-full h-12 px-4 bg-card border border-border rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  data-testid="input-discord"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 font-medium">Project Details</label>
                <textarea
                  placeholder="Tell me about your game and the UI you need..."
                  rows={5}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
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
