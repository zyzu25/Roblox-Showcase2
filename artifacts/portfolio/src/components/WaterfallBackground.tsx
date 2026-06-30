import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const VS = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;

const FS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec3  u_flow;
  uniform vec3  u_mist;
  uniform vec3  u_bg;

  float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.,a=0.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(1.78,3.13);a*=0.5;}return v;}

  void main(){
    vec2 uv=gl_FragCoord.xy/u_res;
    float t=u_time*0.09;

    /* downward flowing water — FBM drift */
    vec2 p=uv*vec2(2.0,3.2);
    p.y+=t*1.1;
    p.x+=sin(uv.y*3.5+t*0.45)*0.07+fbm(p*0.35+vec2(0.,t*0.08))*0.09;
    float n1=fbm(p);
    float n2=fbm(p*1.4+vec2(4.1,t*0.35));
    float flow=fbm(p+1.2*vec2(n1,n2));
    flow=clamp(flow,0.,1.);

    /* vertical shimmer streaks */
    float streak=pow(sin(uv.x*20.0+fbm(uv*2.5+vec2(0.,t*0.7))*2.5)*0.5+0.5,4.0)*0.18;
    streak*=smoothstep(0.25,0.65,flow);

    /* mist at bottom */
    float mistFade=clamp(uv.y*2.2-1.1,0.,1.);
    mistFade*=mistFade;
    float mistNoise=fbm(uv*3.5+vec2(t*0.25,t*-0.15));
    float mist=mistFade*mistNoise*0.45;

    /* top-of-fall brightness (near top) */
    float topFade=clamp(1.-uv.y*2.0,0.,1.);
    float topGlow=topFade*fbm(uv*4.0+vec2(t*0.3,0.))*0.15;

    vec3 col=u_bg;
    col=mix(col,u_mist, smoothstep(0.18,0.50,flow));
    col=mix(col,u_flow, smoothstep(0.44,0.80,flow));
    col+=u_flow*streak;
    col=mix(col,u_mist*0.6+vec3(0.4,0.5,0.6)*0.4,mist);
    col+=u_mist*topGlow;

    float vign=clamp(1.-length((uv-0.5)*1.5),0.,1.);
    col*=0.28+0.72*vign;

    gl_FragColor=vec4(col,1.);
  }
`;

type Vec3=[number,number,number];
const THEMES: Record<string,{flow:Vec3;mist:Vec3;bg:Vec3}> = {
  purple:{ flow:[0.48,0.22,0.85], mist:[0.28,0.12,0.55], bg:[0.010,0.005,0.032] },
  white: { flow:[0.65,0.70,0.82], mist:[0.38,0.42,0.55], bg:[0.015,0.015,0.028] },
  light: { flow:[0.38,0.68,0.88], mist:[0.18,0.48,0.70], bg:[0.005,0.018,0.042] },
  dark:  { flow:[0.35,0.35,0.40], mist:[0.18,0.18,0.22], bg:[0.008,0.008,0.012] },
  gold:  { flow:[0.60,0.45,0.12], mist:[0.35,0.25,0.05], bg:[0.022,0.015,0.000] },
  red:   { flow:[0.60,0.12,0.18], mist:[0.32,0.06,0.08], bg:[0.022,0.002,0.005] },
};

function initGL(canvas:HTMLCanvasElement){
  const gl=canvas.getContext("webgl");if(!gl)return null;
  const mk=(t:number,s:string)=>{const sh=gl.createShader(t)!;gl.shaderSource(sh,s);gl.compileShader(sh);return sh;};
  const p=gl.createProgram()!;
  gl.attachShader(p,mk(gl.VERTEX_SHADER,VS));gl.attachShader(p,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);gl.useProgram(p);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const l=gl.getAttribLocation(p,"a_pos");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
  return{gl,p};
}

export function WaterfallBackground(){
  const{theme}=useTheme();
  const ref=useRef<HTMLCanvasElement>(null);
  const raf=useRef(0);

  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight;};
    resize();window.addEventListener("resize",resize);
    const ctx=initGL(cv);if(!ctx){window.removeEventListener("resize",resize);return;}
    const{gl,p}=ctx;
    const uTime=gl.getUniformLocation(p,"u_time");
    const uRes =gl.getUniformLocation(p,"u_res");
    const uFlow=gl.getUniformLocation(p,"u_flow");
    const uMist=gl.getUniformLocation(p,"u_mist");
    const uBg  =gl.getUniformLocation(p,"u_bg");
    const pal=THEMES[theme]??THEMES.purple;
    const start=performance.now();
    const draw=()=>{
      gl.viewport(0,0,cv.width,cv.height);
      gl.uniform1f(uTime,(performance.now()-start)/1000);
      gl.uniform2f(uRes,cv.width,cv.height);
      gl.uniform3fv(uFlow,pal.flow);
      gl.uniform3fv(uMist,pal.mist);
      gl.uniform3fv(uBg,  pal.bg);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[theme]);

  return <canvas ref={ref} style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:0,display:"block",pointerEvents:"none"}}/>;
}
