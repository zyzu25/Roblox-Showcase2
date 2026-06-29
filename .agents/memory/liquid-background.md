---
name: Liquid background
description: WebGL animated liquid background for portfolio — architecture, gotchas, and fallback strategy.
---

## Architecture
- `GlobalBackground.tsx` — fullscreen `position: fixed; z-index: 0` wrapper div + WebGL canvas inside
- WebGL shader: FBM domain warp (2 layers, 6 octaves each), 5 animated blobs, 9-sample blur loop, mouse reactivity
- Saturation/brightness applied in-shader (not CSS filter) for consistent rendering across environments
- CSS radial-gradient fallback on the outer `div` (shows when WebGL unavailable, e.g. headless screenshot tool)

## Critical gotcha — body background
`body { background: var(--c-bg) }` was an **opaque solid** that covered the fixed canvas entirely.
**Fix:** set `body { background: transparent }` and `html { background: #000 }`.

**Why:** The WebGL canvas is `position: fixed` behind page content. If the body has any opaque background, it sits on top and hides the canvas. This is non-obvious because the page renders fine (body is above canvas in the stacking context).

**How to apply:** Always make `body` transparent when using a fixed full-screen canvas background. Set the fallback color on `html` instead.

## Theme colors (THEMES object in GlobalBackground.tsx)
- purple: bg=#000000, blobs=#8B00FF family, sat=2.5, bri=0.65
- light: bg=#020202, blobs=#B2D5E5 family, sat=2.5, bri=0.65
- dark: bg=#020202, blobs=#2a2828 family, sat=1.0, bri=0.65

## CSS fallback (visible in screenshot/no-WebGL envs)
Outer div `background` uses vivid radial-gradient for each theme:
- purple: rgba(100,0,255,0.70) blob at 68%/22%, rgba(70,0,200,0.60) at 22%/72%, #000 base
- light: rgba(130,195,220,0.55) blobs, #020202 base
- dark: rgba(50,48,48,0.9) blobs, #020202 base

## Theme names
Type: `"purple" | "light" | "dark"` (previously had "blue"/"white" — removed June 2026).
localStorage key: `"portfolio-theme"`.
