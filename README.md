# Star Picker

A small beginner-friendly browser game prototype built with Vite, TypeScript, and Phaser.

Published site:

```text
https://aicuai.github.io/codex-game-lab/
```

## Setup

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Controls

- Arrow keys: move
- WASD: move
- Start: begin the run
- Retry: start a new run after game over

## Goal

Collect stars to increase your score before the countdown timer reaches zero.

## Torako/Hakase Sprite Workflow

This repo includes a publishable ImageGen sprite-generation trail for a character derived from a one-sheet "Hakase" illustration drawn by AICU collaboration creator Torako.

- Final browser preview: `public/assets/characters/torako-hakase/preview.html`
- Expression variants: `public/assets/characters/torako-hakase/expressions/`
- Adopted state sheet: `public/assets/characters/torako-hakase/torako-adopted-states-idle4-getdown-gameoverdown-256.png`
- Walkcycle sheet: `public/assets/characters/torako-hakase/torako-walkcycle-4frame-udlr-256.png`
- Process article: `docs/2026-05-27-codex-imagegen-sprite-generation.md`
- Intermediate prompts: `docs/torako-hakase-imagegen-prompts.md`
- Sprite sheet spec: `docs/torako-hakase-spritesheet-spec.md`

The current game loop can still run with placeholder Star Picker assets. The Torako/Hakase sprite sheets are staged as documented game assets so the art pipeline can be reviewed before replacing the in-game player runtime.
