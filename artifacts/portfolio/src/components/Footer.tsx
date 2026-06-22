import { SiRoblox, SiDiscord, SiX } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="font-display font-bold text-base text-white/60">NexusUI</span>
        </div>

        <p className="text-white/30 text-sm">
          &copy; {new Date().getFullYear()} NexusUI. Not affiliated with Roblox Corporation.
        </p>

        <div className="flex items-center gap-2">
          {[
            { icon: SiRoblox, href: "#", label: "roblox" },
            { icon: SiDiscord, href: "#", label: "discord" },
            { icon: SiX, href: "#", label: "x" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all"
              data-testid={`footer-link-${label}`}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
