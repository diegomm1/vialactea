import { milkyWayStars } from '../data/milkyWayStars.data';
import { computeLeaderLineGeometry } from '../utils/math3DTo2D';

export class StarCardManager {
  private readonly layer: HTMLElement;
  private readonly cards = new Map<string, HTMLElement>();
  private readonly origins = new Map<string, { x: number; y: number }>();
  private readonly opacities = new Map<string, number>();
  private readonly lastTransforms = new Map<string, string>();
  private readonly lastOpacities = new Map<string, number>();

  constructor() {
    this.layer = document.querySelector<HTMLElement>('#cards-layer')!;
    milkyWayStars.forEach((star, index) => {
      const card = document.createElement('article');
      card.className = 'star-card';
      card.dataset.starId = star.id;
      card.style.opacity = '0';
      card.innerHTML = `
        <div class="star-card-kicker">GIGANTE DE LA VÍA LÁCTEA · ${String(index + 1).padStart(2, '0')}</div>
        <h2 class="star-name-large">${star.name}</h2>
        <p class="star-description-small">${star.description}</p>
        <div class="star-specs-small">
          <span>Radio: <strong>${star.radiusSolar}</strong></span>
          <span>Distancia: <strong>${star.distanceLy}</strong></span>
          <span>Tipo: <strong>${star.spectralType}</strong></span>
        </div>
      `;
      this.layer.appendChild(card);
      this.cards.set(star.id, card);
      this.opacities.set(star.id, 0);
    });
  }

  setOrigin(id: string, x: number, y: number): void {
    this.origins.set(id, { x, y });
  }

  setOpacity(id: string, opacity: number): void {
    this.opacities.set(id, Math.max(0, Math.min(1, opacity)));
  }

  setOverviewMode(active: boolean): void {
    this.cards.forEach((card) => card.classList.toggle('overview-card', active));
  }

  update(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    milkyWayStars.forEach((star) => {
      const card = this.cards.get(star.id);
      if (!card) return;
      const origin = this.origins.get(star.id) ?? { x: width / 2, y: height / 2 };
      const geometry = computeLeaderLineGeometry(origin, star.side, star.overviewYPercent, width, height);
      const opacity = this.opacities.get(star.id) ?? 0;
      const x = star.side === 'right' ? geometry.x3 : geometry.x3 - 320;
      const y = geometry.y3 - 90;
      const transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (this.lastTransforms.get(star.id) !== transform) {
        card.style.transform = transform;
        this.lastTransforms.set(star.id, transform);
      }
      if (Math.abs((this.lastOpacities.get(star.id) ?? -1) - opacity) > 0.002) {
        card.style.opacity = `${opacity}`;
        this.lastOpacities.set(star.id, opacity);
      }
      card.style.setProperty('--side', star.side);
    });
  }
}
