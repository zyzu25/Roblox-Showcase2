import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export function StickyPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="sticky-pill"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[190] flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold btn-primary shadow-lg"
          style={{ boxShadow: "0 4px 24px var(--c-glow)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users className="w-4 h-4" />
          Commission Me
        </motion.button>
      )}
    </AnimatePresence>
  );
}
