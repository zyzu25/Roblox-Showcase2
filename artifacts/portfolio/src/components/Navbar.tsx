import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTheme } from "./ThemeContext";
import { MagneticButton } from "./MagneticButton";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const themeColors = {
    purple: { bg: "#8b3dff", active: true },
    blue:   { bg: "#3366ff", active: false },
    white:  { bg: "#ffffff", active: false },
  };
  themeColors[theme].active = true;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: hidden ? -80 : 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-[99] border-b border-white/5"
      style={{ background: "rgba(0,0,5,0.75)", backdropFilter: "blur(24px) saturate(1.2)" }}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 cursor-pointer"
          data-testid="nav-logo"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
            style={{ boxShadow: "0 0 14px var(--c-glow)" }}
          >
            <img src="/images/profile.jpg" alt="MYSTICFUSION7X" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">MYSTICFUSION7X</span>
        </motion.button>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "About",    id: "about"     },
            { label: "Work",     id: "portfolio"  },
            { label: "Services", id: "services"   },
            { label: "Pricing",  id: "pricing"    },
            { label: "Policies", id: "policies"   },
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 text-sm text-white/45 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              data-testid={`nav-link-${item.id}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}

          <motion.button
            onClick={() => navigate("/logos")}
            className="px-4 py-2 text-sm font-semibold transition-colors rounded-lg hover:bg-white/5"
            style={{ color: "var(--c-primary)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="nav-link-logos"
          >
            Logos
          </motion.button>

          {/* Theme switcher */}
          <div className="flex items-center gap-1 ml-2 mr-2 pl-2 border-l border-white/10">
            {(["purple", "blue", "white"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className="w-4 h-4 rounded-full transition-all duration-300"
                style={{
                  background: themeColors[t].bg,
                  boxShadow: theme === t ? `0 0 8px ${themeColors[t].bg}` : "none",
                  transform: theme === t ? "scale(1.2)" : "scale(1)",
                  opacity: theme === t ? 1 : 0.5,
                }}
                title={`${t.charAt(0).toUpperCase() + t.slice(1)} theme`}
              />
            ))}
          </div>

          <MagneticButton
            onClick={() => scrollTo("contact")}
            className="btn-primary ml-2 px-5 py-2 text-sm font-semibold text-white rounded-full"
            dataTestid="nav-contact"
          >
            Commission Me
          </MagneticButton>
        </nav>
      </div>
    </motion.header>
  );
}
