export const galaxyVertexShader = `
uniform float uTime;
uniform float uDragIntensity;
uniform float uStarSeed;
attribute float aSize;
attribute float aTemperature;
attribute float aPhase;
varying float vTemperature;
varying float vIntensity;
varying float vCoreAttenuation;

void main() {
  vec3 transformed = position;
  float radius = length(transformed.xz);
  float differential = uTime * (0.018 + 0.0008 / (1.0 + radius)) + uStarSeed * 0.012;
  float cosA = cos(differential);
  float sinA = sin(differential);
  transformed.xz = mat2(cosA, -sinA, sinA, cosA) * transformed.xz;

  float wave = sin(transformed.x * 0.7 + uTime * 0.35 + aPhase + uStarSeed) *
               cos(transformed.z * 0.55 - uTime * 0.22);
  transformed.y += wave * (0.018 + uDragIntensity * 0.045);
  transformed.x += sin(aPhase * 1.7 + uTime * 0.25 + uStarSeed) * uDragIntensity * 0.018;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_PointSize = clamp(aSize * (300.0 / max(1.0, -mvPosition.z)), 0.7, 7.5);
  gl_Position = projectionMatrix * mvPosition;
  vTemperature = aTemperature;
  vIntensity = 0.72 + 0.28 * sin(uTime * (1.1 + aPhase * 0.03) + aPhase);
  vCoreAttenuation = mix(0.62, 1.0, smoothstep(0.1, 2.2, radius));
}
`;
