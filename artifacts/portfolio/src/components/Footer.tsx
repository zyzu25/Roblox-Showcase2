import { motion } from "framer-motion";

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'About', id: 'about' },
    { label: 'Work', id: 'portfolio' },
    { label: 'Services', id: 'services' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Policies', id: 'policies' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <footer className="border-t border-white/5 py-10" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3366ff, #1a47ff)',
                  boxShadow: '0 0 10px rgba(26,71,255,0.5)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" />
                  <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.65" />
                  <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.65" />
                  <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" />
                </svg>
              </div>
              <span className="font-display font-bold text-base text-white">MYSTICFUSION7X</span>
            </div>
            <p className="text-sm text-white/25 max-w-xs leading-relaxed">
              Roblox UI designer. Polished interfaces, affordable pricing, every project unique.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {links.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-white/25 hover:text-white/60 transition-colors text-left"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ x: 3, transition: { duration: 0.2 } }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <motion.a
              href="https://www.roblox.com/users/search?keyword=ZYZU25"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass flex items-center justify-center overflow-hidden transition-all"
              data-testid="footer-link-roblox"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(26,71,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,71,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.borderColor = '';
              }}
            >
              <img src="/images/roblox.png" alt="Roblox" className="w-5 h-5 object-contain" />
            </motion.a>
            <motion.a
              href="#"
              className="w-9 h-9 rounded-full glass flex items-center justify-center overflow-hidden transition-all"
              data-testid="footer-link-discord"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(26,71,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,71,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.borderColor = '';
              }}
            >
              <img src="/images/discord.png" alt="Discord" className="w-5 h-5 object-contain" />
            </motion.a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/15">
            &copy; {new Date().getFullYear()} MYSTICFUSION7X. Not affiliated with Roblox Corporation.
          </p>
          <p className="text-xs text-white/10">
            Roblox: ZYZU25 · Discord: mysticfusion7x
          </p>
        </div>
      </div>
    </footer>
  );
}
