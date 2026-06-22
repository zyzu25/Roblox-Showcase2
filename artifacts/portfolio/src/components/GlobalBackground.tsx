import { useEffect, useRef } from "react";

export function GlobalBackground() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.004;

      if (orb1Ref.current) {
        const x = Math.sin(t * 0.7) * 80;
        const y = Math.cos(t * 0.5) * 60;
        orb1Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(t * 0.8) * 0.08})`;
      }
      if (orb2Ref.current) {
        const x = Math.cos(t * 0.6) * 70;
        const y = Math.sin(t * 0.9) * 50;
        orb2Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.cos(t * 0.6) * 0.07})`;
      }
      if (orb3Ref.current) {
        const x = Math.sin(t * 0.4 + 1) * 60;
        const y = Math.cos(t * 0.7 + 2) * 45;
        orb3Ref.current.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(t) * 0.06})`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base: very dark navy */}
      <div className="absolute inset-0" style={{ background: '#00000a' }} />

      {/* Primary glow — large vivid royal blue, right of center */}
      <div
        ref={orb1Ref}
        className="absolute"
        style={{
          top: '-10%',
          right: '-5%',
          width: '75vw',
          height: '90vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(10,55,255,0.88) 0%, rgba(5,25,200,0.55) 28%, rgba(0,8,90,0.22) 55%, transparent 72%)',
          filter: 'blur(55px)',
          willChange: 'transform',
        }}
      />

      {/* Secondary glow — medium, left side */}
      <div
        ref={orb2Ref}
        className="absolute"
        style={{
          bottom: '5%',
          left: '-10%',
          width: '55vw',
          height: '70vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(8,40,220,0.55) 0%, rgba(3,15,130,0.28) 35%, transparent 65%)',
          filter: 'blur(70px)',
          willChange: 'transform',
        }}
      />

      {/* Tertiary glow — small accent, top left */}
      <div
        ref={orb3Ref}
        className="absolute"
        style={{
          top: '15%',
          left: '5%',
          width: '35vw',
          height: '50vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(5,30,200,0.35) 0%, transparent 60%)',
          filter: 'blur(80px)',
          willChange: 'transform',
        }}
      />

      {/* Vignette — keeps corners pure black like the reference */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,4,0.55) 60%, rgba(0,0,2,0.92) 85%, #000002 100%)',
        }}
      />
    </div>
  );
}
