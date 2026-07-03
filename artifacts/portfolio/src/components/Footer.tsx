import { motion } from "framer-motion";
import { useDiscordAvatar } from "@/hooks/useDiscordAvatar";

export function Footer() {
  const avatar = useDiscordAvatar();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "About",    id: "about" },
    { label: "Work",     id: "portfolio" },
    { label: "Services", id: "services" },
    { label: "Pricing",  id: "pricing" },
    { label: "Policies", id: "policies" },
    { label: "Contact",  id: "contact" },
  ];

  const socials = [
    {
      label: "Roblox",
      href: "https://www.roblox.com/users/search?keyword=ZYZU25",
      testId: "footer-link-roblox",
      content: (
        <img src="/images/roblox.png" alt="Roblox" className="w-full h-full object-cover" />
      ),
    },
    {
      label: "Discord",
      href: "#",
      testId: "footer-link-discord",
      content: (
        <img src="/images/discord.png" alt="Discord" className="w-full h-full object-cover" />
      ),
    },
    {
      label: "X",
      href: "https://x.com/mysticfusion7x_",
      testId: "footer-link-x",
      content: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full p-2 text-white"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "PayPal",
      href: "https://paypal.me/mysticfusion7x",
      testId: "footer-link-paypal",
      content: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full p-2 text-white"
        >
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082H9.63l-1.496 9.478h2.79c.457 0 .85-.335.922-.79l.04-.19.73-4.627.047-.255a.933.933 0 0 1 .922-.79h.58c3.76 0 6.704-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471-.16-.178-.336-.345-.525-.504z" />
        </svg>
      ),
    },
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
                className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0"
                style={{ boxShadow: "0 0 14px var(--c-glow)" }}
              >
                <img src={avatar} alt="MYSTICFUSION7X" className="w-full h-full object-cover" />
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
                className="text-sm text-white/25 hover:text-white/60 transition-colors text-left cursor-pointer"
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

          {/* Social icons — fill the circle */}
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.href !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-testid={s.testId}
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
                style={{
                  background: "var(--c-glass-bg)",
                  border: "1px solid var(--c-border-soft)",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.2s ease",
                }}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 0 18px var(--c-glow), 0 4px 16px rgba(0,0,0,0.4)";
                  el.style.borderColor = "var(--c-border)";
                  el.style.background = "var(--c-glass-bright)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "";
                  el.style.borderColor = "var(--c-border-soft)";
                  el.style.background = "var(--c-glass-bg)";
                }}
              >
                {s.content}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/15">
            &copy; {new Date().getFullYear()} MYSTICFUSION7X. Not affiliated with Roblox Corporation.
          </p>
          <p className="text-xs text-white/10">
            Roblox: ZYZU25 &middot; Discord: mysticfusion7x &middot; X: @mysticfusion7x_
          </p>
        </div>
      </div>
    </footer>
  );
}
