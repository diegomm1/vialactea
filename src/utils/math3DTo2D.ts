import * as THREE from 'three';
import type { StarSide } from '../types/astronomy.types';

export interface ScreenPoint {
  x: number;
  y: number;
  isBehind: boolean;
}

export function project3DToScreen(
  worldPosition: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number
): ScreenPoint {
  const projected = worldPosition.clone().project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * width,
    y: (-projected.y * 0.5 + 0.5) * height,
    isBehind: projected.z > 1 || projected.z < -1
  };
}

export function computeLeaderLineGeometry(
  origin: { x: number; y: number },
  side: StarSide,
  targetYPercent: number,
  width: number,
  height: number
): { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number } {
  const padding = 24;
  const cardWidth = width < 900 ? Math.min(260, width * 0.42) : 320;
  const x3 = side === 'right'
    ? Math.min(width - padding - cardWidth, origin.x + 190)
    : Math.max(padding + cardWidth, origin.x - 190);
  const y3 = Math.max(120, Math.min(height - 150, (targetYPercent / 100) * height));
  const direction = side === 'right' ? 1 : -1;
  const horizontalDistance = Math.max(54, Math.abs(x3 - origin.x));
  const x2 = origin.x + direction * Math.min(horizontalDistance * 0.52, 150);
  const y2 = y3 > origin.y
    ? origin.y + Math.min(Math.abs(y3 - origin.y), 110)
    : origin.y - Math.min(Math.abs(y3 - origin.y), 110);
  return { x1: origin.x, y1: origin.y, x2, y2, x3, y3 };
}
