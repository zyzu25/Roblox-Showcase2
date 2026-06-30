import { motion } from "framer-motion";
import { AnimatedLine } from "./AnimatedText";
import { TiltCard } from "./TiltCard";
import { CountUp } from "./CountUp";
import { ExternalLink, Users } from "lucide-react";
import { DiscordStatus } from "./DiscordStatus";

const skills = [
  "ScreenGuis", "Frames & Layouts", "Roblox Studio",
  "Figma", "Iconography", "Military RP UIs",
];

function VerifiedBadge({ color = "#5865F2" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 inline-block align-middle">
      <circle cx="12" cy="12" r="12" fill={color} />
      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function About() {
  return (
    <section className="py-28 relative border-t border-white/5 section-glow overflow-hidden" id="about" style={{ zIndex: 2 }}>
      {/* Section number */}
      <div
        className="absolute top-8 right-8 select-none pointer-events-none font-display font-bold leading-none"
        style={{ fontSize: "clamp(6rem,15vw,12rem)", color: "rgba(255,255,255,0.025)" }}
        aria-hidden="true"
      >
        01
      </div>

      {/* Signature watermark */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none opacity-[0.035]" aria-hidden="true">
        <img
          src="/signature.png"
          alt=""
          style={{ width: "clamp(200px,30vw,420px)", filter: "invert(1)" }}
          draggable={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">About Me</p>

            <div className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="text-white"
              >
                Hello, I'm
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="gradient-text"
              >
                MYSTICFUSION7X.
              </motion.div>
            </div>

            <AnimatedLine
              text="I'm a Roblox UI designer who focuses on polished interfaces that help games stand out. With over a year of hands-on experience, I've built UI systems for military roleplay games, SCP environments, and general Roblox titles."
              className="text-white/50 text-base leading-relaxed mb-4"
              delay={0.3}
            />
            <AnimatedLine
              text="I offer high-quality work and affordable pricing while keeping every project unique and visually strong. No templates, everything is purpose-built for your game."
              className="text-white/50 text-base leading-relaxed mb-8"
              delay={0.45}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-3 text-sm text-white/35"
            >
              <img src="/images/roblox.png" alt="Roblox" className="w-8 h-8 rounded-lg object-cover" />
              <span>ZYZU25 on Roblox</span>
              <span className="text-white/15 mx-1">·</span>
              <img src="/images/discord.png" alt="Discord" className="w-8 h-8 rounded-lg object-cover" />
              <span>mysticfusion7x on Discord</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-5"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 1, suffix: "+", label: "Year of experience" },
                { value: 50, suffix: "+", label: "UI frames shipped" },
                { value: 3, suffix: "", label: "Notable games" },
              ].map((stat, i) => (
                <TiltCard key={i} className="glass rounded-2xl p-4 text-center card-hover" intensity={10}>
                  <p
                    className="text-2xl font-bold text-white font-display mb-1"
                    style={{ textShadow: '0 0 16px var(--c-glow)' }}
                  >
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[11px] text-white/35 leading-tight">{stat.label}</p>
                </TiltCard>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Skills and Tools</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                    whileHover={{ scale: 1.08, y: -2, transition: { duration: 0.2 } }}
                    className="px-3 py-1.5 rounded-full text-xs text-white/55 font-medium pill-badge hover:text-white/80 transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <TiltCard className="glass-bright rounded-2xl p-5" intensity={8}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">Notable Work</p>
              <div className="flex items-start gap-3">
                <img
                  src="/images/scp-icon.png"
                  alt="SCP Site Aether"
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-white">SCP Site Aether</p>
                  <p className="text-xs text-white/40 leading-relaxed mt-0.5">
                    Dark, immersive interfaces for a military/SCP roleplay environment. Loading screen, settings, locker UI, HUD, and proximity prompt designs.
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Roblox profile card */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <a
                href="https://www.roblox.com/users/1510973392/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-2xl p-4 hover:bg-white/[0.06] transition-all duration-300 group"
                style={{ textDecoration: "none" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ boxShadow: "0 0 16px var(--c-glow-soft)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <img
                      src="/images/roblox-avatar.png"
                      alt="ZYZU25 Roblox avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-bold text-white">ZYZU25</p>
                      <VerifiedBadge color="var(--c-primary)" />
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium ml-0.5"
                        style={{ background: "var(--c-glow-soft)", color: "var(--c-primary)", border: "1px solid var(--c-border)" }}
                      >
                        Roblox
                      </span>
                    </div>
                    <p className="text-xs text-white/35 truncate">@MYSTICFUSION7X</p>
                    <p className="text-[11px] text-white/22 mt-1">Member since March 2020</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                </div>
              </a>
            </motion.div>

            {/* NOVARA UGC group — Support card */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >
              <a
                href="https://www.roblox.com/communities/6075277/NOVARA-UGC"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl p-4 hover:opacity-90 transition-all duration-300 group"
                style={{
                  background: "linear-gradient(135deg, rgba(120,60,255,0.14) 0%, rgba(80,20,200,0.10) 100%)",
                  border: "1px solid rgba(140,80,255,0.30)",
                  textDecoration: "none",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, rgba(120,60,255,0.35), rgba(60,20,180,0.4))",
                      border: "1px solid rgba(140,80,255,0.4)",
                      boxShadow: "0 0 14px rgba(120,60,255,0.25)",
                    }}
                  >
                    <Users className="w-5 h-5" style={{ color: "var(--c-primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-bold text-white">NOVARA UGC</p>
                      <VerifiedBadge color="var(--c-primary)" />
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Support me by joining my Roblox community group.
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                </div>
              </a>
            </motion.div>

            {/* Discord live presence */}
            <DiscordStatus />

          </motion.div>

        </div>
      </div>
    </section>
  );
}
