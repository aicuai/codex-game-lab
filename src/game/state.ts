import {
  PLAYER_RADIUS,
  PLAYER_SPEED,
  RUN_SECONDS,
  STAR_RADIUS,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./constants";

export type GameStatus = "ready" | "playing" | "gameover";

export interface Point {
  x: number;
  y: number;
}

export interface MovementInput {
  moveX: number;
  moveY: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  player: Point;
  star: Point;
  lastCollectedAt: number;
}

export interface UpdateResult {
  collected: boolean;
  ended: boolean;
}

const spawnMargin = 54;

export function createInitialState(rng: () => number = Math.random): GameState {
  const state: GameState = {
    status: "ready",
    score: 0,
    timeLeft: RUN_SECONDS,
    player: {
      x: WORLD_WIDTH * 0.5,
      y: WORLD_HEIGHT * 0.58,
    },
    star: {
      x: WORLD_WIDTH * 0.5,
      y: WORLD_HEIGHT * 0.38,
    },
    lastCollectedAt: -999,
  };

  respawnStar(state, rng);
  return state;
}

export function startRun(state: GameState, rng: () => number = Math.random): void {
  state.status = "playing";
  state.score = 0;
  state.timeLeft = RUN_SECONDS;
  state.player.x = WORLD_WIDTH * 0.5;
  state.player.y = WORLD_HEIGHT * 0.58;
  state.lastCollectedAt = -999;
  respawnStar(state, rng);
}

export function updateRun(
  state: GameState,
  input: MovementInput,
  deltaSeconds: number,
  elapsedSeconds: number,
  rng: () => number = Math.random,
): UpdateResult {
  const result: UpdateResult = { collected: false, ended: false };

  if (state.status !== "playing") {
    return result;
  }

  const length = Math.hypot(input.moveX, input.moveY);
  const normalizedX = length > 0 ? input.moveX / length : 0;
  const normalizedY = length > 0 ? input.moveY / length : 0;

  state.player.x = clamp(
    state.player.x + normalizedX * PLAYER_SPEED * deltaSeconds,
    PLAYER_RADIUS,
    WORLD_WIDTH - PLAYER_RADIUS,
  );
  state.player.y = clamp(
    state.player.y + normalizedY * PLAYER_SPEED * deltaSeconds,
    PLAYER_RADIUS,
    WORLD_HEIGHT - PLAYER_RADIUS,
  );

  state.timeLeft = Math.max(0, state.timeLeft - deltaSeconds);

  if (distance(state.player, state.star) <= PLAYER_RADIUS + STAR_RADIUS) {
    state.score += 1;
    state.lastCollectedAt = elapsedSeconds;
    result.collected = true;
    respawnStar(state, rng);
  }

  if (state.timeLeft <= 0) {
    state.status = "gameover";
    result.ended = true;
  }

  return result;
}

export function respawnStar(state: GameState, rng: () => number = Math.random): void {
  let next = randomPoint(rng);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (distance(next, state.player) > 130) {
      break;
    }
    next = randomPoint(rng);
  }

  state.star.x = next.x;
  state.star.y = next.y;
}

export function snapshot(state: GameState): GameState {
  return {
    status: state.status,
    score: state.score,
    timeLeft: state.timeLeft,
    player: { ...state.player },
    star: { ...state.star },
    lastCollectedAt: state.lastCollectedAt,
  };
}

function randomPoint(rng: () => number): Point {
  return {
    x: spawnMargin + rng() * (WORLD_WIDTH - spawnMargin * 2),
    y: spawnMargin + rng() * (WORLD_HEIGHT - spawnMargin * 2),
  };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
