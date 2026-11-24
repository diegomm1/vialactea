import * as THREE from 'three';
import { milkyWayStars } from '../data/milkyWayStars.data';
import type { StarBeacons } from '../scene/StarBeacons';

export class MouseDragController {
  private readonly dragSensitivity = 0.00085;
  private readonly damping = 0.045;
  private readonly maxVelocity = 0.018;
  private dragging = false;
  private previousX = 0;
  private previousY = 0;
  private targetRotationX = -0.52;
  private targetRotationY = 0;
  private velocityX = 0;
  private velocityY = 0;
  private dragSpeed = 0;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private tooltip: HTMLDivElement;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly camera: THREE.PerspectiveCamera,
    private readonly galaxyGroup: THREE.Group,
    private readonly beacons: StarBeacons,
    private readonly onVelocity: (velocity: number) => void
  ) {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'star-tooltip';
    document.body.appendChild(this.tooltip);
    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.dragging = true;
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    this.canvas.style.cursor = 'grabbing';
  };

  private onPointerMove = (event: PointerEvent): void => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hoveredId = this.beacons.raycast(this.raycaster);
    this.beacons.setHoveredStar(hoveredId);

    if (hoveredId) {
      const star = milkyWayStars.find((item) => item.id === hoveredId);
      if (star) {
        this.tooltip.textContent = star.name;
        this.tooltip.style.opacity = '1';
        this.tooltip.style.left = `${event.clientX + 14}px`;
        this.tooltip.style.top = `${event.clientY + 14}px`;
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      this.tooltip.style.opacity = '0';
      if (!this.dragging) this.canvas.style.cursor = 'grab';
    }

    if (!this.dragging) return;
    const deltaX = event.clientX - this.previousX;
    const deltaY = event.clientY - this.previousY;
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    const angularVelocityX = THREE.MathUtils.clamp(deltaX * this.dragSensitivity, -this.maxVelocity, this.maxVelocity);
    const angularVelocityY = THREE.MathUtils.clamp(deltaY * this.dragSensitivity, -this.maxVelocity, this.maxVelocity);
    this.velocityX = THREE.MathUtils.lerp(this.velocityX, angularVelocityX, this.damping);
    this.velocityY = THREE.MathUtils.lerp(this.velocityY, angularVelocityY, this.damping);
    this.targetRotationY += angularVelocityX;
    this.targetRotationX += angularVelocityY;
    this.targetRotationX = THREE.MathUtils.clamp(this.targetRotationX, -0.85, 0.85);
    this.dragSpeed = THREE.MathUtils.lerp(this.dragSpeed, Math.min(1, Math.hypot(deltaX, deltaY) / 180), 0.12);
  };

  private onPointerUp = (): void => {
    this.dragging = false;
    this.canvas.style.cursor = 'grab';
  };

  update(): void {
    this.targetRotationY += this.velocityX;
    this.targetRotationX += this.velocityY;
    this.velocityX *= 0.955;
    this.velocityY *= 0.955;
    this.targetRotationX = THREE.MathUtils.clamp(this.targetRotationX, -0.85, 0.85);
    this.galaxyGroup.rotation.y += (this.targetRotationY - this.galaxyGroup.rotation.y) * this.damping;
    this.galaxyGroup.rotation.x += (this.targetRotationX - this.galaxyGroup.rotation.x) * this.damping;
    this.dragSpeed *= 0.97;
    this.onVelocity(this.dragSpeed);
  }
}
