import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_LINES = [
  "Crafting your experience...",
  "Loading premium UIs...",
  "Warming up the pixels...",
  "Almost there...",
];

type Vec3 = [number, number, number];

type LoadingTheme = {
  name: string;
  bg: string;
  glow: string;
  particleHue: [number, number];
  scanColor: string;
  progressFrom: string;
  progressTo: string;
  progressGlow: string;
  cornerColor: string;
  taglineColor: string;
  lineColor: string;
  filterStyle: string;
  webglCol1: Vec3;
  webglCol2: Vec3;
  webglBg: Vec3;
};

const THEMES: LoadingTheme[] = [
  {
    name: "purple",
    bg: "linear-gradient(160deg, #040408 0%, #0a0812 50%, #140d1a 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(80,20,160,0.22) 0%, transparent 65%)",
    particleHue: [260, 40],
    scanColor: "rgba(160,100,255,0.45)",
    progressFrom: "#5b21b6",
    progressTo: "#a855f7",
    progressGlow: "rgba(168,85,247,0.65)",
    cornerColor: "rgba(160,100,255,0.22)",
    taglineColor: "rgba(180,140,255,0.38)",
    lineColor: "rgba(160,120,255,0.45)",
    filterStyle: "invert(1) brightness(0.8) contrast(1.1) sepia(0.3) hue-rotate(260deg)",
    webglCol1: [0.66, 0.33, 1.0],
    webglCol2: [0.35, 0.12, 0.63],
    webglBg:   [0.015, 0.010, 0.040],
  },
  {
    name: "white",
    bg: "linear-gradient(160deg, #060608 0%, #0a0a10 50%, #111118 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(130,130,190,0.18) 0%, transparent 65%)",
    particleHue: [220, 30],
    scanColor: "rgba(200,200,230,0.45)",
    progressFrom: "#555566",
    progressTo: "#b0b0cc",
    progressGlow: "rgba(180,180,210,0.60)",
    cornerColor: "rgba(180,180,210,0.22)",
    taglineColor: "rgba(200,200,225,0.38)",
    lineColor: "rgba(190,190,220,0.45)",
    filterStyle: "invert(1) brightness(0.75) contrast(1.0) saturate(0.1)",
    webglCol1: [0.70, 0.70, 0.88],
    webglCol2: [0.38, 0.38, 0.55],
    webglBg:   [0.020, 0.020, 0.040],
  },
  {
    name: "light",
    bg: "linear-gradient(160deg, #020608 0%, #060e14 50%, #0a1620 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(30,100,170,0.22) 0%, transparent 65%)",
    particleHue: [200, 30],
    scanColor: "rgba(100,190,240,0.45)",
    progressFrom: "#0e5a8a",
    progressTo: "#5bb8e5",
    progressGlow: "rgba(91,184,229,0.60)",
    cornerColor: "rgba(80,180,230,0.22)",
    taglineColor: "rgba(140,210,245,0.40)",
    lineColor: "rgba(100,190,235,0.45)",
    filterStyle: "invert(1) brightness(0.75) contrast(1.05) sepia(0.15) hue-rotate(185deg)",
    webglCol1: [0.36, 0.72, 0.90],
    webglCol2: [0.06, 0.36, 0.54],
    webglBg:   [0.010, 0.025, 0.050],
  },
  {
    name: "dark",
    bg: "linear-gradient(160deg, #020202 0%, #080808 50%, #0e0e0e 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(80,80,80,0.18) 0%, transparent 65%)",
    particleHue: [0, 0],
    scanColor: "rgba(180,180,180,0.30)",
    progressFrom: "#333333",
    progressTo: "#888888",
    progressGlow: "rgba(150,150,150,0.50)",
    cornerColor: "rgba(160,160,160,0.20)",
    taglineColor: "rgba(200,200,200,0.30)",
    lineColor: "rgba(180,180,180,0.35)",
    filterStyle: "invert(1) brightness(0.65) contrast(0.9) grayscale(1)",
    webglCol1: [0.55, 0.55, 0.55],
    webglCol2: [0.25, 0.25, 0.25],
    webglBg:   [0.010, 0.010, 0.010],
  },
  {
    name: "novara",
    bg: "linear-gradient(160deg, #07000d 0%, #11001f 52%, #08052b 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(210,0,255,0.28) 0%, rgba(45,25,220,0.12) 42%, transparent 70%)",
    particleHue: [282, 78],
    scanColor: "rgba(236,72,255,0.55)",
    progressFrom: "#e000ff",
    progressTo: "#536dff",
    progressGlow: "rgba(218,0,255,0.72)",
    cornerColor: "rgba(226,76,255,0.30)",
    taglineColor: "rgba(236,183,255,0.58)",
    lineColor: "rgba(196,110,255,0.58)",
    filterStyle: "none",
    webglCol1: [0.92, 0.06, 0.86],
    webglCol2: [0.10, 0.04, 0.56],
    webglBg:   [0.015, 0.002, 0.035],
  },
  {
    name: "gold",
    bg: "linear-gradient(160deg, #060400 0%, #100c00 50%, #1a1200 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(160,100,0,0.24) 0%, transparent 65%)",
    particleHue: [38, 20],
    scanColor: "rgba(230,175,50,0.45)",
    progressFrom: "#7a5200",
    progressTo: "#d4a017",
    progressGlow: "rgba(212,160,23,0.65)",
    cornerColor: "rgba(210,160,30,0.22)",
    taglineColor: "rgba(240,190,80,0.40)",
    lineColor: "rgba(225,170,50,0.45)",
    filterStyle: "invert(1) brightness(0.75) contrast(1.08) sepia(0.6) hue-rotate(8deg)",
    webglCol1: [0.83, 0.63, 0.09],
    webglCol2: [0.47, 0.32, 0.00],
    webglBg:   [0.020, 0.016, 0.000],
  },
  {
    name: "red",
    bg: "linear-gradient(160deg, #060000 0%, #100000 50%, #1a0000 100%)",
    glow: "radial-gradient(ellipse at 50% 55%, rgba(160,10,10,0.24) 0%, transparent 65%)",
    particleHue: [0, 18],
    scanColor: "rgba(230,40,40,0.45)",
    progressFrom: "#7a0000",
    progressTo: "#cc1a1a",
    progressGlow: "rgba(204,26,26,0.65)",
    cornerColor: "rgba(210,30,30,0.22)",
    taglineColor: "rgba(240,100,100,0.40)",
    lineColor: "rgba(225,60,60,0.45)",
    filterStyle: "invert(1) brightness(0.72) contrast(1.12) sepia(0.8) hue-rotate(300deg)",
    webglCol1: [0.80, 0.10, 0.10],
    webglCol2: [0.47, 0.00, 0.00],
    webglBg:   [0.020, 0.000, 0.000],
  },
];

const LIQUID_VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const LIQUID_FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_col1;
  uniform vec3  u_col2;
  uniform vec3  u_bg;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    for (int i=0;i<5;i++) { v+=a*noise(p); p=p*2.1+vec2(1.78,3.13); a*=0.5; }
    return v;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.12;
    vec2 q = vec2(fbm(uv*1.2 + vec2(0.0, t*0.85)),
                  fbm(uv*1.2 + vec2(5.2, t*0.73)));
    vec2 r = vec2(fbm(uv*2.2 + 1.8*q + vec2(1.7, 9.2) + t*0.17),
                  fbm(uv*2.2 + 1.8*q + vec2(8.3, 2.8) + t*0.14));
    float f = fbm(uv*3.0 + 1.6*r + t*0.1);
    vec3 col = mix(u_bg,   u_col2, smoothstep(0.20, 0.60, f));
    col      = mix(col,    u_col1, smoothstep(0.50, 0.85, f));
    float vign = 1.0 - length((uv - 0.5) * 1.6);
    col *= clamp(0.30 + 0.70*vign, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const FIRE_VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FIRE_FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_fire1;
  uniform vec3  u_fire2;
  uniform vec3  u_fire3;
  uniform vec3  u_bg;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    for (int i=0;i<5;i++) { v+=a*noise(p); p=p*2.1+vec2(1.78,3.13); a*=0.5; }
    return v;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.18;
    vec2 p = uv * vec2(1.8, 2.2);
    p.y -= t * 0.55;
    p.x += sin(uv.y * 3.0 + t * 0.4) * 0.08;
    float n1 = fbm(p + vec2(0.0, t*0.3));
    float n2 = fbm(p*1.4 + vec2(5.2, t*0.22));
    float flame = fbm(p + 1.6*vec2(n1, n2));
    float fade = clamp(1.0 - uv.y * 1.15, 0.0, 1.0);
    flame *= fade * fade;
    flame *= sin(uv.y*5.0 + t*0.7)*0.04 + 0.96;
    flame  = clamp(flame, 0.0, 1.0);
    vec3 col = u_bg;
    col = mix(col,   u_fire3, smoothstep(0.05, 0.30, flame));
    col = mix(col,   u_fire2, smoothstep(0.28, 0.58, flame));
    col = mix(col,   u_fire1, smoothstep(0.52, 0.88, flame));
    float vign = clamp(1.0 - length((uv-0.5)*1.5), 0.0, 1.0);
    col *= 0.35 + 0.65*vign;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function setupWebGL(
  canvas: HTMLCanvasElement,
  vs: string,
  fs: string,
): WebGLRenderingContext | null {
  const gl = canvas.getContext("webgl");
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  return gl;
}

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  // The shared link card and the first page load should always be recognizable:
  // dark background, centered signature, and the liquid flow texture.
  const [theme] = useState<LoadingTheme>(() => THEMES.find(item => item.name === "novara") ?? THEMES[0]);
  const [animType] = useState<"liquid" | "fire">("liquid");
  const [phase, setPhase]     = useState<"intro" | "signature" | "name" | "outro">("intro");
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx]   = useState(0);

  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const glCanvasRef       = useRef<HTMLCanvasElement>(null);
  const particleRaf       = useRef<number>(0);
  const glRaf             = useRef<number>(0);

  /* ── WebGL animation ─────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let gl: WebGLRenderingContext | null;

    if (animType === "liquid") {
      gl = setupWebGL(canvas, LIQUID_VS, LIQUID_FS);
      if (!gl) return;
      const prog = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
      const uTime  = gl.getUniformLocation(prog, "u_time");
      const uRes   = gl.getUniformLocation(prog, "u_res");
      const uCol1  = gl.getUniformLocation(prog, "u_col1");
      const uCol2  = gl.getUniformLocation(prog, "u_col2");
      const uBg    = gl.getUniformLocation(prog, "u_bg");
      const start  = performance.now();
      const draw = () => {
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform1f(uTime,  (performance.now() - start) / 1000);
        gl!.uniform2f(uRes,   canvas.width, canvas.height);
        gl!.uniform3fv(uCol1, theme.webglCol1);
        gl!.uniform3fv(uCol2, theme.webglCol2);
        gl!.uniform3fv(uBg,   theme.webglBg);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        glRaf.current = requestAnimationFrame(draw);
      };
      draw();
    } else {
      gl = setupWebGL(canvas, FIRE_VS, FIRE_FS);
      if (!gl) return;
      const prog  = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
      const uTime  = gl.getUniformLocation(prog, "u_time");
      const uRes   = gl.getUniformLocation(prog, "u_res");
      const uFire1 = gl.getUniformLocation(prog, "u_fire1");
      const uFire2 = gl.getUniformLocation(prog, "u_fire2");
      const uFire3 = gl.getUniformLocation(prog, "u_fire3");
      const uBg    = gl.getUniformLocation(prog, "u_bg");
      const mid: Vec3 = [
        (theme.webglCol1[0] + theme.webglCol2[0]) * 0.5,
        (theme.webglCol1[1] + theme.webglCol2[1]) * 0.5,
        (theme.webglCol1[2] + theme.webglCol2[2]) * 0.5,
      ];
      const start = performance.now();
      const draw = () => {
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform1f(uTime,  (performance.now() - start) / 1000);
        gl!.uniform2f(uRes,   canvas.width, canvas.height);
        gl!.uniform3fv(uFire1, theme.webglCol1);
        gl!.uniform3fv(uFire2, mid);
        gl!.uniform3fv(uFire3, theme.webglCol2);
        gl!.uniform3fv(uBg,    theme.webglBg);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        glRaf.current = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(glRaf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [theme, animType]);

  /* ── Particle rain canvas ────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const [hueBase, hueRange] = theme.particleHue;
    const isDark = theme.name === "dark";

    const particles: {
      x: number; y: number; vy: number;
      opacity: number; size: number; hue: number;
    }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * window.innerHeight,
        vy:      0.3 + Math.random() * 0.7,
        opacity: 0.02 + Math.random() * 0.06,
        size:    0.8 + Math.random() * 1.4,
        hue:     hueBase + Math.random() * hueRange,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(200,200,200,${p.opacity})`
          : `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();
        p.y += p.vy;
        if (p.y > canvas.height) { p.y = -4; p.x = Math.random() * canvas.width; }
      });
      particleRaf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(particleRaf.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  /* ── Phase sequencing ────────────────────────────────────────────────── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("signature"), 400);
    const t2 = setTimeout(() => setPhase("name"),      2000);
    const t3 = setTimeout(() => setPhase("outro"),     4200);
    const t4 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 800);
    }, 5800);
    return () => { [t1, t2, t3, t4].forEach(clearTimeout); };
  }, [onDone]);

  /* ── Progress bar ────────────────────────────────────────────────────── */
  useEffect(() => {
    const milestones = [
      { at: 200,  val: 15  },
      { at: 800,  val: 40  },
      { at: 2200, val: 65  },
      { at: 3800, val: 82  },
      { at: 5000, val: 95  },
      { at: 5600, val: 100 },
    ];
    const timers = milestones.map(m => setTimeout(() => setProgress(m.val), m.at));
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Cycle loading lines ─────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setLineIdx(i => (i + 1) % LOADING_LINES.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: theme.bg,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* WebGL animation — bottom layer */}
          <canvas
            ref={glCanvasRef}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              opacity: 0.55,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Particle rain — above WebGL */}
          <canvas
            ref={particleCanvasRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
          />

          {/* Radial glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: theme.glow,
            pointerEvents: "none",
            zIndex: 2,
          }} />

          {/* Scan line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={phase !== "intro" ? { scaleX: 1, opacity: [0, 0.2, 0] } : {}}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "50%", left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${theme.scanColor}, transparent)`,
              transformOrigin: "left", pointerEvents: "none", zIndex: 3,
            }}
          />

           {/* Signature */}
          <AnimatePresence>
            {(phase === "signature" || phase === "name") && (
              <motion.div
                key="sig"
                initial={{ opacity: 0, x: 60, filter: "blur(16px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
                transition={{ duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
                style={{ position: "relative", zIndex: 10 }}
              >
                <img
                  src="/signature.png"
                  alt="MYSTICFUSION7X"
                  style={{
                    width: "min(480px, 72vw)", height: "auto",
                    filter: theme.filterStyle,
                    userSelect: "none", pointerEvents: "none", display: "block",
                  }}
                  draggable={false}
                />
                <div style={{
                  position: "absolute", bottom: -24, left: "5%", right: "5%", height: 40,
                  background: `radial-gradient(ellipse, ${theme.progressGlow.replace(/[\d.]+\)$/, "0.12)")} 0%, transparent 70%)`,
                  filter: "blur(10px)", pointerEvents: "none",
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + tagline */}
          <AnimatePresence>
            {phase === "name" && (
              <motion.div
                key="name"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                style={{ textAlign: "center", marginTop: 10, position: "relative", zIndex: 10 }}
              >
                <p style={{
                  fontSize: "0.6rem", letterSpacing: "0.3em",
                  textTransform: "uppercase", color: theme.taglineColor,
                  fontFamily: "var(--font-display, sans-serif)", fontWeight: 600,
                }}>
                  MYSTICFUSION7X · Roblox UI Design
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outro: cycling loading text */}
          <AnimatePresence>
            {phase === "outro" && (
              <motion.div
                key="outro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", bottom: "14%", textAlign: "center", zIndex: 10 }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={lineIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontSize: "0.65rem", letterSpacing: "0.18em",
                      textTransform: "uppercase", color: theme.lineColor,
                      fontFamily: "var(--font-display, sans-serif)",
                    }}
                  >
                    {LOADING_LINES[lineIdx]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: "rgba(255,255,255,0.04)", zIndex: 10,
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${theme.progressFrom}, ${theme.progressTo})`,
                boxShadow: `0 0 12px ${theme.progressGlow}`,
              }}
            />
          </div>

          {/* Corner decorations */}
          {[
            { top: 20,    left: 20,   borderTop: true,    borderLeft: true    },
            { top: 20,    right: 20,  borderTop: true,    borderRight: true   },
            { bottom: 20, left: 20,   borderBottom: true, borderLeft: true    },
            { bottom: 20, right: 20,  borderBottom: true, borderRight: true   },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: "absolute", width: 18, height: 18,
                borderColor: theme.cornerColor, borderStyle: "solid", borderWidth: 0,
                borderTopWidth:    (s as any).borderTop    ? 1 : 0,
                borderBottomWidth: (s as any).borderBottom ? 1 : 0,
                borderLeftWidth:   (s as any).borderLeft   ? 1 : 0,
                borderRightWidth:  (s as any).borderRight  ? 1 : 0,
                top: (s as any).top, bottom: (s as any).bottom,
                left: (s as any).left, right: (s as any).right,
                zIndex: 10,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
