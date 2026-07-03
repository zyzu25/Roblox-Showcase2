import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FS = `
  precision highp float;
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
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                  hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.78, 3.13);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.34;

    /* upward drift — fire rises */
    vec2 p = uv * vec2(1.8, 2.2);
    p.y -= t * 0.55;
    p.x += sin(uv.y * 3.0 + t * 0.4) * 0.08;

    float n1 = fbm(p + vec2(0.0, t * 0.3));
    float n2 = fbm(p * 1.4 + vec2(5.2, t * 0.22));
    float flame = fbm(p + 1.6 * vec2(n1, n2));

    /* flame shape — stronger at bottom, fades upward */
    float fade = 1.0 - uv.y * 1.15;
    fade = clamp(fade, 0.0, 1.0);
    flame *= fade * fade;

    /* gentle horizontal ember sway */
    float sway = sin(uv.y * 5.0 + t * 0.7) * 0.04 + 0.96;
    flame *= sway;
    flame = clamp(flame, 0.0, 1.0);

    /* color: bg -> fire3 -> fire2 -> fire1 (hottest) */
    vec3 col = u_bg;
    col = mix(col,   u_fire3, smoothstep(0.05, 0.30, flame));
    col = mix(col,   u_fire2, smoothstep(0.28, 0.58, flame));
    col = mix(col,   u_fire1, smoothstep(0.52, 0.88, flame));

    /* vignette */
    float vign = 1.0 - length((uv - 0.5) * 1.5);
    vign = clamp(vign, 0.0, 1.0);
    col *= 0.35 + 0.65 * vign;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

const FIRE_THEMES: Record<string, {
  bg: string; fire1: string; fire2: string; fire3: string;
  blobs: string[];
}> = {
  purple: {
    bg: "#000000",
    fire1: "#ff8cff", fire2: "#bb44ff", fire3: "#660099",
    blobs: ["rgba(200,80,255,0.60)", "rgba(160,30,220,0.45)", "rgba(120,10,180,0.35)", "rgba(220,100,255,0.28)", "rgba(90,5,140,0.22)"],
  },
  white: {
    bg: "#080808",
    fire1: "#ffffff", fire2: "#cccccc", fire3: "#666666",
    blobs: ["rgba(255,255,255,0.45)", "rgba(200,200,200,0.35)", "rgba(150,150,150,0.25)", "rgba(220,220,220,0.20)", "rgba(120,120,120,0.18)"],
  },
  light: {
    bg: "#020202",
    fire1: "#d6f0ff", fire2: "#7bc8e8", fire3: "#2a7ea0",
    blobs: ["rgba(130,200,235,0.55)", "rgba(90,170,210,0.42)", "rgba(160,220,245,0.32)", "rgba(60,140,185,0.26)", "rgba(190,230,248,0.20)"],
  },
  dark: {
    bg: "#020202",
    fire1: "#aaaaaa", fire2: "#666666", fire3: "#333333",
    blobs: ["rgba(100,95,95,0.70)", "rgba(75,72,72,0.55)", "rgba(120,116,116,0.42)", "rgba(55,52,52,0.34)", "rgba(140,134,134,0.28)"],
  },
  gold: {
    bg: "#080600",
    fire1: "#fff0a0", fire2: "#ffb300", fire3: "#8b5000",
    blobs: ["rgba(255,165,0,0.65)", "rgba(200,120,0,0.50)", "rgba(255,200,40,0.40)", "rgba(160,90,0,0.32)", "rgba(255,220,80,0.26)"],
  },
  red: {
    bg: "#080000",
    fire1: "#ffcc88", fire2: "#ff4400", fire3: "#880000",
    blobs: ["rgba(255,80,10,0.68)", "rgba(200,20,5,0.52)", "rgba(255,140,30,0.42)", "rgba(150,10,5,0.34)", "rgba(255,100,20,0.28)"],
  },
};

const BLOB_CONFIG = [
  { kf: "blobDrift1", delay: "0s",    dur: "16s", size: "65%", top: "15%",  left: "52%" },
  { kf: "blobDrift2", delay: "-6s",   dur: "20s", size: "58%", top: "60%",  left: "10%"  },
  { kf: "blobDrift3", delay: "-10s",  dur: "24s", size: "48%", top: "38%",  left: "38%" },
  { kf: "blobDrift4", delay: "-14s",  dur: "18s", size: "40%", top: "78%",  left: "65%" },
  { kf: "blobDrift5", delay: "-4s",   dur: "22s", size: "36%", top: "5%",   left: "15%" },
];

export function FireBackground() {
  const { theme } = useTheme();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glRef      = useRef<WebGLRenderingContext | null>(null);
  const progRef    = useRef<WebGLProgram | null>(null);
  const locsRef    = useRef<Record<string, WebGLUniformLocation | null>>({});
  const frameRef   = useRef<number>(0);
  const startRef   = useRef<number>(performance.now());
  const themeRef   = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    progRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uniformNames = ["u_time", "u_res", "u_fire1", "u_fire2", "u_fire3", "u_bg"];
    const locs: Record<string, WebGLUniformLocation | null> = {};
    uniformNames.forEach(n => { locs[n] = gl.getUniformLocation(prog, n); });
    locsRef.current = locs;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width  = Math.floor(window.innerWidth  * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const glo = glRef.current;
      if (!glo || !progRef.current) return;

      const t   = (performance.now() - startRef.current) / 1000;
      const cfg = FIRE_THEMES[themeRef.current] || FIRE_THEMES.purple;
      const lc  = locsRef.current;

      glo.uniform1f(lc.u_time, t);
      glo.uniform2f(lc.u_res, canvas.width, canvas.height);

      const setV3 = (loc: WebGLUniformLocation | null, hex: string) => {
        const [r, g, b] = hexToRgb(hex);
        glo.uniform3f(loc, r, g, b);
      };
      setV3(lc.u_bg,    cfg.bg);
      setV3(lc.u_fire1, cfg.fire1);
      setV3(lc.u_fire2, cfg.fire2);
      setV3(lc.u_fire3, cfg.fire3);

      glo.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
    };
  }, []);

  const cfg = FIRE_THEMES[theme] || FIRE_THEMES.purple;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: cfg.bg,
      }}
    >
      {BLOB_CONFIG.map((b, i) => (
        <div
          key={i}
          className="liquid-blob"
          style={{
            position: "absolute",
            width: b.size,
            paddingBottom: b.size,
            top: b.top,
            left: b.left,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${cfg.blobs[i]} 0%, transparent 70%)`,
            filter: "blur(70px)",
            animation: `${b.kf} ${b.dur} ${b.delay} ease-in-out infinite alternate`,
            willChange: "transform",
            transition: "background 1.2s ease",
          }}
        />
      ))}

      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      <svg
        width="100%" height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.018, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <filter id="grain-fire">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-fire)" />
      </svg>
    </div>
  );
}
