# Star Picker Plan Log

Date: 2026-05-27

## Decisions

- Game Studio classification is `2D default`, so the implementation path remains Vite + TypeScript + Phaser.
- Phaser should own the playfield, render loop, and input plumbing.
- DOM should own the score, timer, game-over panel, and retry button.
- The first playable loop is intentionally limited to movement, star collection, score, timer, game over, and retry.
- Game state should be serializable and separate from Phaser display objects.
- Image generation is not required for version 1; if used later, generated assets should not block the playable loop.
- OpenAI docs tooling was checked for image-generation guidance, but no OpenAI API feature is part of the game runtime.
- Playwright-core is available in this workspace and should be used for smoke checks after implementation.
