export const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec3 col = vec3(
    0.5 + 0.5 * sin(t * 1.0 + uv.x * 3.0 + uv.y * 2.0),
    0.5 + 0.5 * sin(t * 1.0 + uv.x * 2.0 + uv.y * 4.0 + 2.0),
    0.5 + 0.5 * sin(t * 1.0 + uv.x * 4.0 + uv.y * 1.0 + 4.0)
  );
  col = pow(col, vec3(1.5));
  col *= 0.5;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
