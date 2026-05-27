import type { GameState } from "../game/state";

interface HudElements {
  score: HTMLElement;
  time: HTMLElement;
  overlay: HTMLElement;
  overlayEyebrow: HTMLElement;
  overlayTitle: HTMLElement;
  overlayBody: HTMLElement;
  primaryButton: HTMLButtonElement;
}

export type PrimaryAction = () => void;

export class Hud {
  private elements: HudElements;
  private primaryAction: PrimaryAction | null = null;

  constructor() {
    this.elements = {
      score: getElement("scoreValue"),
      time: getElement("timeValue"),
      overlay: getElement("overlay"),
      overlayEyebrow: getElement("overlayEyebrow"),
      overlayTitle: getElement("overlayTitle"),
      overlayBody: getElement("overlayBody"),
      primaryButton: getElement("primaryButton") as HTMLButtonElement,
    };

    this.elements.primaryButton.addEventListener("click", () => {
      this.primaryAction?.();
      this.elements.primaryButton.blur();
    });
  }

  onPrimaryAction(action: PrimaryAction): void {
    this.primaryAction = action;
  }

  render(state: GameState): void {
    this.elements.score.textContent = String(state.score);
    this.elements.time.textContent = String(Math.ceil(state.timeLeft));
    document.body.dataset.state = state.status;

    if (state.status === "ready") {
      this.elements.overlay.hidden = false;
      this.elements.overlayEyebrow.textContent = "Ready";
      this.elements.overlayTitle.textContent = "Star Picker";
      this.elements.overlayBody.textContent =
        "Collect as many stars as you can before the timer reaches zero.";
      this.elements.primaryButton.textContent = "Start";
    }

    if (state.status === "playing") {
      this.elements.overlay.hidden = true;
    }

    if (state.status === "gameover") {
      this.elements.overlay.hidden = false;
      this.elements.overlayEyebrow.textContent = "Time Up";
      this.elements.overlayTitle.textContent = "Game Over";
      this.elements.overlayBody.textContent = `Final score: ${state.score}. Try for a higher score.`;
      this.elements.primaryButton.textContent = "Retry";
    }
  }
}

function getElement<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing element #${id}`);
  }

  return element as T;
}
