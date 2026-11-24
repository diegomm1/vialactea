export const beaconFragmentShader = `
uniform vec3 uColor;
varying float vPulse;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv) * 2.0;
  if (dist > 1.0) discard;
  float core = exp(-dist * 8.0);
  gl_FragColor = vec4(uColor * (1.3 + vPulse), core);
}
`;
