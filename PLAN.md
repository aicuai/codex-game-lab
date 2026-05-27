# Star Picker PLAN

## Implementation Choice

Game Studio classification: `2D default`.

Use Vite + TypeScript + Phaser for the 2D playfield. Phaser owns rendering, scene timing, keyboard input plumbing, and collision visualization. DOM owns the text-heavy HUD, game-over panel, and retry button.

Keep the first version small: one player, one collectible star at a time, score, countdown timer, game over, and retry. Gameplay state must stay serializable and separate from Phaser display objects.

## Player Goal

Collect as many stars as possible before the timer reaches zero.

The player should understand the goal without reading a long tutorial: move around the field, touch stars, watch the score increase, and retry after time runs out.

## Core Loop

1. Start a run with the player near the center of the playfield.
2. Spawn a star at a reachable random position.
3. Player moves toward the star.
4. On overlap, increment score and respawn the star.
5. Countdown timer continues during play.
6. When the timer reaches zero, stop movement and show the game-over panel.
7. Retry starts a fresh run with score and timer reset.

## Input

- Arrow keys: move up, down, left, and right.
- WASD keys: same movement actions as arrow keys.
- Retry button: DOM button shown on game over.

Input should map physical keys to serializable actions such as `moveX`, `moveY`, and `retry`. Movement should support diagonal input while keeping speed normalized.

## Win and Loss State

- Win condition: no hard win state in version 1; success is a higher score within the time limit.
- Loss condition: timer reaches zero.
- Game-over state: Phaser simulation pauses or ignores movement, the HUD shows final score, and the DOM retry button is visible.
- Retry state: resets score, timer, player position, star position, and `status: "playing"`.

## Milestones

### M0: Project Baseline

- Confirm current app structure.
- Align project to Vite + TypeScript + Phaser if it is not already aligned.
- Keep `PLAN.md` as the scope source of truth.

### M1: Playable Loop

- Create a Phaser game scene.
- Render a player marker and a star marker.
- Implement arrow-key and WASD movement.
- Keep player within the playfield.
- Detect player/star overlap.
- Increase score and respawn the star.

### M2: DOM HUD and Game Over

- Add DOM HUD for score and remaining time.
- Add countdown timer.
- Stop the run at zero seconds.
- Show DOM game-over panel and retry button.
- Implement retry without a full page reload.

### M3: State Boundary and Polish

- Move serializable run state into a small game-state module.
- Keep Phaser scene objects as render adapters only.
- Add simple visual feedback when a star is collected.
- Add responsive sizing for desktop and small screens.

### M4: Verification and Docs

- Add or update README setup and controls.
- Run build or test after meaningful implementation changes.
- Use Playwright or the available browser automation path to verify boot, movement, scoring, timer, game over, retry, and screenshot output.
- Record major decisions under `.logs/`.

## Proposed File Structure

```text
.
├── index.html
├── package.json
├── PLAN.md
├── README.md
├── src
│   ├── main.ts
│   ├── game
│   │   ├── StarPickerScene.ts
│   │   ├── state.ts
│   │   ├── input.ts
│   │   └── constants.ts
│   ├── ui
│   │   └── hud.ts
│   └── styles.css
├── tests
│   └── smoke.mjs
└── .logs
    └── YYYY-MM-DD-star-picker-*.md
```

## Visual Direction

- Bright, readable arcade style for beginners.
- Player: simple rounded shape or small explorer icon with high contrast.
- Stars: clear yellow star shape with a small glow or pulse.
- Background: calm dark teal or night-sky field that does not compete with the star.
- HUD: compact DOM overlay with score and timer, always readable.
- Game-over panel: plain DOM panel with final score and a visible retry button.

Image generation is not required for version 1. If a bitmap background or sprite sheet is later needed, use the imagegen workflow with a `stylized-concept` game asset prompt and save final assets under `output/imagegen/`. Do not make generated art a blocker for the first playable loop.

Example future imagegen prompt spec:

```text
Use case: stylized-concept
Asset type: 2D browser game background
Primary request: a beginner-friendly night-sky playfield for Star Picker
Style/medium: clean stylized 2D game art
Composition/framing: top-down, unobtrusive center play area
Color palette: dark teal background, soft yellow star accents
Constraints: no text, no logo, no watermark, keep gameplay readability high
Avoid: clutter, harsh bloom, photorealism
```

## Test Plan

- Build check: `npm run build` once the Vite + TypeScript implementation exists.
- Unit-level check: test state reset, timer expiration, scoring, and star respawn logic if a test runner is added.
- Browser smoke check with Playwright or available browser automation:
  - page loads without console errors,
  - canvas is visible,
  - DOM HUD shows score and timer,
  - simulated movement changes player position,
  - collecting a star changes score,
  - timer reaching zero shows game over,
  - retry starts a new run.
- Screenshot check after implementation to confirm HUD does not cover important playfield space.

## Not Implemented Yet

- Enemies, hazards, combat, health, or lives.
- Levels, maps, tilemaps, procedural rooms, or camera scrolling.
- Audio, settings, pause menu, localization, or save data.
- Touch controls or gamepad controls.
- Account system, backend, leaderboard, analytics, or network play.
- Complex sprite animation, generated sprite sheets, or asset pipeline automation.
- Difficulty scaling beyond the fixed countdown run.
