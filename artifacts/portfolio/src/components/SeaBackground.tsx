import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const VS = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;

const FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_surf;
  uniform vec3  u_deep;
  uniform vec3  u_bg;

  float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.1+vec2(1.78,3.13);a*=0.5;}return v;}

  void main(){
    vec2 uv=gl_FragCoord.xy/u_res;
    float t=u_time*0.11;

    /* layered sine waves — primary long swells */
    float w1=sin(uv.x*3.2+t*0.90+sin(uv.y*1.1+t*0.35)*0.28)*0.5+0.5;
    float w2=sin(uv.x*6.1-t*0.72+uv.y*1.9)*0.5+0.5;
    float w3=sin(uv.x*10.5+t*1.20-uv.y*0.4)*0.5+0.5;
    float w4=sin(uv.x*17.0-t*0.55+sin(uv.x*2.0+t*0.6)*0.4)*0.5+0.5;
    float waves=w1*0.48+w2*0.28+w3*0.14+w4*0.10;

    /* FBM turbulence for surface texture */
    vec2 warp=uv*vec2(2.8,2.0)+vec2(t*0.18,t*0.08);
    warp.x+=sin(uv.y*3.0+t*0.4)*0.07;
    float surf=fbm(warp);

    float combined=waves*0.60+surf*0.40;
    combined=clamp(combined,0.,1.);

    /* caustic shimmer */
    float caus=fbm(uv*7.0+vec2(t*0.55,t*0.38))*fbm(uv*5.0-vec2(t*0.42,t*0.62));
    caus=smoothstep(0.3,0.7,caus)*0.12*(1.-uv.y*0.7);

    /* foam crests */
    float foam=smoothstep(0.82,0.96,combined)*0.22*(1.-uv.y*0.6);

    /* depth darkening toward bottom */
    float depth=uv.y;

    vec3 col=u_bg;
    col=mix(col,u_deep,smoothstep(0.18,0.52,combined)*(1.-depth*0.35));
    col=mix(col,u_surf,smoothstep(0.48,0.80,combined)*(1.-depth*0.25));
    col+=u_surf*caus;
    col=mix(col,vec3(0.80,0.92,1.0),foam);

    /* gentle depth shadow */
    col*=mix(0.72,1.0,1.-depth*0.5);

    /* vignette */
    float vign=clamp(1.-length((uv-0.5)*1.45),0.,1.);
    col*=0.28+0.72*vign;

    gl_FragColor=vec4(col,1.);
  }
`;

type Vec3=[number,number,number];
const THEMES: Record<string,{surf:Vec3;deep:Vec3;bg:Vec3}> = {
  purple:{ surf:[0.42,0.18,0.80], deep:[0.22,0.08,0.50], bg:[0.010,0.005,0.030] },
  white: { surf:[0.60,0.68,0.80], deep:[0.32,0.38,0.50], bg:[0.015,0.015,0.025] },
  light: { surf:[0.40,0.72,0.90], deep:[0.12,0.40,0.62], bg:[0.005,0.018,0.040] },
  dark:  { surf:[0.30,0.32,0.38], deep:[0.12,0.14,0.18], bg:[0.008,0.008,0.012] },
  gold:  { surf:[0.55,0.42,0.10], deep:[0.28,0.20,0.04], bg:[0.020,0.014,0.000] },
  red:   { surf:[0.55,0.10,0.18], deep:[0.28,0.04,0.08], bg:[0.020,0.002,0.005] },
};

function initGL(canvas: HTMLCanvasElement){
  const gl=canvas.getContext("webgl"); if(!gl)return null;
  const mk=(t:number,s:string)=>{const sh=gl.createShader(t)!;gl.shaderSource(sh,s);gl.compileShader(sh);return sh;};
  const p=gl.createProgram()!;
  gl.attachShader(p,mk(gl.VERTEX_SHADER,VS));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);gl.useProgram(p);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const l=gl.getAttribLocation(p,"a_pos");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
  return{gl,p};
}

export function SeaBackground(){
  const {theme}=useTheme();
  const ref=useRef<HTMLCanvasElement>(null);
  const raf=useRef(0);

  useEffect(()=>{
    const cv=ref.current; if(!cv)return;
    const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    const ctx=initGL(cv); if(!ctx){window.removeEventListener("resize",resize);return;}
    const{gl,p}=ctx;
    const uTime=gl.getUniformLocation(p,"u_time");
    const uRes =gl.getUniformLocation(p,"u_res");
    const uSurf=gl.getUniformLocation(p,"u_surf");
    const uDeep=gl.getUniformLocation(p,"u_deep");
    const uBg  =gl.getUniformLocation(p,"u_bg");
    const pal=THEMES[theme]??THEMES.purple;
    const start=performance.now();
    const draw=()=>{
      gl.viewport(0,0,cv.width,cv.height);
      gl.uniform1f(uTime,(performance.now()-start)/1000);
      gl.uniform2f(uRes,cv.width,cv.height);
      gl.uniform3fv(uSurf,pal.surf);
      gl.uniform3fv(uDeep,pal.deep);
      gl.uniform3fv(uBg,  pal.bg);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[theme]);

  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,display:"block",pointerEvents:"none"}}/>;
}
