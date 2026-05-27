# Torako Sprite Sheet Specification

Date: 2026-05-27

## Coordinate System

- Cell size: `256 x 256`
- Direction row order: `up`, `down`, `left`, `right`
- Origin: top-left
- Anchor convention: bottom-center per cell
- Format: PNG, `RGBA`, transparent background
- Preview FPS:
  - `idle/get/gameover`: 4 fps for two-frame state preview
  - `walkcycle`: 10 fps

## Final Adopted Assets

### Adopted State Sheet

File: `torako-adopted-states-idle4-getdown-gameoverdown-256.png`

Grid: `4 rows x 6 columns`, `1536 x 1024`

Rows:

| Row | Direction | Adopted content |
|---:|---|---|
| 0 | `up` | `idle1`, `idle2` |
| 1 | `down` | `idle1`, `idle2`, `get1`, `get2`, `gameover1`, `gameover2` |
| 2 | `left` | `idle1`, `idle2` |
| 3 | `right` | `idle1`, `idle2` |

Columns:

| Column | State |
|---:|---|
| 0 | `idle1` |
| 1 | `idle2` |
| 2 | `get1` |
| 3 | `get2` |
| 4 | `gameover1` |
| 5 | `gameover2` |

Cells outside the adopted content are intentionally transparent.

### Walkcycle Sheet

File: `torako-walkcycle-4frame-udlr-256.png`

Grid: `4 rows x 4 columns`, `1024 x 1024`

Rows:

| Row | Direction |
|---:|---|
| 0 | `up` |
| 1 | `down` |
| 2 | `left` |
| 3 | `right` |

Columns:

| Column | Pose |
|---:|---|
| 0 | `rightFootContact` |
| 1 | `passingHighA` |
| 2 | `leftFootContact` |
| 3 | `passingHighB` |

Loop order: `0 -> 1 -> 2 -> 3 -> 0`

## Individual Frame Directories

- `frames-256/states/idle/`
- `frames-256/states/get/`
- `frames-256/states/gameover/`
- `frames-256/walkcycle/`

Frame file naming:

```text
torako-{direction}-{state}{index}-256.png
torako-{direction}-{frameNumber}-{walkPose}-256.png
```

Examples:

```text
torako-down-idle1-256.png
torako-down-get2-256.png
torako-left-03-leftFootContact-256.png
```

## Review Decisions

- Use all four `idle` directions.
- Use only `get/down` for the pickup animation in the first game prototype.
- Use only `gameover/down` for the game over animation in the first game prototype.
- Use mirrored-left frames for right-facing `walkcycle`, `idle`, and `get` because generated right-facing ears were cropped.
- Keep generated right-facing `gameover` files as source material, but do not mark them as adopted.
- Recenter down-facing walkcycle frames by upper-body/head centroid to reduce face jitter.

## Validation

- Final PNG assets checked: `46`
- Alpha mode: `RGBA`
- Transparent-corner check: passed for final sheets and individual frames
- Generated GIF previews:
  - `torako-walkcycle-all-directions-10fps.gif`
  - `gifs/torako-walkcycle-{direction}-10fps.gif`
  - `gifs/torako-{idle,get,gameover}-{direction}-2frame.gif`

## Known Limitations

- These are AI-generated prototype sprites, not hand-cleaned production animation frames.
- The walkcycle is usable for prototyping, but final game shipping quality may require manual pixel or paint-over cleanup.
- `get` includes a star visual as part of the generated sprite. If the game needs inventory effects as independent objects, split the star into a separate effect layer in a later pass.
- `gameover` includes dizziness marks as part of the generated sprite. If the effect should be animated independently, split it into a separate overlay layer.
