import * as THREE from 'three';

export class CameraController {
  private targetZ = 10.2;
  private targetY = 4.7;

  constructor(private readonly camera: THREE.PerspectiveCamera) {}

  setScrollProgress(progress: number): void {
    this.targetZ = 10.2 - progress * 1.1;
    this.targetY = 4.7 - progress * 0.7;
  }

  update(): void {
    this.camera.position.z += (this.targetZ - this.camera.position.z) * 0.035;
    this.camera.position.y += (this.targetY - this.camera.position.y) * 0.035;
    this.camera.lookAt(0, 0, 0);
  }
}
