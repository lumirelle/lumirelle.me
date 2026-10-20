# Geist-style transfer with zero-dependency motion

> Amended by ADR-0002: hue is permitted for syntax highlighting and alert severity. Everything structural stays monochrome.

This site is visually identical to the `antfu/antfu.me` fork it came from, and the 2026 redesign wanted it simpler and more "geek". We adopt Geist's *design way* — restraint, hairline materials, a visible structural frame, monochrome surfaces — but not its typefaces or React packages: prose stays in a serif, and the system voice (navigation, dates, counts, labels, code) is Aporetic Serif Mono. All motion is CSS plus the View Transitions API; no motion library, no WebGPU, no shader effects. The per-page pixi canvas backgrounds (`art: plum | dots`) are retired. There is no `upstream` git remote and none will be added: this project diverges freely.

## Considered options

- **Full Geist** (Geist Sans + Mono, its tokens, its components): rejected — it would erase the reading character that makes a long-form personal site worth visiting, and Geist's components are React-only anyway.
- **Geist-adjacent, own identity**: rejected as too timid — it leaves the site in the same generic space as the fork it is trying to stop looking like.
- **`motion-v`** (spring physics, layout morphs): deferred, not rejected. CSS and View Transitions cover every transition we currently want; adding a dependency now would buy nothing.
- **`shaders` / WebGPU accent layer**: rejected. It is WebGPU-only with no WebGL fallback, and the brief's own constraint — the site must be fully correct with all animation stripped — makes a capability-gated visual layer a poor place to spend the loudness budget.
- **Overlay curtain transitions**: rejected — a second, competing transition system alongside the first-load cascade.

## Consequences

- **The prose face is the system serif, not Aporetic Serif.** No proportional Aporetic Serif file exists in this repo, so `--font-serif` resolves to the `ui-serif` stack (Georgia on macOS). The mono cut *is* shipped: subset to Latin + punctuation and converted to woff2 (4.9 MB → 86 KB per weight) with its `@font-face` declared in a dedicated font stylesheet. Everything that read as "Aporetic" before this change was, in fact, a fallback.
- Reading type went from 16 px to 18 px at 1.7 line height, in the same change.
- NProgress is deleted; its 2 px bar is redundant once View Transitions paints the swap on prerendered routes.
- The 20-stage `slide-enter` cascade is capped at ~6 stages and restricted to first load, so it cannot double-animate against a route transition.
- Browsers without View Transitions get instant route swaps. That is deliberate: no fallback transition, no replacement progress bar.
- `pixi.js` and `simplex-noise` leave the dependency list with the Art canvases (−259 KB lazy chunk). If character is missed later, Art returns as a cheap CSS/SVG surface in the new material language, not as WebGL.
- Every later surface is built on `src/styles/tokens.css`, so P2 and P3 cannot drift from P1.
- If a future transition needs more than the View Transitions API can express, that is the trigger to revisit `motion-v` — not to hand-roll a fourth motion system.
