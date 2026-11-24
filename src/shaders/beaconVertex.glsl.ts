export const beaconVertexShader = `
uniform float uTime;
uniform float uIntensity;
attribute float aRadius;
varying float vPulse;

void main() {
  vPulse = uIntensity;
  vec3 transformed = position * (1.0 + sin(uTime * 2.2 + aRadius) * 0.025 * uIntensity);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;
