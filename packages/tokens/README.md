# @espresso-ui/tokens

**Private, internal workspace package — not published to npm.**

Design token source of truth for espresso-ui: primitives, semantic CSS variables, and a Tailwind v4 `@theme` block.

- `src/primitives.json` — raw scale (colors, spacing, radii, fonts)
- `src/semantic.json` — intent layer (`--color-primary`, `--color-bg`, …)
- `src/sd.config.ts` — Style Dictionary build → `dist/{primitives,tokens,tailwind}.css`
- `src/index.ts` — typed JS surface (`primitives`, `semantic`, `cssVar`)

## Who consumes this

Only the docs site (`apps/docs`), via `workspace:*` — for the CSS imports and the foundation panels that read `primitives`.

End users install `@espresso-ui/cli` globally. `espresso-ui init` inlines the same tokens directly into the user's generated CSS file via `packages/cli/src/themes/default.ts`.

## Scripts

```bash
pnpm generate   # rebuild dist CSS from the JSON token sources
pnpm build      # vp pack + generate
pnpm test       # vitest
```
