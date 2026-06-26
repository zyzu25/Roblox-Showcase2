import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { GlobalBackground } from "@/components/GlobalBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";

const WM_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
  `<text x="100" y="100" dominant-baseline="middle" text-anchor="middle" ` +
  `font-family="Arial,sans-serif" font-size="12" font-weight="bold" ` +
  `fill="rgba(255,255,255,0.20)" transform="rotate(-35,100,100)" letter-spacing="2">` +
  `MYSTICFUSION7X</text></svg>`
);
const WM_URL = `url("data:image/svg+xml,${WM_SVG}")`;

function ProtectedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative select-none overflow-hidden rounded-xl"
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-auto block rounded-xl"
        style={{ pointerEvents: "none", userSelect: "none" }}
      />
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundImage: WM_URL,
          backgroundSize: "170px 170px",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute inset-0 rounded-xl"
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: "default" }}
      />
    </div>
  );
}

const logos = [
  { file: "epd-army.png",       name: "Executive Protection Detail",                  tag: "US Army",      tier: "HIGH" },
  { file: "vanguard-intel.png", name: "Vanguard Intelligence Branch",                 tag: "Vanguard Site", tier: "HIGH" },
  { file: "nasa.png",           name: "National Aeronautics and Space Administration", tag: "NASA",         tier: "HIGH" },
  { file: "ioc.png",            name: "Information Operations Center",                tag: "IOC",          tier: "HIGH" },
  { file: "usar.png",           name: "United States Army Reserve",                   tag: "USAR",         tier: "HIGH" },
  { file: "nsa.png",            name: "National Security Agency",                     tag: "NSA",          tier: "HIGH" },
  { file: "ang.png",            name: "Army National Guard",                          tag: "ANG",          tier: "HIGH" },
  { file: "ppg.png",            name: "Protective Programs Group",                    tag: "PPG",          tier: "HIGH" },
  { file: "ncasc.png",          name: "Natl. Counterintelligence and Security Center",tag: "NCASC",        tier: "HIGH" },
  { file: "usspacecom-dark.png",name: "United States Space Command",                  tag: "USSPACECOM",   tier: "HIGH" },
  { file: "fbi.png",            name: "Federal Bureau of Investigation",              tag: "FBI",          tier: "HIGH" },
  { file: "cia-uni.png",        name: "CIA University",                               tag: "EST. 2026",    tier: "MID"  },
  { file: "nga.png",            name: "National Geospatial-Intelligence Agency",      tag: "NGA",          tier: "HIGH" },
  { file: "usspacecom.png",     name: "United States Space Command",                  tag: "USSPACECOM",   tier: "HIGH" },
  { file: "ncti-color.png",     name: "Natl. Counterintelligence Training Institute", tag: "NCTI",         tier: "MID"  },
  { file: "ncti-bw.png",        name: "Natl. Counterintelligence Training Institute", tag: "NCTI (B&W)",   tier: "LOW"  },
];

const TIER = {
  HIGH: { bg: "rgba(139,61,255,0.12)",  border: "rgba(139,61,255,0.35)",  color: "#a855f7", label: "HIGH QUALITY" },
  MID:  { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.35)",  color: "#c084fc", label: "MID QUALITY"  },
  LOW:  { bg: "rgba(192,132,252,0.12)",  border: "rgba(192,132,252,0.35)",  color: "#d8b4fe", label: "LOW QUALITY"  },
};

const plans = [
  {
    tier: "HIGH",
    name: "High Quality",
    subtitle: "3D Icon Seals",
    usd: "$7",
    robux: "779 Robux",
    note: "tax included",
    time: "~3 hours per logo",
    min: "Minimum 1 logo",
    features: [
      "3D icon in the center (eagle, globe, etc.)",
      "Made from scratch or inspired by real divisions",
      "Custom outer ring with your text and colors",
      "PNG with transparent background",
    ],
  },
  {
    tier: "MID",
    name: "Mid Quality",
    subtitle: "2D Original Seals",
    usd: "$4",
    robux: "459 Robux",
    note: "tax included",
    time: "~2 hours per logo",
    min: "Minimum 2 logos",
    features: [
      "2D icon made fully from scratch",
      "Not copied or traced from real seals",
      "Custom outer ring with your text and colors",
      "PNG with transparent background",
    ],
  },
  {
    tier: "LOW",
    name: "Low Quality",
    subtitle: "2D Emblem + Custom Ring",
    usd: "$2",
    robux: "229 Robux",
    note: "tax included",
    time: "~1 hour per logo",
    min: "Minimum 3 logos",
    features: [
      "2D emblem center (FBI-style, etc.)",
      "Custom outer ring with your colors and text",
      "Reference must be provided",
      "PNG with transparent background",
    ],
  },
];

const orderFields = [
  ["QUALITY",                 "HIGH / MID / LOW"],
  ["PAYMENT",                 "PAYPAL / ROBUX"],
  ["NUMBER OF LOGOS",         "#"],
  ["DIVISION",                "FBI, CIA, ARMY, etc."],
  ["RING COLORS",             "or: MATCH TO ICON"],
  ["CENTER ICON / EMBLEM",    "reference here"],
  ["STYLE EXAMPLE",           "reference here"],
];

export default function Logos() {
  const [, navigate] = useLocation();

  const goContact = () => {
    navigate("/");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  return (
    <>
      <GlobalBackground />
      <ScrollProgress />
      <main className="relative min-h-screen overflow-x-hidden" style={{ background: "transparent" }}>

        {/* Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-[99] border-b border-white/5"
          style={{ background: "rgba(0,0,5,0.75)", backdropFilter: "blur(24px) saturate(1.2)" }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MagneticButton
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-white/45 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Portfolio
              </MagneticButton>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ boxShadow: "0 0 10px var(--c-glow)" }}
                >
                  <img src="/images/profile.jpg" alt="MYSTICFUSION7X" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight text-white">Logo Design</span>
              </div>
            </div>
            <MagneticButton
              onClick={goContact}
              className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-full"
            >
              Order Now
            </MagneticButton>
          </div>
        </motion.header>

        {/* Hero */}
        <section className="pt-36 pb-16 px-6" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
            >
              Logo Design Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="font-bold text-white leading-tight mb-5"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Seal-Style Logos<br />
              <span className="gradient-text">For RP Divisions.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="text-white/45 text-base max-w-lg leading-relaxed"
            >
              Over 2 years of experience making official-looking circular emblem logos for Roblox divisions and RP groups. Affordable pricing, fast delivery, reference required.
            </motion.p>
          </div>
        </section>

        {/* Logo Grid */}
        <section className="px-6 pb-28" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {logos.map((logo, i) => {
                const t = TIER[logo.tier as keyof typeof TIER];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.035, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className="rounded-2xl p-4 flex flex-col gap-3"
                    style={{
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    <ProtectedImage src={`/images/logos/${logo.file}`} alt={logo.name} />
                    <div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5"
                        style={{ background: `${t.color}22`, border: `1px solid ${t.border}`, color: t.color }}
                      >
                        {t.label}
                      </span>
                      <p className="text-xs text-white/80 font-semibold leading-tight">{logo.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{logo.tag}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 pb-28 border-t border-white/5" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto pt-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
            >
              Pricing
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-12"
            >
              Logo Pricing
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {plans.map((plan, i) => {
                const t = TIER[plan.tier as keyof typeof TIER];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <TiltCard className="rounded-2xl h-full card-hover" intensity={10}>
                      <div
                        className="p-6 flex flex-col h-full rounded-2xl"
                        style={{ background: t.bg, border: `1px solid ${t.border}` }}
                      >
                        <div className="mb-5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3"
                            style={{ background: `${t.color}22`, border: `1px solid ${t.border}`, color: t.color }}
                          >
                            {plan.tier} QUALITY
                          </span>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-xs text-white/35 mt-0.5">{plan.subtitle}</p>
                        </div>

                        <div className="mb-5 pb-5 border-b border-white/7">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span
                              className="text-3xl font-bold text-white font-display"
                              style={{ textShadow: `0 0 24px ${t.color}80` }}
                            >
                              {plan.usd}
                            </span>
                            <span className="text-sm text-white/35">per logo</span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: t.color }}>{plan.robux}</p>
                          <p className="text-xs text-white/25">{plan.note}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/7 text-white/40">
                              {plan.time}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/7 text-white/40">
                              {plan.min}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-2.5 flex-1 mb-5">
                          {plan.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2 text-xs text-white/50">
                              <Check
                                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                                style={{ color: t.color, filter: `drop-shadow(0 0 4px ${t.color}80)` }}
                              />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <MagneticButton
                          onClick={goContact}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/75 hover:text-white transition-colors"
                          style={{ background: `${t.color}18`, border: `1px solid ${t.border}` } as React.CSSProperties}
                        >
                          Order {plan.name}
                        </MagneticButton>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Add-ons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-5 flex flex-wrap gap-6 items-center"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25">Add-Ons</p>
              {[
                { label: "Different colors / extra color variant:", value: "+$1" },
                { label: "Priority (start sooner):", value: "+$5" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "var(--c-primary)", boxShadow: "0 0 6px var(--c-glow)" }}
                  />
                  <span className="text-sm text-white/40">
                    {item.label}{" "}
                    <span className="text-white/65 font-semibold">{item.value}</span>
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How to Order */}
        <section className="px-6 pb-28 border-t border-white/5" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto pt-20 grid md:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4">How to Order</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                DM me with this<br />
                <span className="gradient-text">order template.</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Fill in the template below and send it to me on Discord. I'll reply with the exact price and start date. Simple, fast, no back-and-forth.
              </p>
              <MagneticButton
                onClick={goContact}
                className="btn-primary flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-full"
              >
                Commission Me Now
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard className="glass-bright rounded-2xl p-6" intensity={6}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-5">Order Template</p>
                <div className="space-y-0">
                  {orderFields.map(([key, val], i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                      className="flex gap-4 py-2.5 border-b border-white/5 last:border-0"
                    >
                      <span className="text-[11px] text-white/30 font-mono min-w-[10.5rem] flex-shrink-0">{key}:</span>
                      <span className="text-[11px] text-white/55 font-mono">{val}</span>
                    </motion.div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center pb-12 px-6" style={{ position: "relative", zIndex: 2 }}>
          <p className="text-xs text-white/15">
            All logos shown are works created by MYSTICFUSION7X. Unauthorized copying or use is prohibited.
          </p>
        </div>

      </main>
    </>
  );
}
