import * as THREE from 'three';
import gsap from 'gsap';
import { galaxyVertexShader } from '../shaders/galaxyVertex.glsl';
import { galaxyFragmentShader } from '../shaders/galaxyFragment.glsl';

export class MilkyWayGalaxy {
  public readonly galaxyGroup = new THREE.Group();
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.ShaderMaterial;
  private dragVelocity = 0;
  private autoRotation = 0;

  constructor() {
    const particleCount = 65000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const temperatures = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    this.buildStarField(positions, colors, temperatures, sizes, phases, particleCount, 1.0);

    this.geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    const temperatureAttribute = new THREE.BufferAttribute(temperatures, 1);
    positionAttribute.setUsage(THREE.StaticDrawUsage);
    temperatureAttribute.setUsage(THREE.StaticDrawUsage);
    const sizeAttribute = new THREE.BufferAttribute(sizes, 1);
    const phaseAttribute = new THREE.BufferAttribute(phases, 1);
    const colorAttribute = new THREE.BufferAttribute(colors, 3);
    sizeAttribute.setUsage(THREE.StaticDrawUsage);
    phaseAttribute.setUsage(THREE.StaticDrawUsage);
    colorAttribute.setUsage(THREE.StaticDrawUsage);
    this.geometry.setAttribute('position', positionAttribute);
    this.geometry.setAttribute('aTemperature', temperatureAttribute);
    this.geometry.setAttribute('aSize', sizeAttribute);
    this.geometry.setAttribute('aPhase', phaseAttribute);
    this.geometry.setAttribute('aColor', colorAttribute);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDragIntensity: { value: 0 },
        uStarSeed: { value: 0 }
      },
      vertexShader: galaxyVertexShader,
      fragmentShader: galaxyFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const galaxy = new THREE.Points(this.geometry, this.material);
    galaxy.frustumCulled = false;
    this.galaxyGroup.add(galaxy);
    this.galaxyGroup.rotation.x = -0.52;
  }

  private buildStarField(
    positions: Float32Array,
    colors: Float32Array,
    temperatures: Float32Array,
    sizes: Float32Array,
    phases: Float32Array,
    particleCount: number,
    seed: number
  ): void {
    const random = this.seededRandom(seed * 9127.31 + 41);
    for (let i = 0; i < particleCount; i += 1) {
      let radius: number;
      let angle: number;
      let y: number;
      const arm = i % 4;

      if (i < particleCount * 0.62) {
        radius = Math.pow(random(), 0.62) * 5.5 + 0.18;
        angle = arm * (Math.PI * 0.5) + radius * 0.72 + (random() - 0.5) * 0.58;
        y = (random() - 0.5) * (0.08 + radius * 0.018);
      } else if (i < particleCount * 0.82) {
        radius = Math.pow(random(), 0.62) * 2.05 + 0.18;
        angle = random() * Math.PI * 2;
        y = (random() - 0.5) * 0.5 * (1 - radius / 2.4);
      } else {
        const theta = random() * Math.PI * 2;
        const phi = Math.acos(2 * random() - 1);
        radius = Math.pow(random(), 0.55) * 8.2;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.cos(phi) * 0.42;
        positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        y = positions[i * 3 + 1];
        angle = 0;
        radius = 0;
      }

      if (i < particleCount * 0.82) {
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }

      const temperature = i < particleCount * 0.82
        ? 0.22 + random() * 0.78
        : random();
      const coreAttenuation = THREE.MathUtils.smoothstep(radius, 0.1, 2.2) * 0.55 + 0.45;
      temperatures[i] = temperature;
      sizes[i] = (1.4 + random() * 2.8 + (temperature > 0.88 ? 2.1 : 0)) * coreAttenuation;
      phases[i] = random() * Math.PI * 2;
      if (i < particleCount * 0.82 && radius < 2.2) {
        const amberMix = random();
        colors[i * 3] = 0.72 + amberMix * 0.18;
        colors[i * 3 + 1] = 0.44 + amberMix * 0.12;
        colors[i * 3 + 2] = 0.28 + amberMix * 0.10;
      } else {
        colors[i * 3] = temperature;
        colors[i * 3 + 1] = 0.4 + random() * 0.6;
        colors[i * 3 + 2] = 1 - temperature * 0.35;
      }
    }
  }

  private seededRandom(seed: number): () => number {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  mutateStarField(seed: number): void {
    gsap.to(this.material.uniforms.uStarSeed, {
      value: seed,
      duration: 1.4,
      ease: 'power2.inOut'
    });
  }

  setDragVelocity(value: number): void {
    this.dragVelocity = THREE.MathUtils.lerp(this.dragVelocity, value, 0.16);
  }

  update(time: number, delta: number): void {
    this.autoRotation += delta * 0.018;
    this.galaxyGroup.rotation.y += delta * 0.018;
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uDragIntensity.value = this.dragVelocity;
  }
}
