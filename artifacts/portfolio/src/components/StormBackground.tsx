import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const VS = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;

const FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_rain;
  uniform vec3  u_mist;
  uniform vec3  u_bg;
  uniform float u_ar;

  float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float hash1(float v){return fract(sin(v*412.13)*7832.1);}

  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,3.1);a*=0.5;}return v;}

  /* ── One layer of rain streaks ── */
  float rainLayer(vec2 uv, float t, float cols, float speed, float tilt, float seed){
    /* tilt rain slightly */
    vec2 p = uv;
    p.x += tilt * (1.0 - uv.y);

    /* cell grid */
    float ar = u_res.x / u_res.y;
    p.x *= cols * ar;
    p.y *= cols;
    p.y -= t * speed;

    vec2 cell = floor(p);
    vec2 fr   = fract(p);

    /* per-column random: enable/disable + vertical offset */
    float colRnd  = hash(cell + vec2(seed, 0.0));
    float dropRnd = hash(cell + vec2(seed, 1.0));

    /* skip ~55% of columns */
    if(colRnd < 0.55) return 0.0;

    /* drop occupies a fraction of the cell height */
    float headLen = 0.08;
    float tailLen = mix(0.25, 0.55, dropRnd);
    float yOff    = fract(dropRnd * 3.7);
    float y       = fract(fr.y + yOff);

    float drop = smoothstep(headLen + tailLen, headLen, y)
               * smoothstep(0.0, headLen, y);
    drop = pow(drop, 1.4);

    /* thin horizontal profile */
    float xStr = pow(max(0.0, 1.0 - abs(fr.x - 0.5) * 18.0), 1.8);

    return xStr * drop * (colRnd - 0.55) / 0.45;
  }

  /* ── Very subtle lightning bloom ── */
  float lightning(float t){
    /* slow, rare trigger */
    float base = sin(t * 0.31 + 1.7) * sin(t * 0.19 + 4.2) * sin(t * 0.07 + 0.5);
    float flash = smoothstep(0.90, 1.00, base);
    /* secondary flicker */
    float flicker = step(0.5, sin(t * 28.0)) * step(0.5, sin(t * 43.0 + 1.1));
    return flash * flicker * 0.12;
  }

  void main(){
    vec2 uv  = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.5;          /* slow time for calm feel */

    /* ── Atmospheric background mist / cloud swirl ── */
    float cloudT = u_time * 0.018;
    vec2  cp     = uv * 2.0 + vec2(-cloudT, cloudT * 0.4);
    float cloud  = fbm(cp);
    cloud = smoothstep(0.32, 0.70, cloud) * 0.30;

    /* ── Three rain layers (depth parallax) ── */
    /* far: sparse, slow */
    float r1 = rainLayer(uv, t, 28.0, 1.10, -0.045, 0.0) * 0.22;
    /* mid: medium */
    float r2 = rainLayer(uv, t, 18.0, 1.60, -0.065, 17.3) * 0.38;
    /* near: denser, faster, brighter */
    float r3 = rainLayer(uv, t, 11.0, 2.20, -0.090, 34.7) * 0.55;

    float rain = clamp(r1 + r2 + r3, 0.0, 1.0);

    /* ── Puddle ripple shimmer at bottom ── */
    float rippleY  = clamp((0.15 - uv.y) / 0.15, 0.0, 1.0); /* bottom 15% */
    float rippleX  = uv.x + noise(vec2(uv.x * 12.0, u_time * 0.4)) * 0.04;
    float ripple   = noise(vec2(rippleX * 18.0, u_time * 0.9)) * rippleY * 0.18;

    /* ── Lightning ── */
    float flash = lightning(u_time);

    /* ── Compose ── */
    vec3 col = u_bg;

    /* cloud mist layer */
    col = mix(col, u_mist, cloud);

    /* rain streaks */
    col += u_rain * rain;

    /* puddle shimmer */
    col += u_mist * ripple;

    /* lightning flash (uniform white tint) */
    col += vec3(0.6, 0.65, 0.7) * flash;

    /* soft vignette — slightly lighter at centre for cinematic feel */
    float vign = clamp(1.0 - length((uv - 0.5) * 1.45), 0.0, 1.0);
    col *= 0.30 + 0.70 * vign;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

type Vec3 = [number,number,number];

const THEMES: Record<string,{rain:Vec3;mist:Vec3;bg:Vec3}> = {
  purple:{ rain:[0.38,0.28,0.72], mist:[0.14,0.10,0.30], bg:[0.010,0.006,0.028] },
  white: { rain:[0.55,0.58,0.68], mist:[0.22,0.24,0.30], bg:[0.012,0.012,0.022] },
  light: { rain:[0.28,0.52,0.72], mist:[0.10,0.24,0.38], bg:[0.006,0.014,0.036] },
  dark:  { rain:[0.28,0.30,0.34], mist:[0.12,0.13,0.16], bg:[0.008,0.008,0.012] },
  gold:  { rain:[0.45,0.36,0.14], mist:[0.22,0.16,0.05], bg:[0.018,0.013,0.003] },
  red:   { rain:[0.42,0.14,0.18], mist:[0.18,0.06,0.08], bg:[0.018,0.004,0.006] },
  calm:  { rain:[0.30,0.44,0.62], mist:[0.12,0.22,0.34], bg:[0.008,0.014,0.026] },
};

function initGL(canvas:HTMLCanvasElement){
  const gl=canvas.getContext("webgl");if(!gl)return null;
  const mk=(t:number,s:string)=>{const sh=gl.createShader(t)!;gl.shaderSource(sh,s);gl.compileShader(sh);return sh;};
  const prog=gl.createProgram()!;
  gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS));
  gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(prog);gl.useProgram(prog);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,"a_pos");
  gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  return{gl,prog};
}

export function StormBackground(){
  const{theme}=useTheme();
  const ref=useRef<HTMLCanvasElement>(null);
  const raf=useRef(0);

  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    const ctx=initGL(cv);
    if(!ctx){window.removeEventListener("resize",resize);return;}
    const{gl,prog}=ctx;
    const uTime=gl.getUniformLocation(prog,"u_time");
    const uRes =gl.getUniformLocation(prog,"u_res");
    const uRain=gl.getUniformLocation(prog,"u_rain");
    const uMist=gl.getUniformLocation(prog,"u_mist");
    const uBg  =gl.getUniformLocation(prog,"u_bg");
    const uAr  =gl.getUniformLocation(prog,"u_ar");
    const pal=THEMES[theme]??THEMES.calm;
    const start=performance.now();
    const draw=()=>{
      const elapsed=(performance.now()-start)/1000;
      gl.viewport(0,0,cv.width,cv.height);
      gl.uniform1f(uTime,elapsed);
      gl.uniform2f(uRes,cv.width,cv.height);
      gl.uniform3fv(uRain,pal.rain);
      gl.uniform3fv(uMist,pal.mist);
      gl.uniform3fv(uBg,  pal.bg);
      gl.uniform1f(uAr,  cv.width/cv.height);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[theme]);

  return(
    <canvas
      ref={ref}
      style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,display:"block",pointerEvents:"none"}}
    />
  );
}
