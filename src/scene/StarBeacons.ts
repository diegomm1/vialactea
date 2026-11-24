import * as THREE from 'three';
import { milkyWayStars } from '../data/milkyWayStars.data';
import { project3DToScreen } from '../utils/math3DTo2D';
import { beaconVertexShader } from '../shaders/beaconVertex.glsl';
import { beaconFragmentShader } from '../shaders/beaconFragment.glsl';

interface BeaconNode {
  id: string;
  group: THREE.Group;
  core: THREE.Mesh;
  ring: THREE.Mesh;
  hitArea: THREE.Mesh;
  baseScale: number;
  intensity: number;
}

export class StarBeacons {
  public readonly beaconGroup = new THREE.Group();
  private readonly nodes: BeaconNode[] = [];
  private hoveredId: string | null = null;

  constructor(parent: THREE.Group) {
    parent.add(this.beaconGroup);
    milkyWayStars.forEach((star) => {
      const group = new THREE.Group();
      group.position.set(star.galaxyCoords.x, star.galaxyCoords.y, star.galaxyCoords.z);

      const coreGeometry = new THREE.SphereGeometry(0.095, 20, 20);
      const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: 0.65 },
          uColor: { value: new THREE.Color(star.color) }
        },
        vertexShader: beaconVertexShader,
        fragmentShader: beaconFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);

      const ringGeometry = new THREE.RingGeometry(0.16, 0.19, 48);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: star.color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI * 0.5;

      const hitArea = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 12, 12),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false
        })
      );

      group.add(core, ring, hitArea);
      this.beaconGroup.add(group);
      this.nodes.push({
        id: star.id,
        group,
        core,
        ring,
        hitArea,
        baseScale: 1,
        intensity: 0.2
      });
    });
  }

  setHighlightedStars(activeIds: string[]): void {
    const activeSet = new Set(activeIds);
    this.nodes.forEach((node) => {
      node.intensity = activeSet.has(node.id) ? 1 : 0.12;
    });
  }

  setHoveredStar(id: string | null): void {
    this.hoveredId = id;
  }

  getHoveredStar(): string | null {
    return this.hoveredId;
  }

  raycast(raycaster: THREE.Raycaster): string | null {
    const hits = raycaster.intersectObjects(
      this.nodes.map((node) => node.hitArea),
      false
    );
    if (!hits.length) return null;
    const found = this.nodes.find((node) => node.hitArea === hits[0].object);
    return found?.id ?? null;
  }

  getProjectedScreenPositions(
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
  ): Array<{ id: string; x: number; y: number; isBehind: boolean }> {
    this.beaconGroup.updateMatrixWorld(true);
    return this.nodes.map((node) => {
      const worldPosition = new THREE.Vector3();
      node.group.getWorldPosition(worldPosition);
      const point = project3DToScreen(worldPosition, camera, width, height);
      return { id: node.id, ...point };
    });
  }

  update(time: number): void {
    this.nodes.forEach((node) => {
      node.intensity = THREE.MathUtils.lerp(node.intensity, this.hoveredId === node.id ? 1.8 : node.intensity, 0.12);
      const pulse = 1 + Math.sin(time * 2.4 + node.baseScale) * 0.12;
      node.ring.scale.setScalar(pulse * (0.75 + node.intensity * 0.55));
      node.ring.rotation.z += 0.004 + node.intensity * 0.006;
      node.core.scale.setScalar(0.8 + node.intensity * 0.42);
      const material = node.core.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;
      material.uniforms.uIntensity.value = node.intensity;
    });
  }
}
