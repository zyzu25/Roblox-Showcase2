---
name: Liquid background
description: WebGL animated liquid background + CSS animated blob fallback. Architecture, gotchas, and fallback strategy.
---

## Architecture
- `GlobalBackground.tsx` — fullscreen `position: fixed; z-index: 0` wrapper div
- **CSS animated blobs**: 5 absolutely-positioned divs with `@keyframes blobDrift1..5` — always visible, provide theme color even when WebGL unavailable (e.g. headless screenshot tools)
- **WebGL canvas**: FBM domain-warp shader (6-octave fbm, 2-pass warp), 5 animated blobs, 9-sample blur loop, mouse repulsion. Renders on top of CSS blobs.
- Saturation + brightness adjustments done in GLSL shader (not CSS filter) — more reliable across environments

## Critical gotcha — body background
`body { background: var(--c-bg) }` was an **opaque solid** that covered the fixed canvas entirely.
**Fix:** `body { background: transparent }` and `html { background: #000 }`.

**Why:** The WebGL canvas is `position: fixed` behind page content. Opaque body background sits on top and hides it.

## CSS fallback blobs
Uses `mix-blend-mode: screen` with `blur(60px)` for glow. Animated via `@keyframes blobDrift1..5` (alternate direction, 14-22s durations with negative delays for staggering). Colors transition smoothly via `transition: background 1.2s ease` when theme switches.

## Theme colors (THEMES object in GlobalBackground.tsx)
- purple: bg=#000000, blobs=#8B00FF family, sat=2.5, bri=0.65
- light: bg=#020202, blobs=#B2D5E5 family, sat=2.5, bri=0.65
- dark: bg=#020202, blobs=#2a2828 family, sat=1.0, bri=0.65

## Theme names
Type: `"purple" | "light" | "dark"`. localStorage key: `"portfolio-theme"`.

## AmbientAudio component
- `AmbientAudio.tsx` — attempts autoplay on mount, falls back to first-click. Volume: 0.30.
- Audio file: `/ambient.mp3` in `artifacts/portfolio/public/`
- Floating button bottom-right at `z-index: 200`, shows pulsing ring when playing.
