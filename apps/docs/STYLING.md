# Docs site styling

The docs site uses **Tailwind CSS v4** with semantic design tokens (`--color-*`, `--font-*`). Registry component previews and the docs shell share the same token vocabulary.

## Conventions

### Prefer Tailwind utilities

Layout, spacing, typography, and colors on docs shell components (panels, layout chrome, variant rows) should use Tailwind utility classes — not scoped Astro `<style>` blocks.

Follow `Preview.astro` as the reference pattern:

```astro
<div class="flex items-center gap-3 border border-(--color-line) bg-(--color-surface)">
```

### Semantic tokens only

Never hardcode hex or primitive color values in shell components. Use token-backed utilities:

| Property   | Utility form            |
| ---------- | ----------------------- |
| Background | `bg-(--color-surface)`  |
| Text       | `text-(--color-ink-1)`  |
| Border     | `border-(--color-line)` |

Always use `(--var)` syntax — **not** `[--var]`. The bracket form generates empty rules in Tailwind v4.

For font-size tokens, use `[font-size:var(--token)]` instead of `text-(--token)` (the `text-` prefix is interpreted as color).

### When scoped CSS is still OK

Keep a minimal scoped `<style>` block when:

- The pattern has no clean utility equivalent (e.g. canvas grid background in `Canvas.astro`)
- Styling targets third-party markup via `:global()` (e.g. Shiki output in `CodeBlock.astro`)
- A one-off is genuinely simpler in plain CSS and won't be reused

### Responsive breakpoints

Mobile overrides use `max-md:` (768px). Shared spacing tokens live in `src/styles/mobile.css` (`--mobile-gutter`, etc.).

### Migration status

Panel primitives (`Panel`, `VariantRow`, `Variants`, `Canvas`, `CanvasToolbar`, `DetailMeta`, `Crumb`) are migrated. Foundation panels, sidebar, and mobile shell are incremental follow-ups — see issue #25.
