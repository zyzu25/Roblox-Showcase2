import { motion } from "framer-motion";

export function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)' }}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer group"
          data-testid="nav-logo"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7b5fff, #4800ff)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.65" />
              <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.65" />
              <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" />
            </svg>
          </div>
          <span className="font-display font-bold text-base tracking-tight text-white">MYSTICFUSION7X</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'About', id: 'about' },
            { label: 'Work', id: 'portfolio' },
            { label: 'Services', id: 'services' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'Policies', id: 'policies' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              data-testid={`nav-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="ml-2 px-5 py-2 text-sm font-semibold text-white rounded-full transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #7b5fff, #4800ff)' }}
            data-testid="nav-contact"
          >
            Commission Me
          </button>
        </nav>
      </div>
    </motion.header>
  );
}
