export const galaxyFragmentShader = `
varying float vTemperature;
varying float vIntensity;
varying float vCoreAttenuation;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv) * 2.0;
  if (dist > 1.0) discard;

  float core = smoothstep(0.5, 0.08, dist);
  float halo = exp(-dist * 9.0) * 0.25;

  vec3 hotBlue = vec3(0.38, 0.68, 1.0);
  vec3 warmGold = vec3(1.0, 0.68, 0.30);
  vec3 amber = vec3(0.851, 0.608, 0.322);
  vec3 paleAmber = vec3(0.961, 0.812, 0.627);
  vec3 redOrange = vec3(1.0, 0.20, 0.08);
  vec3 magenta = vec3(0.68, 0.26, 0.72);

  vec3 population = mix(hotBlue, warmGold, smoothstep(0.12, 0.72, vTemperature));
  population = mix(population, mix(amber, paleAmber, 0.45), smoothstep(0.18, 0.48, vTemperature) * 0.32);
  population = mix(population, redOrange, smoothstep(0.82, 1.0, vTemperature) * 0.72);
  population = mix(population, magenta, smoothstep(0.55, 0.65, sin(vTemperature * 12.0)) * 0.08);

  float alpha = (core + halo) * vIntensity * vCoreAttenuation * 0.42;
  gl_FragColor = vec4(population * (core * 1.8 + halo), alpha);
}
`;
