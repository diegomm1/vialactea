import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { milkyWayStars } from '../data/milkyWayStars.data';
import type { StarBeacons } from '../scene/StarBeacons';
import type { LeaderLineOverlay } from '../ui/LeaderLineOverlay';
import type { StarCardManager } from '../ui/StarCardManager';
import type { HudControls } from '../ui/HudControls';
import type { SmoothScroll } from './SmoothScroll';

export class ScrollChoreographer {
  constructor(
    smoothScroll: SmoothScroll,
    beacons: StarBeacons,
    leaderLines: LeaderLineOverlay,
    cards: StarCardManager,
    hud: HudControls
  ) {
    gsap.registerPlugin(ScrollTrigger);
    smoothScroll.lenis.on('scroll', ScrollTrigger.update);

    const sections = Array.from(document.querySelectorAll<HTMLElement>('.scroll-section'));
    const intro = document.querySelector<HTMLElement>('#intro-copy')!;

    sections.forEach((section, phase) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (trigger) => {
          if (phase === 0) {
            gsap.set(intro, { opacity: 1 - THREEClamp(trigger.progress * 1.8) });
            hud.setPhase(0);
            beacons.setHighlightedStars([]);
            milkyWayStars.forEach((star) => {
              leaderLines.setProgress(star.id, 0);
              cards.setOpacity(star.id, 0);
            });
            cards.setOverviewMode(false);
            return;
          }

          if (phase >= 1 && phase <= 5) {
            const star = milkyWayStars[phase - 1];
            hud.setPhase(phase);
            beacons.setHighlightedStars([star.id]);
            milkyWayStars.forEach((item) => {
              if (item.id !== star.id) {
                leaderLines.setProgress(item.id, 0);
                cards.setOpacity(item.id, 0);
              }
            });
            cards.setOverviewMode(false);
            const draw = smoothRange(trigger.progress, 0, 0.45);
            const cardOpacity = trigger.progress < 0.55
              ? smoothRange(trigger.progress, 0.35, 0.55)
              : trigger.progress < 0.80
                ? 1
                : 1 - smoothRange(trigger.progress, 0.80, 1);
            const fadeDraw = trigger.progress > 0.80
              ? 1 - smoothRange(trigger.progress, 0.80, 1)
              : draw;
            leaderLines.setProgress(star.id, fadeDraw);
            cards.setOpacity(star.id, cardOpacity);
            return;
          }

          hud.setPhase(5);
          beacons.setHighlightedStars(milkyWayStars.map((star) => star.id));
          cards.setOverviewMode(true);
          milkyWayStars.forEach((star, index) => {
            const stagger = index * 0.05;
            const draw = smoothRange(trigger.progress, stagger, 0.50 + stagger);
            const opacity = smoothRange(trigger.progress, 0.40 + stagger, 0.70);
            leaderLines.setProgress(star.id, draw);
            cards.setOpacity(star.id, opacity);
          });
        }
      });
    });
  }
}

function THREEClamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothRange(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  const normalized = THREEClamp((value - start) / (end - start));
  return normalized * normalized * (3 - 2 * normalized);
}
