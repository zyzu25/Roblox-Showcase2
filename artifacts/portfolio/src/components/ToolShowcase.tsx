import { motion } from "framer-motion";

const TOOLS = [
  {
    name: "Figma",
    role: "UI / UX Design",
    desc: "Primary design tool for all interface layouts, prototyping, and component systems",
    level: 90,
    icon: (
      <svg viewBox="0 0 38 57" fill="none" className="w-7 h-7">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83"/>
        <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262"/>
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
      </svg>
    ),
  },
  {
    name: "Roblox Studio",
    role: "Game UI Integration",
    desc: "Building and testing all UI components inside live Roblox environments",
    level: 75,
    icon: (
      <svg viewBox="0 0 200 200" fill="none" className="w-7 h-7">
        <rect width="200" height="200" rx="28" fill="#e8272a"/>
        <g transform="rotate(-24, 100, 100)">
          <rect x="44" y="62" width="112" height="76" rx="6" fill="white"/>
          <rect x="56" y="74" width="88" height="52" rx="4" fill="#e8272a"/>
          <rect x="68" y="86" width="64" height="28" rx="3" fill="white"/>
        </g>
      </svg>
    ),
  },
  {
    name: "Canva",
    role: "Graphics & Presentations",
    desc: "Quick graphics, social assets, and presentation visuals for project showcases",
    level: 75,
    icon: (
      <svg viewBox="0 0 100 100" fill="none" className="w-7 h-7">
        <circle cx="50" cy="50" r="50" fill="#7D2AE7"/>
        <path
          d="M67.5 57.5c-1.5 4.5-5.5 8-10.5 8-6.6 0-12-5.4-12-12s5.4-12 12-12c4.7 0 8.8 2.7 10.8 6.7"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="71" cy="50" r="4" fill="white"/>
      </svg>
    ),
  },
];

export function ToolShowcase() {
  return (
    <section className="relative py-24" id="tools" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: "var(--c-primary)" }}>
            My Arsenal
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Tools I Use</h2>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            Every tool in my workflow — precision-picked for Roblox UI design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="group relative rounded-2xl p-6 overflow-hidden cursor-default"
              style={{
                background: "var(--c-glass-bg)",
                border: "1px solid var(--c-border-soft)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: "radial-gradient(ellipse at 30% 30%, var(--c-glow-soft) 0%, transparent 70%)" }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-5 flex items-start gap-3">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      width: "52px",
                      height: "52px",
                      boxShadow: "0 0 20px var(--c-glow-soft)",
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-white leading-tight">{tool.name}</p>
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--c-primary)" }}>{tool.role}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/40 leading-relaxed mb-5">{tool.desc}</p>

                {/* Skill bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-white/20 font-semibold">Proficiency</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: "var(--c-primary)" }}>{tool.level}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tool.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, var(--c-primary-dark), var(--c-primary))`,
                        boxShadow: "0 0 10px var(--c-glow)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
