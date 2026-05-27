# GitHub Pages Publish Log

Date: 2026-05-27

## Decisions

- Publish repository to `aicuai/codex-game-lab`.
- Deploy the Vite build through GitHub Actions and GitHub Pages.
- Use `/codex-game-lab/` as the production Vite base path.
- Keep local development at `/` by applying the Pages base path only during `vite build`.
- Load Phaser assets through `import.meta.env.BASE_URL` so public assets resolve on GitHub Pages.

## Expected Site

```text
https://aicuai.github.io/codex-game-lab/
```
