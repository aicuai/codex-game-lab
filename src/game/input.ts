import Phaser from "phaser";
import type { MovementInput } from "./state";

export class KeyboardInput {
  private pressed = new Set<string>();

  constructor(scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error("Keyboard input is not available.");
    }

    scene.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
    ]);

    scene.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      this.pressed.add(event.code);
    });

    scene.input.keyboard.on("keyup", (event: KeyboardEvent) => {
      this.pressed.delete(event.code);
    });

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.pressed.clear();
    });
  }

  readMovement(): MovementInput {
    const left = this.isPressed("ArrowLeft", "KeyA");
    const right = this.isPressed("ArrowRight", "KeyD");
    const up = this.isPressed("ArrowUp", "KeyW");
    const down = this.isPressed("ArrowDown", "KeyS");

    return {
      moveX: Number(right) - Number(left),
      moveY: Number(down) - Number(up),
    };
  }

  private isPressed(...codes: string[]): boolean {
    return codes.some((code) => this.pressed.has(code));
  }
}
