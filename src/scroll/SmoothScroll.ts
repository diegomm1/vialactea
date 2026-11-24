import Lenis from 'lenis';

export class SmoothScroll {
  public readonly lenis: Lenis;

  constructor() {
    this.lenis = new Lenis({
      wheelMultiplier: 0.32,
      touchMultiplier: 0.55,
      lerp: 0.055,
      smoothWheel: true,
    });
  }

  onScrollUpdate(callback: (progress: number) => void): void {
    this.lenis.on('scroll', () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      callback(window.scrollY / max);
    });
  }

  update(time: number): void {
    this.lenis.raf(time);
  }

  destroy(): void {
    this.lenis.destroy();
  }
}
