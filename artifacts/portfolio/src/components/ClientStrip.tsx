import { motion } from "framer-motion";

const clients = [
  { name: "Site Aether",           src: "/images/logos/site-aether.png"         },
  { name: "Troll Tower X",         src: "/images/logos/troll-tower-x.png"       },
  { name: "CIA",                   src: "/images/logos/cia.png"                 },
  { name: "BlueWhale Studio",      src: "/images/logos/bluewhale-studio.png"    },
  { name: "US Army Fort Benning",  src: "/images/logos/us-army-fort-benning.png"},
  { name: "UGC",                   src: "/images/logos/ugc.png"                },
  { name: "Extra Client",          src: "/images/logos/extra-client.png"        },
];

// Duplicate so the strip loops seamlessly
const items = [...clients, ...clients];

export function ClientStrip() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full overflow-hidden border-y border-white/5 py-6"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(8px)" }}
    >
      {/* Label */}
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white/20 mb-5">
        Trusted by games &amp; groups
      </p>

      {/* Marquee track */}
      <div
        className="flex gap-10 client-marquee"
        style={{ width: "max-content" }}
      >
        {items.map((client, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center"
            title={client.name}
            style={{ width: 80, height: 56 }}
          >
            <img
              src={client.src}
              alt={client.name}
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{
                filter: "grayscale(1) brightness(0.5)",
                opacity: 0.65,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0) brightness(1)";
                (e.currentTarget as HTMLImageElement).style.opacity = "1";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLImageElement).style.filter = "grayscale(1) brightness(0.5)";
                (e.currentTarget as HTMLImageElement).style.opacity = "0.65";
              }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
