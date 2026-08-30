import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme, type Theme } from "./ThemeContext";
import { useAnimation } from "./AnimationContext";
import { MagneticButton } from "./MagneticButton";
import { AvailableHours } from "./AvailableHours";
import { ViewCounter } from "./ViewCounter";
import { ChevronDown, Palette, Droplets, Copy, Check, Menu, X } from "lucide-react";
import { useDiscordAvatar } from "@/hooks/useDiscordAvatar";

const THEME_CONFIG: Record<Theme, { bg: string; label: string; dot: string }> = {
  purple: { bg: "linear-gradient(135deg, #e000ff, #4b2dff)", label: "Purple", dot: "#e000ff" },
  black:  { bg: "#090909", label: "Black",  dot: "#777777" },
  red:    { bg: "#CC1A1A", label: "Red",    dot: "#CC1A1A" },
};

const THEME_ORDER: Theme[] = ["purple", "black", "red"];

const DISCORD_TAG = "mysticfusion7x";

const NAV_LINKS = [
  { label: "Work",      id: "portfolio" },
  { label: "Pricing",   id: "pricing"   },
  { label: "Reviews",   id: "reviews"   },
  { label: "FAQ",       id: "faq"       },
];

export function Navbar() {
  const [dropOpen, setDropOpen] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, navigate]                = useLocation();
  const { theme, setTheme }         = useTheme();
  const { animation, setAnimation } = useAnimation();
  const dropRef                     = useRef<HTMLDivElement>(null);
  const avatar                      = useDiscordAvatar();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id: string) => {
    setDropOpen(false);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const copyDiscord = async () => {
    try { await navigator.clipboard.writeText(DISCORD_TAG); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = DISCORD_TAG; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ANIMATIONS = [
    { id: "liquid" as const, label: "Smoky Flow", icon: Droplets, desc: "The loading screen's moving texture" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-[99]"
      style={{
        background: "linear-gradient(180deg, var(--c-glass-bright, rgba(10,8,20,0.9)) 0%, rgba(4,4,14,0.86) 100%)",
        borderBottom: "1px solid var(--c-border-soft)",
        backdropFilter: "blur(28px) saturate(1.5)",
        boxShadow: "0 1px 0 var(--c-border-soft), 0 12px 32px -12px rgba(0,0,0,0.6)",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}
      data-testid="navbar"
    >
      {/* Gradient bottom border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--c-primary) 35%, var(--c-primary-2, #a855f7) 65%, transparent 100%)", opacity: 0.55, boxShadow: "0 0 8px var(--c-glow-soft)" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-5">

        {/* Logo */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
          data-testid="nav-logo"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 0 18px var(--c-glow)", border: "1px solid var(--c-border-soft)" }}>
            <img src={avatar} alt="MYSTICFUSION7X" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-theme-strong">
            MYSTICFUSION7X
          </span>
        </motion.button>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group relative px-3 py-2 text-[13px] text-white/40 hover:text-white transition-colors rounded-lg"
              data-testid={`nav-link-${item.id}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {item.label}
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px transition-all duration-300"
                style={{
                  background: "var(--c-primary)",
                  width: "0%",
                  display: "block",
                }}
                ref={el => {
                  // CSS approach — let hover handle it via group
                }}
              />
            </motion.button>
          ))}

          {/* Logos nav */}
          <motion.button
            onClick={() => navigate("/logos")}
            className="px-3 py-2 text-[13px] font-semibold transition-colors rounded-lg text-accent"
            style={{ color: "var(--c-primary)" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            data-testid="nav-link-logos"
          >
            Logos
          </motion.button>

          {/* Discord copy */}
          <motion.button
            onClick={copyDiscord}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            title={copied ? "Copied!" : `Copy Discord: ${DISCORD_TAG}`}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ml-1"
            style={{
              background: copied ? "var(--c-glow-soft)" : "rgba(255,255,255,0.05)",
              border: copied ? "1px solid var(--c-border)" : "1px solid rgba(255,255,255,0.08)",
              color: copied ? "var(--c-primary)" : "rgba(255,255,255,0.45)",
              boxShadow: copied ? "0 0 10px var(--c-glow-soft)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-3 h-3" />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="w-3 h-3" />
                </motion.span>
              )}
            </AnimatePresence>
            <span>{copied ? "Copied!" : DISCORD_TAG}</span>
          </motion.button>

          {/* View counter */}
          <div className="hidden xl:block ml-1">
            <ViewCounter />
          </div>

          {/* Style dropdown */}
          <div className="relative ml-1" ref={dropRef}>
            <motion.button
              onClick={() => setDropOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] text-white/45 hover:text-white transition-colors hover:bg-white/5"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Style</span>
              <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 top-full mt-2 w-60 rounded-2xl overflow-hidden z-[200]"
                  style={{
                    background: "rgba(6,4,20,0.94)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Theme */}
                  <div className="px-4 pt-4 pb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {THEME_ORDER.map(t => {
                        const cfg = THEME_CONFIG[t];
                        const active = theme === t;
                        return (
                          <motion.button key={t} onClick={() => setTheme(t)}
                            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                            className="flex flex-col items-center gap-1.5 px-1 py-2 rounded-xl transition-all"
                            style={{
                              background: active ? "rgba(255,255,255,0.08)" : "transparent",
                              border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
                            }}
                          >
                            <div style={{
                              background: cfg.bg,
                              boxShadow: active ? `0 0 10px ${cfg.dot}` : "none",
                              border: t === "black" ? "1px solid rgba(255,255,255,0.2)" : "none",
                              transform: active ? "scale(1.2)" : "scale(1)",
                              transition: "all 0.25s ease",
                              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                            }} />
                            <span className="text-[8px] font-medium tracking-wide leading-none"
                              style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                              {cfg.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mx-4 border-t border-white/6" />

                  {/* Animation */}
                  <div className="px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Background</p>
                    <div className="flex flex-col gap-1">
                      {ANIMATIONS.map(({ id, label, icon: Icon, desc }) => {
                        const active = animation === id;
                        return (
                          <motion.button key={id} onClick={() => setAnimation(id)}
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all w-full"
                            style={{
                              background: active ? "rgba(255,255,255,0.07)" : "transparent",
                              border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                            }}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: active ? "var(--c-primary)" : "rgba(255,255,255,0.30)" }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium"
                                style={{ color: active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.45)" }}>
                                {label}
                              </p>
                              <p className="text-[9px] text-white/20 leading-none mt-0.5">{desc}</p>
                            </div>
                            {active && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: "var(--c-primary)", boxShadow: "0 0 6px var(--c-glow)" }} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden xl:block ml-1.5">
            <AvailableHours />
          </div>

          <MagneticButton
            onClick={() => scrollTo("contact")}
            className="btn-primary ml-2 px-5 py-2 text-sm font-semibold text-white rounded-full"
            dataTestid="nav-contact"
          >
            Commission Me
          </MagneticButton>
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <ViewCounter />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(open => !open)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-theme text-theme-muted"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-theme"
          >
            <div className="px-5 py-4 grid grid-cols-2 gap-2">
              {[...NAV_LINKS, { label: "Logos", id: "logos" }].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => item.id === "logos" ? (setMobileOpen(false), navigate("/logos")) : scrollTo(item.id)}
                  className="text-left px-3 py-3 rounded-xl text-sm text-theme-muted hover:text-theme-strong hover:bg-theme-soft transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="col-span-2 btn-primary rounded-xl py-3 text-sm font-semibold text-white"
              >
                Commission Me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
