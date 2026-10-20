# Hue is allowed where it means something: syntax and severity

ADR-0001 set strict monochrome for the whole site, with the dark-mode reveal as the only colour event. That was too absolute for a site whose main content is code. Two exceptions are now allowed, both of them semantic:

- **Syntax highlighting** in code blocks, from the palette in [`lumirelle/vercel.nvim`](https://github.com/lumirelle/vercel.nvim): keywords/operators pink, strings green, numbers and properties blue, functions and types purple, tags and attributes green/amber, comments grey. Implemented as a real Shiki theme (`plugins/shiki-vercel-theme.ts`) rather than a `filter: grayscale()` over the old Vitesse colours, so the values are chosen, not derived.
- **Severity** in GitHub-style callouts: note/info blue, tip green, important purple, warning amber, caution red — the `[900]` accent step of each scale, flipping to the dark scale in dark mode.

Everything structural stays monochrome: canvas, surfaces, hairlines, ink levels, navigation, the Frame, the outline rail, the Splash. Hue never appears on chrome, never as decoration, and never as a hover or focus state — focus is still a 1px stroke outline.

## Considered options

- **Keep grayscale syntax** (`filter: grayscale(1)`): rejected. It preserves luminance hierarchy but throws away author intent, and it greys the container background along with the tokens.
- **Re-map Vitesse's colours to greys** at build time: rejected — it keeps a palette nobody chose, merely desaturated.
- **Tinted callout backgrounds** (the `[200]`/`[300]` steps in vercel.nvim's `background_info` / `background_warning` / …): rejected for now. A coloured rule and title carry the severity; a tinted panel would fight the flat, hairline surface language. Revisit if callouts need to read stronger.

## Consequences

- The palette has a single source of truth: `plugins/shiki-vercel-theme.ts` mirrors the `[900]` accent steps from vercel.nvim, and the callout colours in the Shell repeat the same six values. If vercel.nvim's palette moves, both move.
- Colour is now a signal, not a mood: if a future element wants colour and cannot name what it means, it does not get one.
- Contrast has to hold in both schemes. All accents are the `[900]` step, which is the step vercel.nvim itself uses for foreground text.
