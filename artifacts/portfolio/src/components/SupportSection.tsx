import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink } from "lucide-react";

export function SupportSection() {
  return (
    <section className="py-20 border-t border-white/5 relative" id="community" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-3">Community</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Support me by joining<br />
              <span className="gradient-text">NOVARA UGC.</span>
            </h2>
            <p className="text-sm text-white/40 leading-relaxed">
              NOVARA UGC is my Roblox community group. Joining supports my work as a UI designer and helps me grow. It's free and takes 5 seconds.
            </p>
          </motion.div>

          {/* Right: group card */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <a
              href="https://www.roblox.com/communities/6075277/NOVARA-UGC"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className="glass rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 group-hover:border-[rgba(var(--c-primary-rgb,124,58,237),0.35)]"
                style={{ minWidth: 300 }}
              >
                {/* Novara brand mark */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #e000ff, #4b2dff)",
                    boxShadow: "0 0 24px rgba(210,0,255,0.28)",
                  }}
                >
                  <img
                    src="/images/novara-ugc.png"
                    alt="NOVARA UGC"
                    className="w-full h-full rounded-xl object-cover"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-base font-bold text-white">NOVARA UGC</p>
                    {/* Verification mark */}
                    <div
                      className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#1d9bf0", width: 17, height: 17 }}
                      title="Verified group"
                    >
                      <BadgeCheck className="w-2.5 h-2.5 text-white" style={{ width: 11, height: 11 }} />
                    </div>
                  </div>
                  <p className="text-xs text-white/35 mb-3">Official Roblox community group</p>

                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: "rgba(var(--c-primary-rgb,124,58,237),0.12)",
                        border: "1px solid var(--c-border-soft)",
                        color: "var(--c-primary)",
                      }}
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      Join for free
                    </span>
                    <span className="text-[10px] text-white/20">· Free forever</span>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
