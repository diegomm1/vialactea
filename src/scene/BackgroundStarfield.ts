import * as THREE from 'three';

export class BackgroundStarfield {
  public readonly field = new THREE.Group();

  constructor() {
    const count = 9000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let seed = 17321;
    const random = (): number => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i += 1) {
      const radius = 18 + random() * 52;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const cool = random();
      colors[i * 3] = 0.55 + cool * 0.45;
      colors[i * 3 + 1] = 0.68 + cool * 0.32;
      colors[i * 3 + 2] = 1;
    }

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    const colorAttribute = new THREE.BufferAttribute(colors, 3);
    positionAttribute.setUsage(THREE.StaticDrawUsage);
    colorAttribute.setUsage(THREE.StaticDrawUsage);
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('color', colorAttribute);
    const material = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.field.add(new THREE.Points(geometry, material));
  }

  update(time: number): void {
    this.field.rotation.y = time * 0.003;
  }
}
