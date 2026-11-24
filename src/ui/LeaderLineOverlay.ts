import { milkyWayStars } from '../data/milkyWayStars.data';
import { computeLeaderLineGeometry } from '../utils/math3DTo2D';

export class LeaderLineOverlay {
  private readonly svg: SVGSVGElement;
  private readonly groups = new Map<string, SVGGElement>();
  private readonly paths = new Map<string, SVGPathElement>();
  private readonly origins = new Map<string, { x: number; y: number }>();
  private readonly progress = new Map<string, number>();
  private readonly originCircles = new Map<string, SVGCircleElement>();
  private readonly terminalCircles = new Map<string, SVGCircleElement>();
  private readonly lastGeometry = new Map<string, { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }>();
  private readonly lastProgress = new Map<string, number>();

  constructor() {
    this.svg = document.querySelector<SVGSVGElement>('#leader-lines-svg')!;
    this.svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    milkyWayStars.forEach((star) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'leader-group');
      group.setAttribute('data-star-id', star.id);
      group.style.opacity = '0';

      const origin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      origin.setAttribute('class', 'leader-origin');
      origin.setAttribute('r', '5');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'leader-path');
      path.setAttribute('stroke', star.color);

      const terminal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      terminal.setAttribute('class', 'leader-terminal');
      terminal.setAttribute('r', '3');

      group.append(origin, path, terminal);
      this.svg.appendChild(group);
      this.groups.set(star.id, group);
      this.paths.set(star.id, path);
      this.originCircles.set(star.id, origin);
      this.terminalCircles.set(star.id, terminal);
      this.progress.set(star.id, 0);
      this.lastProgress.set(star.id, -1);
    });
  }

  setProgress(id: string, progress: number): void {
    this.progress.set(id, THREEClamp(progress));
    const group = this.groups.get(id);
    if (group) group.style.opacity = progress > 0.001 ? '1' : '0';
  }

  setOrigin(id: string, x: number, y: number): void {
    this.origins.set(id, { x, y });
  }

  update(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    milkyWayStars.forEach((star) => {
      const origin = this.origins.get(star.id) ?? { x: width / 2, y: height / 2 };
      const geometry = computeLeaderLineGeometry(origin, star.side, star.overviewYPercent, width, height);
      const group = this.groups.get(star.id);
      const path = this.paths.get(star.id);
      if (!group || !path) return;

      const previous = this.lastGeometry.get(star.id);
      const progress = this.progress.get(star.id) ?? 0;
      const changed = !previous ||
        Math.abs(previous.x1 - geometry.x1) > 0.4 ||
        Math.abs(previous.y1 - geometry.y1) > 0.4 ||
        Math.abs(previous.x2 - geometry.x2) > 0.4 ||
        Math.abs(previous.y2 - geometry.y2) > 0.4 ||
        Math.abs(previous.x3 - geometry.x3) > 0.4 ||
        Math.abs(previous.y3 - geometry.y3) > 0.4 ||
        Math.abs((this.lastProgress.get(star.id) ?? -1) - progress) > 0.002;
      if (!changed) return;

      this.lastGeometry.set(star.id, geometry);
      this.lastProgress.set(star.id, progress);
      this.originCircles.get(star.id)?.setAttribute('cx', geometry.x1.toFixed(2));
      this.originCircles.get(star.id)?.setAttribute('cy', geometry.y1.toFixed(2));
      this.terminalCircles.get(star.id)?.setAttribute('cx', geometry.x3.toFixed(2));
      this.terminalCircles.get(star.id)?.setAttribute('cy', geometry.y3.toFixed(2));
      path.setAttribute('d', `M ${geometry.x1.toFixed(2)} ${geometry.y1.toFixed(2)} L ${geometry.x2.toFixed(2)} ${geometry.y2.toFixed(2)} L ${geometry.x3.toFixed(2)} ${geometry.y3.toFixed(2)}`);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
    });
  }
}

function THREEClamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}
