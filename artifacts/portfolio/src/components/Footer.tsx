import { SiRoblox, SiDiscord } from "react-icons/si";

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          <div>
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
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {[
              { label: 'About', id: 'about' },
              { label: 'Work', id: 'portfolio' },
              { label: 'Services', id: 'services' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Policies', id: 'policies' },
              { label: 'Contact', id: 'contact' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm text-white/25 hover:text-white/60 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.roblox.com/users/search?keyword=ZYZU25"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/35 hover:text-white transition-all"
              style={{ transition: 'box-shadow 0.25s ease, border-color 0.25s ease' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(26,71,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,71,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.borderColor = '';
              }}
              data-testid="footer-link-roblox"
            >
              <SiRoblox className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/35 hover:text-white transition-all"
              style={{ transition: 'box-shadow 0.25s ease, border-color 0.25s ease' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(26,71,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,71,255,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.borderColor = '';
              }}
              data-testid="footer-link-discord"
            >
              <SiDiscord className="w-4 h-4" />
            </a>
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
