import { motion } from "framer-motion";

const TOOLS = [
  {
    name: "Figma",
    role: "UI / UX Design",
    desc: "Primary design tool for all interface layouts and prototyping",
    level: 95,
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
    level: 98,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#e8272a]">
        <path d="M3.89 16.006 2 6.026 12.099 4l1.893 9.98L3.89 16.006zm16.22-4.012L18.23 2l-9.997 2.006 1.876 9.98L20.11 11.994zM5.77 18l1.877 9.98L17.75 26 15.87 16.018 5.77 18z"/>
      </svg>
    ),
  },
  {
    name: "Photoshop",
    role: "Image & Texture Editing",
    desc: "Custom textures, backgrounds, and photo compositing for UI assets",
    level: 85,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#31a8ff]">
        <path d="M0 0h24v24H0V0zm4.8 16.4c0 .5.2.9.6 1.2.4.3.9.4 1.5.4.5 0 1-.1 1.4-.3.4-.2.7-.6.7-1.1 0-.4-.2-.7-.5-.9-.3-.2-.8-.4-1.4-.5-.9-.2-1.5-.5-1.9-.9-.4-.4-.6-.9-.6-1.5 0-.7.3-1.3.8-1.7.5-.4 1.2-.6 2-.6.9 0 1.6.2 2.1.6.5.4.8 1 .8 1.8H8.8c0-.4-.1-.7-.4-.9-.3-.2-.6-.3-1-.3-.4 0-.7.1-1 .3-.3.2-.4.4-.4.7 0 .3.1.5.4.7.3.2.8.4 1.5.5.9.2 1.6.5 2 .9.4.4.7.9.7 1.6 0 .8-.3 1.4-.8 1.8-.6.4-1.3.6-2.3.6-.9 0-1.7-.2-2.3-.7-.6-.5-.9-1.1-.9-1.9h1.4v-.1zM12 9.6h1.4v1c.2-.4.5-.6.9-.8.4-.2.8-.3 1.3-.3 1 0 1.8.3 2.3 1 .6.7.9 1.6.9 2.8 0 1.1-.3 2.1-.9 2.8-.6.7-1.4 1-2.4 1-.4 0-.8-.1-1.1-.2-.3-.2-.6-.4-.8-.7v3.6H12V9.6zm3.4 6.5c.6 0 1.1-.2 1.4-.7.3-.5.5-1.1.5-1.9s-.2-1.4-.5-1.8c-.3-.5-.8-.7-1.5-.7-.6 0-1.1.2-1.4.7-.3.5-.5 1.1-.5 1.8s.2 1.4.5 1.9c.3.5.8.7 1.5.7z"/>
      </svg>
    ),
  },
  {
    name: "Illustrator",
    role: "Vector & Logo Design",
    desc: "Creating scalable vector graphics, icons, and complex logo systems",
    level: 88,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#ff9a00]">
        <path d="M0 0h24v24H0V0zm7.3 15.9L6.4 19H4.8l3.4-10h2l3.5 10h-1.7l-.9-3.1H7.3zm3.6-1.2l-1.5-4.7-1.5 4.7h3zm6.2 4.3c-.5 0-.9-.1-1.3-.4-.4-.3-.7-.6-.9-1.1v1.4h-1.5V9h1.5v4.3c.2-.4.5-.7.9-1 .4-.3.8-.4 1.3-.4.9 0 1.6.3 2.1 1s.8 1.6.8 2.7-.3 2-.8 2.7c-.6.7-1.3 1-2.1.9zm-.3-1.2c.5 0 1-.2 1.3-.7.3-.5.5-1 .5-1.7s-.2-1.3-.5-1.7c-.3-.5-.8-.7-1.3-.7s-1 .2-1.3.6c-.3.4-.5 1-.5 1.8s.2 1.4.5 1.8c.4.4.8.6 1.3.6z"/>
      </svg>
    ),
  },
  {
    name: "VS Code",
    role: "Scripting & Luau",
    desc: "Writing Luau scripts and API integrations for advanced UI behavior",
    level: 80,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#007acc]">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.896V4.104a1.5 1.5 0 0 0-.85-1.517zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
      </svg>
    ),
  },
  {
    name: "Blender",
    role: "3D References & Assets",
    desc: "3D mockups and reference renders for realistic UI placement previews",
    level: 72,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#f5792a]">
        <path d="M12.51 13.214c.046-.8.438-1.538 1.075-2.028a3.46 3.46 0 0 1 2.463-.67c.897.084 1.72.49 2.286 1.146a3.32 3.32 0 0 1 .76 2.45 3.47 3.47 0 0 1-1.116 2.273 3.461 3.461 0 0 1-2.393.881 3.461 3.461 0 0 1-2.348-.986 3.38 3.38 0 0 1-.987-2.36q0-.355.06-.706zm4.098-9.171a.195.195 0 0 1-.19.136h-1.503a.195.195 0 0 1-.19-.139l-1.09-3.91c-.053-.19.098-.379.29-.373l3.471.09c.197.005.343.2.286.392zM8.217 9.715H5.652c-.11 0-.197-.09-.197-.2V6.946c0-.11.088-.2.197-.2h2.564c.11 0 .197.09.197.2v2.57c0 .11-.089.2-.197.2zm3.956 3.499c0 .41.324.742.724.742a.733.733 0 0 0 .724-.742.733.733 0 0 0-.724-.742.733.733 0 0 0-.724.742z"/>
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
            Every tool in my workflow — precision-picked for Roblox UI work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative rounded-2xl p-5 overflow-hidden cursor-default"
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
                {/* Icon + name row */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {tool.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{tool.name}</p>
                    <p className="text-[10px] font-medium" style={{ color: "var(--c-primary)" }}>{tool.role}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/40 leading-relaxed mb-4">{tool.desc}</p>

                {/* Skill bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] uppercase tracking-widest text-white/20 font-semibold">Proficiency</span>
                    <span className="text-[10px] font-bold" style={{ color: "var(--c-primary)" }}>{tool.level}%</span>
                  </div>
                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tool.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, var(--c-primary-dark), var(--c-primary))`,
                        boxShadow: "0 0 8px var(--c-glow)",
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
