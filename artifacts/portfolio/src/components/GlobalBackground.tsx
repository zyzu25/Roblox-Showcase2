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
  uniform vec2  u_mouse;
  uniform vec3  u_col1;
  uniform vec3  u_col2;
  uniform vec3  u_col3;
  uniform vec3  u_col4;
  uniform vec3  u_col5;
  uniform vec3  u_bg;
  uniform float u_sat;
  uniform float u_bri;

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
    mat2 rot = mat2(0.8775, 0.4794, -0.4794, 0.8775);
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p  = rot * p * 2.1 + vec2(3.78, 5.13);
      a *= 0.5;
    }
    return v;
  }

  vec2 domainWarp(vec2 uv, float t) {
    vec2 q;
    q.x = fbm(uv * 1.2 + vec2(0.0,  t * 0.85));
    q.y = fbm(uv * 1.2 + vec2(5.2,  t * 0.73));
    vec2 r;
    r.x = fbm(uv * 2.2 + 1.8 * q + vec2(1.7,  9.2) + t * 0.17);
    r.y = fbm(uv * 2.2 + 1.8 * q + vec2(8.3,  2.8) + t * 0.14);
    return r;
  }

  float blob(vec2 uv, vec2 c, float r) {
    return smoothstep(r, r * 0.02, length(uv - c));
  }

  vec3 saturate_col(vec3 col, float amount) {
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    return clamp(mix(vec3(lum), col, amount), 0.0, 1.0);
  }

  vec3 sampleScene(vec2 uv, float t) {
    /* 5 large animated blobs that gently drift and cross-influence */
    vec2 c1 = vec2(0.72 + 0.12*sin(t*0.62),          0.28 + 0.11*cos(t*0.48));
    vec2 c2 = vec2(0.24 + 0.11*cos(t*0.55 + 1.1),    0.68 + 0.12*sin(t*0.41));
    vec2 c3 = vec2(0.50 + 0.14*sin(t*0.74 + 2.2),    0.44 + 0.10*cos(t*0.83));
    vec2 c4 = vec2(0.14 + 0.09*cos(t*0.47 + 0.7),    0.18 + 0.11*sin(t*0.68 + 1.4));
    vec2 c5 = vec2(0.87 + 0.07*sin(t*0.59 + 3.0),    0.79 + 0.09*cos(t*0.51 + 2.1));

    float f1 = blob(uv, c1, 0.44);
    float f2 = blob(uv, c2, 0.40);
    float f3 = blob(uv, c3, 0.34);
    float f4 = blob(uv, c4, 0.27);
    float f5 = blob(uv, c5, 0.24);

    vec3 col = u_bg;
    col = mix(col, u_col1, clamp(f1*f1, 0.0, 1.0));
    col = mix(col, u_col2, clamp(f2*f2, 0.0, 1.0));
    col = mix(col, mix(u_col1, u_col2, 0.5), clamp(f1*f2*3.0, 0.0, 0.6)); /* blend where they meet */
    col = mix(col, u_col3, clamp(f3*f3, 0.0, 1.0));
    col = mix(col, u_col4, clamp(f4*f4, 0.0, 1.0));
    col = mix(col, u_col5, clamp(f5*f5, 0.0, 1.0));
    return col;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.14;

    vec2 warp = domainWarp(uv, t);
    vec2 warpedUV = uv + 0.18 * warp;

    /* mouse repulsion — liquid pushes away from cursor */
    vec2 mouseUV = u_mouse / u_res;
    mouseUV.y = 1.0 - mouseUV.y;
    float md = length(warpedUV - mouseUV);
    warpedUV += (warpedUV - mouseUV) / max(md, 0.01) * 0.03 * smoothstep(0.38, 0.0, md);

    /* 9-tap blur (simulates blurPasses:8 from kawarp) */
    vec3 col = sampleScene(warpedUV, t);
    float blurR = 0.024;
    for (int i = 0; i < 8; i++) {
      float ang = float(i) * 0.7853981634;
      vec2 off = vec2(cos(ang), sin(ang)) * blurR;
      vec2 bUV = (uv + off) + 0.18 * domainWarp(uv + off, t);
      col += sampleScene(bUV, t);
    }
    col /= 9.0;

    col = saturate_col(col, u_sat);
    col *= u_bri;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

const THEMES: Record<string, {
  bg: string;
  c1: string; c2: string; c3: string; c4: string; c5: string;
  sat: number; bri: number;
  blobs: string[];
}> = {
  purple: {
    bg: "#000000",
    c1: "#8B00FF", c2: "#6600CC", c3: "#AA33FF", c4: "#4400BB", c5: "#CC66FF",
    sat: 2.5, bri: 0.65,
    blobs: [
      "rgba(100,0,255,0.72)", "rgba(70,0,200,0.60)", "rgba(130,0,255,0.42)",
      "rgba(50,0,180,0.35)",  "rgba(160,40,255,0.30)",
    ],
  },
  light: {
    bg: "#020202",
    c1: "#B2D5E5", c2: "#7AB8D4", c3: "#D6ECFA", c4: "#5FA3BE", c5: "#99C8DF",
    sat: 2.5, bri: 0.65,
    blobs: [
      "rgba(130,195,220,0.55)", "rgba(100,170,200,0.44)", "rgba(160,215,235,0.34)",
      "rgba(80,150,185,0.28)",  "rgba(190,225,240,0.24)",
    ],
  },
  dark: {
    bg: "#020202",
    c1: "#2a2828", c2: "#363333", c3: "#1f1d1d", c4: "#3f3c3c", c5: "#2c2a2a",
    sat: 1.0, bri: 0.65,
    blobs: [
      "rgba(55,52,52,0.85)", "rgba(42,40,40,0.70)", "rgba(65,62,62,0.55)",
      "rgba(35,33,33,0.45)", "rgba(72,68,68,0.38)",
    ],
  },
};

/* CSS blob positions & keyframe names for animated fallback */
const BLOB_CONFIG = [
  { kf: "blobDrift1", delay: "0s",    dur: "14s", size: "62%", top: "8%",  left: "52%" },
  { kf: "blobDrift2", delay: "-5s",   dur: "18s", size: "55%", top: "52%", left: "8%"  },
  { kf: "blobDrift3", delay: "-9s",   dur: "22s", size: "46%", top: "32%", left: "35%" },
  { kf: "blobDrift4", delay: "-13s",  dur: "16s", size: "38%", top: "72%", left: "62%" },
  { kf: "blobDrift5", delay: "-3s",   dur: "20s", size: "34%", top: "12%", left: "12%" },
];

export function GlobalBackground() {
  const { theme } = useTheme();
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glRef      = useRef<WebGLRenderingContext | null>(null);
  const progRef    = useRef<WebGLProgram | null>(null);
  const locsRef    = useRef<Record<string, WebGLUniformLocation | null>>({});
  const frameRef   = useRef<number>(0);
  const mouseRef   = useRef({ x: 0, y: 0 });
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
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader:", gl.getShaderInfoLog(s));
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

    const uniformNames = ["u_time","u_res","u_mouse","u_col1","u_col2","u_col3","u_col4","u_col5","u_bg","u_sat","u_bri"];
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

    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handleMouse);

    const render = () => {
      const glo = glRef.current;
      if (!glo || !progRef.current) return;

      const t   = (performance.now() - startRef.current) / 1000;
      const cfg = THEMES[themeRef.current] || THEMES.purple;
      const lc  = locsRef.current;

      glo.uniform1f(lc.u_time, t);
      glo.uniform2f(lc.u_res, canvas.width, canvas.height);
      glo.uniform2f(lc.u_mouse,
        mouseRef.current.x * (canvas.width  / window.innerWidth),
        mouseRef.current.y * (canvas.height / window.innerHeight),
      );

      const setV3 = (loc: WebGLUniformLocation | null, hex: string) => {
        const [r, g, b] = hexToRgb(hex);
        glo.uniform3f(loc, r, g, b);
      };
      setV3(lc.u_bg,   cfg.bg);
      setV3(lc.u_col1, cfg.c1);
      setV3(lc.u_col2, cfg.c2);
      setV3(lc.u_col3, cfg.c3);
      setV3(lc.u_col4, cfg.c4);
      setV3(lc.u_col5, cfg.c5);
      glo.uniform1f(lc.u_sat, cfg.sat);
      glo.uniform1f(lc.u_bri, cfg.bri);

      glo.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      gl.deleteProgram(prog);
    };
  }, []);

  const cfg = THEMES[theme] || THEMES.purple;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: theme === "dark" ? "#020202" : "#000000",
      }}
    >
      {/* CSS animated blobs — always visible, provide color even when WebGL unavailable */}
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
            filter: "blur(60px)",
            animation: `${b.kf} ${b.dur} ${b.delay} ease-in-out infinite alternate`,
            willChange: "transform",
            transition: "background 1.2s ease",
          }}
        />
      ))}

      {/* WebGL canvas — renders the full FBM domain-warp animation on top */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.40) 60%, rgba(0,0,0,0.80) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <svg
        width="100%" height="100%"
        style={{ position: "absolute", inset: 0, opacity: 0.022, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
