# 2026-05-27 Torako/Hakase Sprite Pipeline

## Source

The sprite set is derived from a one-sheet "Hakase" illustration drawn by AICU collaboration creator Torako.

## Imported Assets

Copied the reviewed ImageGen output into:

```text
public/assets/characters/torako-hakase/
```

Primary runtime-ready files:

```text
torako-adopted-states-idle4-getdown-gameoverdown-256.png
torako-walkcycle-4frame-udlr-256.png
spritesheet.json
preview.html
frames-256/
gifs/
```

## Published Process Files

```text
docs/2026-05-27-codex-imagegen-sprite-generation.md
docs/torako-hakase-imagegen-prompts.md
docs/torako-hakase-spritesheet-spec.md
.prompts/torako-hakase-sprite-generation.md
```

## Review Fixes

- Right-facing walk frames were replaced with mirrored left-facing walk frames.
- Right-facing `idle` and `get` frames were replaced with mirrored left-facing frames.
- Down-facing walkcycle frames were re-centered by upper-body/head centroid.
- `get` and `gameover` are adopted only for the down direction.

## Verification

- Confirmed required copied files exist in the project.
- Confirmed `spritesheet.json` remains valid JSON before import.
- Original generated files were left in `output/imagegen/drhakase-torako/state-walk-v3/`.
