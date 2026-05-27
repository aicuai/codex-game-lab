# Torako Sprite Generation Prompts

Generated on 2026-05-27 with Codex app built-in `imagegen`.

The built-in tool generated opaque chroma-key images first. Local post-processing converted the flat green background to alpha PNGs, then normalized each cell to `256 x 256`.

## 1. Expression Variations

```text
Use the attached image as the exact character reference. Create a 2D chibi anime character expression variation sheet with four separate full-body variants of the same character, each on a perfectly flat solid #00ff00 chroma-key background for later background removal.

Use case: illustration-story
Asset type: transparent character expression assets
Input images: attached image is the reference image for character identity, outfit, proportions, line art style, colors, and pose language.
Primary request: generate four expression variations of the same chibi cat-eared doctor character.
Subject: same chibi cat-eared character with fluffy brown hair, large cat ears, pale green eyes, white lab coat, black shirt with pink AICU JAPAN-style lettering, light gray pants, dark shoes. Keep the full-body proportions, thick black hand-drawn outline, soft watercolor anime coloring, and cute mascot style from the reference.
Expressions/variants: 1) cheerful open-mouth smile, 2) wink with playful smile, 3) surprised face with round open mouth, 4) thinking face with one hand near chin and small curious smile.
Composition/framing: four separate full-body characters arranged in a clean 2x2 grid, generous spacing, each fully visible with no cropping.
Background: perfectly flat uniform #00ff00 chroma-key background only, no shadows, no gradients, no texture, no floor plane, no lighting variation.
Constraints: preserve the same character identity, cat ears, hairstyle, lab coat, black shirt, overall colors, and chibi proportions. Keep the AICU lettering style visible but do not invent extra text. No watermark. No extra characters. Do not use #00ff00 anywhere in the character. Crisp edges with generous padding for background removal.
```

## 2. First Directional Walk Sheet

```text
Use the shown transparent character image as the exact character reference. Create a production-ready 2D chibi game walking sprite sheet for the same character on a perfectly flat solid #00ff00 chroma-key background for later background removal.

Use case: illustration-story
Asset type: top-down / RPG-style 2D character walking sprite sheet
Primary request: four-direction idle and walking sprites for game use.
Subject invariants: same chibi cat-eared doctor character, fluffy brown hair, large cat ears with pink inner ears and white tufts, pale green eyes when visible, white lab coat, black shirt with simple magenta AICU-like chest mark, light gray pants, dark brown shoes, thick black hand-drawn outline, soft anime watercolor coloring, cute mascot proportions. Preserve the same silhouette family, palette, outfit proportions, and readable cat-ear identity.

Sheet layout: strict 4 rows x 4 columns grid, equal cell sizes, no labels, no text outside the character. Rows from top to bottom: facing down/front, facing left/profile, facing right/profile, facing up/back. Columns from left to right: idle/standing, walk frame 1, walk frame 2, walk frame 3. Each sprite is a separate full-body pose centered in its cell, bottom-center aligned, consistent scale and head size, generous padding, no overlap, no cropping.

Animation requirements: idle frame should be neutral standing for that direction; walk frames should show a simple readable 3-frame step cycle with alternating legs and slight arm/lab-coat motion. Keep the character compact and suitable for a browser game sprite sheet. For the up/back row, show the back of the head, cat ears, hair, lab coat back, pants, and shoes; no face visible. For side rows, keep the profile readable while preserving cat ears and lab coat.

Background: perfectly flat uniform #00ff00 chroma-key background only, no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the character. No scenery, no labels, no poster composition, no watermark. Crisp edges with generous padding for clean background removal.
```

## 3. Idle + True 4-Frame Walk Master

```text
Use the shown transparent character image as the exact character reference. Create a production-ready 2D chibi game sprite master sheet for the same character on a perfectly flat solid #00ff00 chroma-key background for later background removal.

Use case: illustration-story
Asset type: top-down / RPG-style 2D character idle and 4-frame walking sprite master sheet
Primary request: four-direction idle plus true 4-frame walk cycle sprites for game use.
Subject invariants: same chibi cat-eared doctor character, fluffy brown hair, large cat ears with pink inner ears and white tufts, pale green eyes when visible, white lab coat, black shirt with simple magenta AICU-like chest mark, light gray pants, dark brown shoes, thick black hand-drawn outline, soft anime watercolor coloring, cute mascot proportions. Preserve the same silhouette family, palette, outfit proportions, and readable cat-ear identity.

Master sheet layout: strict 4 rows x 5 columns grid, equal cell sizes, no labels, no text outside the character. Rows from top to bottom: facing up/back, facing down/front, facing left/profile, facing right/profile. Columns from left to right: idle/standing, walk frame 1 contact-left-foot, walk frame 2 passing-left-foot, walk frame 3 contact-right-foot, walk frame 4 passing-right-foot. Each sprite is a separate full-body pose centered in its cell, bottom-center aligned, consistent scale and head size, generous padding, no overlap, no cropping.

Animation requirements: idle frame should be neutral standing for that direction and not part of the walk cycle. The four walk frames must form a usable looping walk cycle: contact L -> passing L -> contact R -> passing R. Show alternating foot contact clearly, with the lab coat hem and arms moving subtly in opposition to the legs. Keep the body height and head size stable across frames, avoid sliding pose drift, and keep feet near a consistent ground line. For the up/back row, show the back of the head, cat ears, hair, lab coat back, pants, and shoes; no face visible. For side rows, preserve profile readability and make the stepping foot changes visible.

Background: perfectly flat uniform #00ff00 chroma-key background only, no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the character. No scenery, no labels, no poster composition, no watermark. Crisp edges with generous padding for clean background removal.
```

## 4. Non-Moving State Sheet

```text
Use the shown transparent character image as the exact character reference. Create a production-ready 2D chibi game state sprite sheet for the same character on a perfectly flat solid #00ff00 chroma-key background for later background removal.

Use case: illustration-story
Asset type: top-down / RPG-style 2D character non-moving state sprite sheet
Primary request: four-direction non-moving states, with two frames each for idle, get, and gameover.
Subject invariants: same chibi cat-eared doctor character, fluffy brown hair, large cat ears with pink inner ears and white tufts, pale green eyes when visible, white lab coat, black shirt with simple magenta AICU-like chest mark, light gray pants, dark brown shoes, thick black hand-drawn outline, soft anime watercolor coloring, cute mascot proportions. Preserve the same silhouette family, palette, outfit proportions, and readable cat-ear identity.

Sheet layout: strict 4 rows x 6 columns grid, equal cell sizes, no labels, no text outside the character. Rows from top to bottom: facing up/back, facing down/front, facing left/profile, facing right/profile. Columns from left to right: idle frame 1, idle frame 2, get frame 1, get frame 2, gameover frame 1, gameover frame 2. Each sprite is separate, centered in its cell, bottom-center aligned when standing, consistent scale and head size, generous padding, no overlap, no cropping.

State requirements:
- idle frame 1 and 2: standing still, tiny breathing or blink variation only, calm neutral pose, no walking step.
- get frame 1 and 2: collectible pickup / item get reaction, small celebratory pose, hand or arm raised; keep feet mostly planted and pose readable from each direction.
- gameover frame 1 and 2: defeated or dizzy state suitable for a cute game, slumped or sitting/collapsed pose, still safe and non-violent, readable silhouette; for up/back show a back-facing defeated pose, for side rows show profile defeated pose.

Direction requirements: for the up/back row, show back of head, cat ears, hair, lab coat back, pants and shoes, no face visible. For down/front show full face. For side rows preserve profile readability. Keep all static states visually distinct from walking frames.

Background: perfectly flat uniform #00ff00 chroma-key background only, no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the character. No scenery, no labels, no poster composition, no watermark. Crisp edges with generous padding for clean background removal.
```

## 5. Dedicated Walkcycle Sheet

```text
Use the shown transparent character image as the exact character reference. Create a production-ready 2D chibi game walking-cycle sprite sheet for the same character on a perfectly flat solid #00ff00 chroma-key background for later background removal.

Use case: illustration-story
Asset type: top-down / RPG-style 2D character 4-frame walkcycle sprite sheet
Primary request: four-direction natural looping walkcycle, no idle frames.
Subject invariants: same chibi cat-eared doctor character, fluffy brown hair, large cat ears with pink inner ears and white tufts, pale green eyes when visible, white lab coat, black shirt with simple magenta AICU-like chest mark, light gray pants, dark brown shoes, thick black hand-drawn outline, soft anime watercolor coloring, cute mascot proportions. Preserve the same silhouette family, palette, outfit proportions, and readable cat-ear identity.

Sheet layout: strict 4 rows x 4 columns grid, equal cell sizes, no labels, no text outside the character. Rows from top to bottom: facing up/back, facing down/front, facing left/profile, facing right/profile. Columns from left to right: walk frame 1 right-foot contact / hips slightly low and shifted, walk frame 2 passing pose / hips centered and slightly high, walk frame 3 left-foot contact / hips slightly low and shifted opposite, walk frame 4 passing pose / hips centered and slightly high. Each sprite is separate, centered in its cell, bottom-center aligned, consistent scale and head size, generous padding, no overlap, no cropping.

Animation requirements: The 4 frames must make a usable infinite loop: right-foot contact -> passing -> left-foot contact -> passing -> back to right-foot contact. Make alternating foot contact clearly visible. Arms and lab coat hem move opposite the legs. The waist/body should have a subtle smooth up-down and left-right sway that connects naturally between frames. Keep head size stable, avoid pose drift, keep feet near a consistent ground line, and do not include idle standing frames. For side views, the stepping foot must visibly alternate forward/back. For front/back views, show alternating left/right foot and small side-to-side hip sway.

Direction requirements: for the up/back row, show back of head, cat ears, hair, lab coat back, pants and shoes, no face visible. For down/front show full face. For side rows preserve profile readability.

Background: perfectly flat uniform #00ff00 chroma-key background only, no shadows, no gradients, no texture, no floor plane, no lighting variation. Do not use #00ff00 anywhere in the character. No scenery, no labels, no poster composition, no watermark. Crisp edges with generous padding for clean background removal.
```

## Review Fixes Applied After Generation

- Right-facing walk frames were replaced with mirrored left-facing walk frames because generated right-facing ears were cropped.
- Right-facing `idle` and `get` frames were also replaced with mirrored left-facing frames.
- Down-facing walk frames were re-centered by upper-body/head centroid to reduce face jitter in the loop.
- Final adopted state usage keeps all four `idle` directions, but uses only `get/down` and `gameover/down`.
- Transparent output was produced locally from chroma-key sources with `remove_chroma_key.py`, then all final PNGs were validated as RGBA with transparent corners.
