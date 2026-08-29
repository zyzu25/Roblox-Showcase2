import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import { useAnimation } from "./AnimationContext";

// ── Shared vertex shader ────────────────────────────────────────────────────
const VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ── Liquid (FBM domain-warp) fragment shader ────────────────────────────────
const FS_LIQUID = `
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
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v=0.0,a=0.5;
    mat2 rot=mat2(0.8775,0.4794,-0.4794,0.8775);
    for(int i=0;i<6;i++){v+=a*noise(p);p=rot*p*2.1+vec2(3.78,5.13);a*=0.5;}
    return v;
  }
  vec2 domainWarp(vec2 uv,float t){
    vec2 q;q.x=fbm(uv*1.2+vec2(0.0,t*0.85));q.y=fbm(uv*1.2+vec2(5.2,t*0.73));
    vec2 r;r.x=fbm(uv*2.2+1.8*q+vec2(1.7,9.2)+t*0.17);r.y=fbm(uv*2.2+1.8*q+vec2(8.3,2.8)+t*0.14);
    return r;
  }
  float blob(vec2 uv,vec2 c,float r){return smoothstep(r,r*0.02,length(uv-c));}
  vec3 sat_col(vec3 col,float a){float l=dot(col,vec3(0.2126,0.7152,0.0722));return clamp(mix(vec3(l),col,a),0.0,1.0);}
  vec3 sampleScene(vec2 uv,float t){
    vec2 c1=vec2(0.72+0.12*sin(t*0.62),0.28+0.11*cos(t*0.48));
    vec2 c2=vec2(0.24+0.11*cos(t*0.55+1.1),0.68+0.12*sin(t*0.41));
    vec2 c3=vec2(0.50+0.14*sin(t*0.74+2.2),0.44+0.10*cos(t*0.83));
    vec2 c4=vec2(0.14+0.09*cos(t*0.47+0.7),0.18+0.11*sin(t*0.68+1.4));
    vec2 c5=vec2(0.87+0.07*sin(t*0.59+3.0),0.79+0.09*cos(t*0.51+2.1));
    float f1=blob(uv,c1,0.44),f2=blob(uv,c2,0.40),f3=blob(uv,c3,0.34),f4=blob(uv,c4,0.27),f5=blob(uv,c5,0.24);
    vec3 col=u_bg;
    col=mix(col,u_col1,clamp(f1*f1,0.0,1.0));col=mix(col,u_col2,clamp(f2*f2,0.0,1.0));
    col=mix(col,mix(u_col1,u_col2,0.5),clamp(f1*f2*3.0,0.0,0.6));
    col=mix(col,u_col3,clamp(f3*f3,0.0,1.0));col=mix(col,u_col4,clamp(f4*f4,0.0,1.0));col=mix(col,u_col5,clamp(f5*f5,0.0,1.0));
    return col;
  }
  void main(){
    vec2 uv=gl_FragCoord.xy/u_res;
    float t=u_time*0.14;
    vec2 warp=domainWarp(uv,t);
    vec2 warpedUV=uv+0.18*warp;
    vec2 mouseUV=u_mouse/u_res;mouseUV.y=1.0-mouseUV.y;
    float md=length(warpedUV-mouseUV);
    warpedUV+=(warpedUV-mouseUV)/max(md,0.01)*0.03*smoothstep(0.38,0.0,md);
    vec3 col=sampleScene(warpedUV,t);
    float blurR=0.024;
    for(int i=0;i<8;i++){
      float ang=float(i)*0.7853981634;
      vec2 off=vec2(cos(ang),sin(ang))*blurR;
      vec2 bUV=(uv+off)+0.18*domainWarp(uv+off,t);
      col+=sampleScene(bUV,t);
    }
    col/=9.0;
    col=sat_col(col,u_sat);col*=u_bri;
    gl_FragColor=vec4(col,1.0);
  }
`;

// ── Fire (calming flame) fragment shader ────────────────────────────────────
const FS_FIRE = `
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

  float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float noise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(3.78,5.13);a*=0.5;}
    return v;
  }
  vec3 sat_col(vec3 col,float a){float l=dot(col,vec3(0.2126,0.7152,0.0722));return clamp(mix(vec3(l),col,a),0.0,1.0);}

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.22; // slow = calming

    // Three layered flame columns drifting upward
    vec2 fuv  = vec2(uv.x * 1.8 - 0.4, (1.0 - uv.y) * 2.6);
    float n1  = fbm(fuv + vec2(0.0, -t));
    float n2  = fbm(fuv * 1.6 + vec2(0.9, -t * 0.85));
    float n3  = fbm(fuv * 0.8 + vec2(-0.6, -t * 1.1));
    float fire = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Edge + height shape
    float edgeFade   = smoothstep(0.0, 0.28, uv.x) * smoothstep(1.0, 0.72, uv.x);
    float heightFade  = pow(max(1.0 - uv.y, 0.0), 0.75);
    fire *= edgeFade * heightFade * 2.4;
    fire  = clamp(fire, 0.0, 1.0);

    // Gentle secondary bloom at top-center
    vec2 bloom = vec2(uv.x - 0.5, uv.y - 0.75);
    float b = exp(-dot(bloom, bloom) * 10.0) * 0.18;
    fire = clamp(fire + b, 0.0, 1.0);

    // Color gradient: bg -> col2 -> col1 -> bright peak
    vec3 col = u_bg;
    col = mix(col, u_col3 * 0.4,                         smoothstep(0.00, 0.22, fire));
    col = mix(col, u_col2,                               smoothstep(0.18, 0.50, fire));
    col = mix(col, u_col1,                               smoothstep(0.42, 0.72, fire));
    col = mix(col, mix(u_col1, vec3(1.0), 0.45),         smoothstep(0.65, 1.00, fire));

    col = sat_col(col, u_sat * 0.85);
    col *= u_bri * 0.92;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── Theme colour palettes ───────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

const THEMES: Record<"purple" | "black" | "white" | "red", {
  bg: string; c1: string; c2: string; c3: string; c4: string; c5: string;
  sat: number; bri: number; blobs: string[];
}> = {
  purple: {
    bg: "#0b0120",
    c1: "#d900ff", c2: "#442cff", c3: "#a315e8", c4: "#19046b", c5: "#6f24d9",
    sat: 1.55, bri: 0.70,
    blobs: ["rgba(224,0,255,0.34)","rgba(68,44,255,0.29)","rgba(190,20,240,0.18)","rgba(35,7,130,0.22)","rgba(114,35,220,0.16)"],
  },
  black: {
    bg: "#050505",
    c1: "#4d4d4d", c2: "#252525", c3: "#686868", c4: "#181818", c5: "#858585",
    sat: 0.2, bri: 0.72,
    blobs: ["rgba(255,255,255,0.10)","rgba(150,150,150,0.08)","rgba(255,255,255,0.05)","rgba(100,100,100,0.06)","rgba(255,255,255,0.04)"],
  },
  red: {
    bg: "#090303",
    c1: "#a10f16", c2: "#4c070b", c3: "#d1272f", c4: "#270305", c5: "#7d0b12",
    sat: 1.7, bri: 0.62,
    blobs: ["rgba(205,26,35,0.30)","rgba(130,10,18,0.24)","rgba(255,40,48,0.16)","rgba(90,5,12,0.20)","rgba(170,15,24,0.13)"],
  },
  white: {
    bg: "#f4f3f1",
    c1: "#e1e0de", c2: "#d1d0ce", c3: "#fdfcf9", c4: "#c4c3c1", c5: "#ebeae8",
    sat: 0.15, bri: 1.0,
    blobs: ["rgba(40,40,40,0.07)","rgba(120,120,120,0.06)","rgba(255,255,255,0.58)","rgba(70,70,70,0.045)","rgba(230,230,230,0.32)"],
  },
};

const BG_BASE: Record<string, string> = {
  purple: "#0b0120", black: "#050505", red: "#090303", white: "#f4f3f1",
};

const BLOB_CONFIG = [
  { kf: "blobDrift1", delay: "0s",   dur: "14s", size: "62%", top: "8%",  left: "52%" },
  { kf: "blobDrift2", delay: "-5s",  dur: "18s", size: "55%", top: "52%", left: "8%"  },
  { kf: "blobDrift3", delay: "-9s",  dur: "22s", size: "46%", top: "32%", left: "35%" },
  { kf: "blobDrift4", delay: "-13s", dur: "16s", size: "38%", top: "72%", left: "62%" },
  { kf: "blobDrift5", delay: "-3s",  dur: "20s", size: "34%", top: "12%", left: "12%" },
];

export function GlobalBackground() {
  const { theme } = useTheme();
  const { animation } = useAnimation();
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const glRef       = useRef<WebGLRenderingContext | null>(null);
  const liquidProg  = useRef<WebGLProgram | null>(null);
  const fireProg    = useRef<WebGLProgram | null>(null);
  const locsLiquid  = useRef<Record<string, WebGLUniformLocation | null>>({});
  const locsFire    = useRef<Record<string, WebGLUniformLocation | null>>({});
  const frameRef    = useRef<number>(0);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const startRef    = useRef<number>(performance.now());
  const themeRef    = useRef(theme);
  const animRef     = useRef(animation);

  useEffect(() => { themeRef.current = theme; }, [theme]);
  useEffect(() => { animRef.current = animation; }, [animation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader:", gl.getShaderInfoLog(s));
      return s;
    };

    const buildProg = (fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VS));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      return p;
    };

    // Compile both programs upfront — switch is instant at runtime
    liquidProg.current = buildProg(FS_LIQUID);
    fireProg.current   = buildProg(FS_FIRE);

    const uniforms = ["u_time","u_res","u_mouse","u_col1","u_col2","u_col3","u_col4","u_col5","u_bg","u_sat","u_bri"];
    const getLocs = (p: WebGLProgram) => {
      const m: Record<string, WebGLUniformLocation | null> = {};
      uniforms.forEach(n => { m[n] = gl.getUniformLocation(p, n); });
      return m;
    };
    locsLiquid.current = getLocs(liquidProg.current);
    locsFire.current   = getLocs(fireProg.current);

    // Shared fullscreen quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    const bindBuf = (prog: WebGLProgram) => {
      gl.useProgram(prog);
      const pos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    };
    bindBuf(liquidProg.current);
    bindBuf(fireProg.current);

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
    window.addEventListener("mousemove", (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; });

    const render = () => {
      const glo = glRef.current; if (!glo) return;
      // Fire was part of the old background picker. Keep the shader branch
      // harmlessly dormant so existing compiled shader code remains stable.
      const isFire = false;
      const prog = isFire ? fireProg.current : liquidProg.current;
      const lc   = isFire ? locsFire.current : locsLiquid.current;
      if (!prog) return;
      glo.useProgram(prog);

      const t   = (performance.now() - startRef.current) / 1000;
      const cfg = THEMES[themeRef.current] || THEMES.black;
      const setV3 = (loc: WebGLUniformLocation | null, hex: string) => {
        const [r, g, b] = hexToRgb(hex);
        glo.uniform3f(loc, r, g, b);
      };
      glo.uniform1f(lc.u_time, t);
      glo.uniform2f(lc.u_res, canvas.width, canvas.height);
      glo.uniform2f(lc.u_mouse,
        mouseRef.current.x * (canvas.width / window.innerWidth),
        mouseRef.current.y * (canvas.height / window.innerHeight),
      );
      setV3(lc.u_bg, cfg.bg); setV3(lc.u_col1, cfg.c1); setV3(lc.u_col2, cfg.c2);
      setV3(lc.u_col3, cfg.c3); setV3(lc.u_col4, cfg.c4); setV3(lc.u_col5, cfg.c5);
      glo.uniform1f(lc.u_sat, cfg.sat);
      glo.uniform1f(lc.u_bri, cfg.bri);
      glo.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      if (liquidProg.current) gl.deleteProgram(liquidProg.current);
      if (fireProg.current)   gl.deleteProgram(fireProg.current);
    };
  }, []);

  const cfg = THEMES[theme] || THEMES.black;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: 0, pointerEvents: "none", overflow: "hidden",
      background: BG_BASE[theme] ?? "#000000",
    }}>
      {/* CSS blobs — color fallback */}
      {BLOB_CONFIG.map((b, i) => (
        <div key={i} className="liquid-blob" style={{
          position: "absolute", width: b.size, paddingBottom: b.size,
          top: b.top, left: b.left, transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${cfg.blobs[i]} 0%, transparent 70%)`,
          filter: "blur(60px)",
          animation: `${b.kf} ${b.dur} ${b.delay} ease-in-out infinite alternate`,
          willChange: "transform", transition: "background 1.2s ease",
        }} />
      ))}

      {/* WebGL canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.40) 60%, rgba(0,0,0,0.80) 100%)",
        pointerEvents: "none",
      }} />

      {/* Film grain */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.022, pointerEvents: "none" }} aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
