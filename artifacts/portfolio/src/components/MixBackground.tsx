import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   All 6 theme palettes – RGB 0-255 + alpha scalars for the glow/border vars
───────────────────────────────────────────────────────────────────────────── */
type Pal = {
  p:   [number,number,number]; // --c-primary
  p2:  [number,number,number]; // --c-primary-2
  pd:  [number,number,number]; // --c-primary-dark
  bg:  [number,number,number]; // --c-bg (very dark tint)
  ga: number; gsa: number; tga: number; ba: number; bsa: number; // alpha vals
  orbs: [[number,number,number],[number,number,number],[number,number,number],[number,number,number],[number,number,number]];
};

const PALETTES: Pal[] = [
  // purple
  { p:[139,61,255], p2:[168,85,247], pd:[107,33,255], bg:[4,1,12],
    ga:0.50, gsa:0.20, tga:0.70, ba:0.35, bsa:0.18,
    orbs:[[100,20,200],[80,10,160],[90,15,180],[70,8,140],[110,25,220]] },
  // white/silver
  { p:[212,212,212], p2:[240,240,240], pd:[168,168,168], bg:[8,8,8],
    ga:0.40, gsa:0.16, tga:0.55, ba:0.25, bsa:0.12,
    orbs:[[180,180,190],[160,160,170],[200,200,210],[140,140,150],[190,190,200]] },
  // light/ice-blue
  { p:[178,213,229], p2:[200,228,240], pd:[141,191,214], bg:[2,6,10],
    ga:0.45, gsa:0.18, tga:0.60, ba:0.30, bsa:0.15,
    orbs:[[178,213,229],[141,191,214],[209,234,244],[106,170,191],[160,204,223]] },
  // dark/noir
  { p:[136,136,136], p2:[170,170,170], pd:[102,102,102], bg:[2,2,2],
    ga:0.30, gsa:0.12, tga:0.50, ba:0.12, bsa:0.06,
    orbs:[[80,80,85],[65,65,70],[95,95,100],[55,55,60],[75,75,80]] },
  // gold/amber
  { p:[200,169,74], p2:[229,193,87], pd:[156,123,30], bg:[8,6,0],
    ga:0.55, gsa:0.22, tga:0.65, ba:0.28, bsa:0.13,
    orbs:[[180,130,30],[140,100,20],[220,170,60],[120,90,15],[160,120,25]] },
  // red/crimson
  { p:[204,26,26], p2:[229,34,34], pd:[153,16,16], bg:[8,0,0],
    ga:0.55, gsa:0.22, tga:0.65, ba:0.28, bsa:0.13,
    orbs:[[140,14,14],[100,8,8],[170,18,18],[80,5,5],[120,10,10]] },
];

const PERIOD_MS = 54000; // 54 s full loop (9 s per theme transition)

/* ── helpers ── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpRGB(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [Math.round(lerp(a[0],b[0],t)), Math.round(lerp(a[1],b[1],t)), Math.round(lerp(a[2],b[2],t))];
}
function smooth(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); } // perlin smootherstep
function toHex([r,g,b]: [number,number,number]) {
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function toRgba([r,g,b]: [number,number,number], a: number) { return `rgba(${r},${g},${b},${a.toFixed(2)})`; }

function getBlend(elapsed: number) {
  const n = PALETTES.length;
  const t = (elapsed % PERIOD_MS) / PERIOD_MS;
  const segLen = 1 / n;
  const segIdx = Math.floor(t / segLen) % n;
  const segT = smooth((t - segIdx * segLen) / segLen);
  const A = PALETTES[segIdx];
  const B = PALETTES[(segIdx + 1) % n];
  return {
    p:  lerpRGB(A.p,  B.p,  segT),
    p2: lerpRGB(A.p2, B.p2, segT),
    pd: lerpRGB(A.pd, B.pd, segT),
    bg: lerpRGB(A.bg, B.bg, segT),
    ga:  lerp(A.ga,  B.ga,  segT),
    gsa: lerp(A.gsa, B.gsa, segT),
    tga: lerp(A.tga, B.tga, segT),
    ba:  lerp(A.ba,  B.ba,  segT),
    bsa: lerp(A.bsa, B.bsa, segT),
    orbs: A.orbs.map((o, i) => lerpRGB(o, B.orbs[i], segT)) as Pal["orbs"],
  };
}

function applyCSSVars(c: ReturnType<typeof getBlend>) {
  const s = document.documentElement.style;
  s.setProperty("--c-primary",      toHex(c.p));
  s.setProperty("--c-primary-2",    toHex(c.p2));
  s.setProperty("--c-primary-dark", toHex(c.pd));
  s.setProperty("--c-glow",         toRgba(c.p, c.ga));
  s.setProperty("--c-glow-soft",    toRgba(c.p, c.gsa));
  s.setProperty("--c-text-glow",    toRgba(c.p, c.tga));
  s.setProperty("--c-border",       toRgba(c.p, c.ba));
  s.setProperty("--c-border-soft",  toRgba(c.p, c.bsa));
  const names = ["-r", "-g", "-b"];
  const pfx = ["--c-orb", "--c-orb2", "--c-orb3", "--c-orb4", "--c-orb5"];
  c.orbs.forEach((orb, i) => {
    const base = pfx[i];
    s.setProperty(base + names[0], String(orb[0]));
    s.setProperty(base + names[1], String(orb[1]));
    s.setProperty(base + names[2], String(orb[2]));
  });
}

function removeCSSVars() {
  const s = document.documentElement.style;
  [
    "--c-primary","--c-primary-2","--c-primary-dark",
    "--c-glow","--c-glow-soft","--c-text-glow","--c-border","--c-border-soft",
    "--c-orb-r","--c-orb-g","--c-orb-b",
    "--c-orb2-r","--c-orb2-g","--c-orb2-b",
    "--c-orb3-r","--c-orb3-g","--c-orb3-b",
    "--c-orb4-r","--c-orb4-g","--c-orb4-b",
    "--c-orb5-r","--c-orb5-g","--c-orb5-b",
  ].forEach(v => s.removeProperty(v));
}

/* ─────────────────────────────────────────────────────────────────────────────
   Combined liquid + fire WebGL shader
───────────────────────────────────────────────────────────────────────────── */
const VS = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FS = `
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
    vec2 i=floor(p); vec2 f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),
               mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(1.78,3.13);a*=0.5;}
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t = u_time * 0.09;

    /* ── Liquid domain warp (primary layer) ── */
    vec2 q = vec2(fbm(uv*1.2 + vec2(0.0,  t*0.80)),
                  fbm(uv*1.2 + vec2(5.2,  t*0.70)));
    vec2 r = vec2(fbm(uv*2.1 + 1.7*q + vec2(1.7, 9.2) + t*0.15),
                  fbm(uv*2.1 + 1.7*q + vec2(8.3, 2.8) + t*0.13));
    float liquid = fbm(uv*2.8 + 1.5*r + t*0.08);

    /* ── Gentle fire drift (secondary, bottom-heavy) ── */
    vec2 fp = uv * vec2(1.5, 2.0);
    fp.y -= t * 0.40;
    fp.x += sin(uv.y * 2.5 + t * 0.3) * 0.06;
    float fn1 = fbm(fp + vec2(0.0, t*0.22));
    float fn2 = fbm(fp*1.3 + vec2(5.2, t*0.17));
    float fire = fbm(fp + 1.3*vec2(fn1, fn2));
    float fireFade = clamp(1.0 - uv.y * 1.05, 0.0, 1.0);
    fire *= fireFade * 0.55;

    /* ── Blend (liquid dominant) ── */
    float f = liquid * 0.72 + fire * 0.28;
    f = clamp(f, 0.0, 1.0);

    vec3 col = u_bg;
    col = mix(col,   u_col2, smoothstep(0.22, 0.55, f));
    col = mix(col,   u_col1, smoothstep(0.48, 0.82, f));

    /* ── Vignette ── */
    float vign = clamp(1.0 - length((uv - 0.5) * 1.55), 0.0, 1.0);
    col *= 0.28 + 0.72 * vign;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl");
  if (!gl) return null;

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

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  return {
    gl,
    uTime:  gl.getUniformLocation(prog, "u_time"),
    uRes:   gl.getUniformLocation(prog, "u_res"),
    uCol1:  gl.getUniformLocation(prog, "u_col1"),
    uCol2:  gl.getUniformLocation(prog, "u_col2"),
    uBg:    gl.getUniformLocation(prog, "u_bg"),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
export function MixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = initGL(canvas);
    if (!ctx) { window.removeEventListener("resize", resize); return; }
    const { gl, uTime, uRes, uCol1, uCol2, uBg } = ctx;

    const start = performance.now();

    const draw = () => {
      const elapsed = performance.now() - start;
      const blend = getBlend(elapsed);

      /* ── Update CSS variables (text / borders / glows) ── */
      applyCSSVars(blend);

      /* ── Update WebGL uniforms ── */
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed / 1000);
      gl.uniform2f(uRes,  canvas.width, canvas.height);
      gl.uniform3f(uCol1, blend.p[0]/255, blend.p[1]/255, blend.p[2]/255);
      gl.uniform3f(uCol2, blend.pd[0]/255, blend.pd[1]/255, blend.pd[2]/255);
      gl.uniform3f(uBg,   blend.bg[0]/255, blend.bg[1]/255, blend.bg[2]/255);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      removeCSSVars();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        zIndex: 0, display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
