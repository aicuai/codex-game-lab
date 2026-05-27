import Phaser from "phaser";
import {
  GAMEOVER_ANIMATION_DURATION_MS,
  GET_ANIMATION_DURATION_MS,
  PLAYER_RADIUS,
  RUN_SECONDS,
  STAR_RADIUS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./constants";
import { KeyboardInput } from "./input";
import {
  createInitialState,
  snapshot,
  startRun,
  updateRun,
  type GameState,
} from "./state";
import type { Hud } from "../ui/hud";

type Direction = "up" | "down" | "left" | "right";

const TORAKO_CELL_SIZE = 256;
const TORAKO_DISPLAY_SIZE = 86;
const TORAKO_STATE_COLUMNS = 6;
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const DIRECTION_ROWS: Record<Direction, number> = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

export interface StarPickerDebugApi {
  getSnapshot: () => GameState;
  placeStarAtPlayer: () => void;
  setTimeLeft: (seconds: number) => void;
}

export class StarPickerScene extends Phaser.Scene {
  private readonly hud: Hud;
  private state = createInitialState();
  private keyboardInput: KeyboardInput | null = null;
  private playfield!: Phaser.GameObjects.Graphics;
  private backgroundImage!: Phaser.GameObjects.Image;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private starSprite!: Phaser.GameObjects.Image;
  private collectRing!: Phaser.GameObjects.Arc;
  private elapsedSeconds = 0;
  private facing: Direction = "down";
  private getAnimationUntilSeconds = 0;

  constructor(hud: Hud) {
    super("StarPickerScene");
    this.hud = hud;
  }

  preload(): void {
    this.load.image("background", assetPath("assets/star-picker/background.png"));
    this.load.image("star", assetPath("assets/star-picker/star-web.png"));
    this.load.spritesheet(
      "torako-walk",
      assetPath("assets/characters/torako-hakase/torako-walkcycle-4frame-udlr-256.png"),
      { frameWidth: TORAKO_CELL_SIZE, frameHeight: TORAKO_CELL_SIZE },
    );
    this.load.spritesheet(
      "torako-states",
      assetPath(
        "assets/characters/torako-hakase/torako-adopted-states-idle4-getdown-gameoverdown-256.png",
      ),
      { frameWidth: TORAKO_CELL_SIZE, frameHeight: TORAKO_CELL_SIZE },
    );
  }

  create(): void {
    this.keyboardInput = new KeyboardInput(this);
    this.createGameObjects();
    this.prepareCanvasFocus();

    this.hud.onPrimaryAction(() => {
      startRun(this.state);
      this.elapsedSeconds = 0;
      this.getAnimationUntilSeconds = 0;
      this.focusCanvas();
      this.updateViews();
    });

    this.updateViews();
  }

  update(_time: number, delta: number): void {
    this.elapsedSeconds += delta / 1000;
    const movement = this.keyboardInput?.readMovement() ?? { moveX: 0, moveY: 0 };
    const result = updateRun(this.state, movement, delta / 1000, this.elapsedSeconds);

    if (result.collected) {
      this.getAnimationUntilSeconds = this.elapsedSeconds + GET_ANIMATION_DURATION_MS / 1000;
      this.flashCollection();
    }

    this.updatePlayerAnimation(movement);
    this.updateViews();
  }

  getDebugApi(): StarPickerDebugApi {
    return {
      getSnapshot: () => snapshot(this.state),
      placeStarAtPlayer: () => {
        this.state.star.x = this.state.player.x;
        this.state.star.y = this.state.player.y;
        this.updateViews();
      },
      setTimeLeft: (seconds: number) => {
        this.state.timeLeft = Math.max(0, Math.min(RUN_SECONDS, seconds));
        this.updateViews();
      },
    };
  }

  private createGameObjects(): void {
    this.cameras.main.setBackgroundColor("#081821");

    this.backgroundImage = this.add
      .image(0, 0, "background")
      .setOrigin(0)
      .setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);

    this.playfield = this.add.graphics();
    this.drawPlayfieldFrame();
    this.createTorakoAnimations();

    this.collectRing = this.add
      .circle(0, 0, 24)
      .setStrokeStyle(3, 0xffd35a, 0)
      .setFillStyle(0xffd35a, 0);

    this.starSprite = this.add.image(0, 0, "star").setDisplaySize(48, 48);

    this.playerSprite = this.add
      .sprite(0, 0, "torako-states", idleFrame("down", 0))
      .setDisplaySize(TORAKO_DISPLAY_SIZE, TORAKO_DISPLAY_SIZE)
      .play("torako-idle-down");
  }

  private drawPlayfieldFrame(): void {
    this.playfield.clear();
    this.playfield.lineStyle(4, 0x2f6072, 0.7);
    this.playfield.strokeRect(2, 2, WORLD_WIDTH - 4, WORLD_HEIGHT - 4);
  }

  private updateViews(): void {
    this.playerSprite.setPosition(this.state.player.x, this.state.player.y);
    this.starSprite.setPosition(this.state.star.x, this.state.star.y);
    this.starSprite.rotation += 0.025;

    const recentlyCollected = this.elapsedSeconds - this.state.lastCollectedAt < 0.22;
    this.collectRing
      .setPosition(this.state.player.x, this.state.player.y)
      .setAlpha(recentlyCollected ? 1 : 0);

    this.hud.render(this.state);
  }

  private updatePlayerAnimation(movement: { moveX: number; moveY: number }): void {
    if (this.state.status === "gameover") {
      this.playAnimation("torako-gameover-down");
      return;
    }

    if (this.elapsedSeconds < this.getAnimationUntilSeconds) {
      this.playAnimation("torako-get-down");
      return;
    }

    const isMoving = movement.moveX !== 0 || movement.moveY !== 0;

    if (isMoving) {
      this.facing = directionFromMovement(movement.moveX, movement.moveY);
      this.playAnimation(`torako-walk-${this.facing}`);
      return;
    }

    this.playAnimation(`torako-idle-${this.facing}`);
  }

  private createTorakoAnimations(): void {
    for (const direction of Object.keys(DIRECTION_ROWS) as Direction[]) {
      this.createAnimation(
        `torako-idle-${direction}`,
        [idleFrame(direction, 0), idleFrame(direction, 1)],
        "torako-states",
        { frameRate: 4, repeat: true },
      );

      const walkStart = DIRECTION_ROWS[direction] * 4;
      this.createAnimation(
        `torako-walk-${direction}`,
        [walkStart, walkStart + 1, walkStart + 2, walkStart + 3],
        "torako-walk",
        { frameRate: 10, repeat: true },
      );
    }

    this.createAnimation(
      "torako-get-down",
      [getFrame(0), getFrame(1)],
      "torako-states",
      { duration: GET_ANIMATION_DURATION_MS, repeat: false },
    );
    this.createAnimation(
      "torako-gameover-down",
      [gameoverFrame(0), gameoverFrame(1)],
      "torako-states",
      { duration: GAMEOVER_ANIMATION_DURATION_MS, repeat: true },
    );
  }

  private createAnimation(
    key: string,
    frames: number[],
    texture: string,
    timing: { frameRate?: number; duration?: number; repeat: boolean },
  ): void {
    if (this.anims.exists(key)) {
      return;
    }

    this.anims.create({
      key,
      frames: frames.map((frame) => ({ key: texture, frame })),
      frameRate: timing.frameRate,
      duration: timing.duration,
      repeat: timing.repeat ? -1 : 0,
    });
  }

  private playAnimation(key: string): void {
    if (this.playerSprite.anims.currentAnim?.key === key) {
      return;
    }

    this.playerSprite.play(key);
  }

  private flashCollection(): void {
    this.collectRing.setRadius(24);
    this.tweens.add({
      targets: this.collectRing,
      radius: 46,
      alpha: 0,
      duration: 180,
      ease: "Quad.easeOut",
    });
  }

  private prepareCanvasFocus(): void {
    this.game.canvas.tabIndex = 0;
    this.game.canvas.setAttribute("aria-label", "Star Picker playfield");
  }

  private focusCanvas(): void {
    this.game.canvas.focus({ preventScroll: true });
  }
}

function idleFrame(direction: Direction, column: 0 | 1): number {
  return DIRECTION_ROWS[direction] * TORAKO_STATE_COLUMNS + column;
}

function getFrame(column: 0 | 1): number {
  return DIRECTION_ROWS.down * TORAKO_STATE_COLUMNS + 2 + column;
}

function gameoverFrame(column: 0 | 1): number {
  return DIRECTION_ROWS.down * TORAKO_STATE_COLUMNS + 4 + column;
}

function directionFromMovement(moveX: number, moveY: number): Direction {
  if (Math.abs(moveX) > Math.abs(moveY)) {
    return moveX > 0 ? "right" : "left";
  }

  return moveY > 0 ? "down" : "up";
}
