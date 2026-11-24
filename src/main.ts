import './styles/main.css';
import { SceneManager } from './core/SceneManager';
import { PostProcessing } from './core/PostProcessing';
import { CameraController } from './core/CameraController';
import { MilkyWayGalaxy } from './scene/MilkyWayGalaxy';
import { StarBeacons } from './scene/StarBeacons';
import { BackgroundStarfield } from './scene/BackgroundStarfield';
import { MouseDragController } from './interaction/MouseDragController';
import { SmoothScroll } from './scroll/SmoothScroll';
import { ScrollChoreographer } from './scroll/ScrollChoreographer';
import { LeaderLineOverlay } from './ui/LeaderLineOverlay';
import { StarCardManager } from './ui/StarCardManager';
import { HudControls } from './ui/HudControls';

const canvas = document.querySelector<HTMLCanvasElement>('#galaxy-canvas')!;
const sceneManager = new SceneManager(canvas);
const postProcessing = new PostProcessing(
  sceneManager.renderer,
  sceneManager.scene,
  sceneManager.camera
);
const cameraController = new CameraController(sceneManager.camera);

const galaxy = new MilkyWayGalaxy();
const beacons = new StarBeacons(galaxy.galaxyGroup);
sceneManager.scene.add(galaxy.galaxyGroup);

const background = new BackgroundStarfield();
sceneManager.scene.add(background.field);

const leaderLines = new LeaderLineOverlay();
const cards = new StarCardManager();
let mutationSeed = 1;
const hud = new HudControls(() => {
  mutationSeed = mutationSeed * 1.618 + 0.37;
  galaxy.mutateStarField(mutationSeed);
});

const dragController = new MouseDragController(
  canvas,
  sceneManager.camera,
  galaxy.galaxyGroup,
  beacons,
  (velocity) => galaxy.setDragVelocity(velocity)
);

canvas.addEventListener('dblclick', (event) => {
  if ((event.target as HTMLElement).id === 'galaxy-canvas') {
    mutationSeed = mutationSeed * 1.618 + 0.73;
    galaxy.mutateStarField(mutationSeed);
  }
});

const smoothScroll = new SmoothScroll();
new ScrollChoreographer(smoothScroll, beacons, leaderLines, cards, hud);
smoothScroll.onScrollUpdate((progress) => cameraController.setScrollProgress(progress));

const clock = new (class {
  private previous = performance.now();
  elapsed(): { time: number; delta: number } {
    const now = performance.now();
    const delta = Math.min(0.05, (now - this.previous) / 1000);
    this.previous = now;
    return { time: now / 1000, delta };
  }
})();

function animate(): void {
  requestAnimationFrame(animate);
  if (!sceneManager.isVisible) return;
  const { time, delta } = clock.elapsed();
  smoothScroll.update(time * 1000);
  dragController.update();
  galaxy.update(time, delta);
  beacons.update(time);
  background.update(time);
  cameraController.update();

  const positions = beacons.getProjectedScreenPositions(
    sceneManager.camera,
    window.innerWidth,
    window.innerHeight
  );
  positions.forEach((position) => {
    leaderLines.setOrigin(position.id, position.x, position.y);
    cards.setOrigin(position.id, position.x, position.y);
  });
  leaderLines.update();
  cards.update();
  postProcessing.render();
}

window.addEventListener('resize', () => {
  sceneManager.resize();
  postProcessing.resize();
});

animate();
