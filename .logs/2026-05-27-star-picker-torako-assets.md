# Star Picker Torako/Hakase Asset Integration

Date: 2026-05-27

## Source

Final assets and sprite specification were copied from:

```text
/Users/aki/git.local/output/imagegen/drhakase-torako/state-walk-v3
```

Runtime location:

```text
public/assets/characters/torako-hakase/
```

## Implementation

- Replaced the player placeholder bitmap with the Torako/Hakase sprite sheets.
- Loaded `torako-walkcycle-4frame-udlr-256.png` as a 256px spritesheet.
- Loaded `torako-adopted-states-idle4-getdown-gameoverdown-256.png` as a 256px spritesheet.
- Used the documented row order: `up`, `down`, `left`, `right`.
- Kept gameplay state, movement speed, scoring, timer, collision, game over, and retry logic unchanged.

## Verification

- `npm run build` passed.
- Browser checks returned `200 OK` for the Torako/Hakase walkcycle sheet, adopted state sheet, and `spritesheet.json`.
- Playwright confirmed the assets load in the browser and saved `.logs/star-picker-torako-assets-loaded.png`.
- `npm run test:smoke` passed after replacement.
