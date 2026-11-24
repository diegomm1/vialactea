export class HudControls {
  private readonly mutateButton: HTMLButtonElement;
  private readonly phaseValue: HTMLElement;

  constructor(onMutate: () => void) {
    this.mutateButton = document.querySelector<HTMLButtonElement>('#mutate-cluster')!;
    this.phaseValue = document.querySelector<HTMLElement>('#phase-value')!;
    this.mutateButton.addEventListener('click', onMutate);
  }

  setPhase(phase: number): void {
    this.phaseValue.textContent = String(phase).padStart(2, '0');
  }
}
