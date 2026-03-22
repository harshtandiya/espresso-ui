# CLAUDE.md

This file provides context for AI agents working in this repository. Read it fully before making any changes.

---

## What this project is

**espresso-ui** is a framework-agnostic UI component library and CLI tool, inspired by shadcn/ui. Components are not published as an npm package — they are copied directly into the user's project as editable source code via the CLI.

Supported output frameworks: **React** and **Vue**.
Styling: **Tailwind CSS v4** with CSS custom properties for theming.
CLI invocation: `npx espresso-ui <command>`

---

## Monorepo structure

```
espresso-ui/
├── apps/
│   └── docs/                        # VitePress docs site
│       ├── .vitepress/
│       │   ├── config.ts
│       │   └── theme/index.ts
│       ├── frames/
│       │   ├── react.html           # whyframe iframe host for React previews
│       │   └── vue.md               # whyframe iframe host for Vue previews
│       └── components/              # one .md file per component
├── packages/
│   ├── cli/                         # the npx-able CLI (what users run)
│   │   └── src/
│   │       ├── commands/
│   │       │   ├── init.ts          # scaffold espresso.config.json, install deps
│   │       │   ├── add.ts           # detect framework, render template, write file
│   │       │   └── theme.ts         # list / add / init custom themes
│   │       └── preset/
│   │           ├── schema.ts        # FROZEN — field order and bit offsets never change
│   │           ├── encode.ts        # config object → base62 preset string
│   │           └── decode.ts        # base62 preset string → config object
│   └── tokens/                      # design token source of truth
│       ├── primitives.json          # raw scale: colors, spacing, radii, fonts
│       ├── semantic.json            # intent layer: --color-primary, --color-bg, etc.
│       └── sd.config.ts             # Style Dictionary config → CSS + Tailwind v4 output
├── registry/                        # component definitions and code templates
│   └── button/
│       ├── definition.ts            # props, variants, slots, emits, peer deps
│       ├── button.react.eta         # ETA template → Button.tsx
│       ├── button.vue.eta           # ETA template → Button.vue
│       └── button.css               # component-scoped CSS custom property overrides
├── turbo.json                       # Turborepo — remote cache config only
├── pnpm-workspace.yaml
└── vp.config.ts                     # Vite+ unified toolchain config (lint, format, test, pack)
```

---

## Toolchain

This project uses **Vite+** (`vp`) as the unified toolchain. Do not add separate ESLint, Prettier, or tsup configs — they are all handled by `vp`.

| Command           | What it does                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| `vp check`        | Format (Oxfmt) + lint (Oxlint) + type-check (tsgo) in one pass          |
| `vp check --fix`  | Auto-fix formatting and lint errors                                     |
| `vp test`         | Run all tests via Vitest (Browser Mode for component tests)             |
| `vp pack`         | Bundle `packages/cli` and `packages/tokens` for npm via Rolldown/tsdown |
| `vp run <script>` | Run workspace scripts with dependency-aware caching                     |

Always run `vp check` before committing. CI will fail if it does not pass.

---

## CLI architecture (`packages/cli`)

### Key dependencies

- **Commander.js** — command definitions (`init`, `add`, `theme`)
- **Clack** (`@clack/prompts`) — interactive prompts, spinners, progress
- **ETA** — template engine for React/Vue code generation
- **Zod** — runtime validation of `espresso.config.json`

### The `add` command flow

1. Load and validate `espresso.config.json` via Zod
2. Detect framework from config (`react` | `vue`)
3. Fetch component `definition.ts` from the registry
4. Render the correct ETA template (`button.react.eta` or `button.vue.eta`)
5. Resolve output path from config aliases
6. Write the generated file to the user's project
7. Install any peer deps declared in `definition.ts`

### `espresso.config.json` shape

```json
{
  "framework": "react",
  "typescript": true,
  "styleEngine": "tailwind",
  "theme": {
    "default": "espresso",
    "customThemePath": null,
    "darkMode": "data-attribute"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Framework detection

Framework is read from `espresso.config.json`. If absent, the CLI sniffs `package.json` dependencies for `react` or `vue` and prompts the user to confirm. Never guess silently — always confirm with the user when auto-detecting.

---

## Registry (`registry/`)

### Component definition shape (`definition.ts`)

```ts
export const buttonDef = {
  name: "button",
  props: {
    variant: { type: "string", values: ["solid", "outline", "ghost"], default: "solid" },
    size: { type: "string", values: ["sm", "md", "lg"], default: "md" },
    disabled: { type: "boolean", default: false },
  },
  slots: ["default"],
  emits: ["click"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority"],
  },
};
```

### ETA template conventions

- React templates output `.tsx` using `cva` for variant logic and `cn()` (clsx + tailwind-merge) for className merging.
- Vue templates output `.vue` SFCs using `defineProps`, `computed`, and a `<style scoped>` block that reads component CSS tokens.
- Templates must never hardcode color values. All visual tokens must go through CSS custom properties.
- Template filenames: `<component>.react.eta` and `<component>.vue.eta`.

### Adding a new component

1. Create `registry/<name>/` directory
2. Write `definition.ts` with full prop/variant/slot/emit spec
3. Write `<name>.react.eta` and `<name>.vue.eta`
4. Write `<name>.css` with component-scoped token overrides (e.g. `--btn-bg`, `--btn-radius`)
5. Add a Vitest snapshot test in `registry/<name>/<name>.test.ts` that renders both templates and asserts output

---

## Theming system

### Three-tier token hierarchy

1. **Primitives** (`tokens/primitives.json`) — raw scale, never used directly in components
2. **Semantic tokens** (`tokens/semantic.json`) — intent layer (`--color-primary`, `--color-bg`, etc.), consumed by Tailwind v4 `@theme` and component CSS
3. **Component tokens** (`registry/<name>/<name>.css`) — local overrides scoped to one component (e.g. `--btn-bg: var(--color-primary)`)

Style Dictionary transforms primitives + semantic tokens into:

- `tokens.css` — CSS custom properties on `:root` and `[data-theme="dark"]`
- A Tailwind v4 plugin file — feeds `@theme` so utility classes like `bg-primary` work

### Theme files

Each theme is a single CSS file that remaps semantic tokens:

```css
[data-theme="espresso"] {
  --color-primary: #6f4e37;
  --radius-component: var(--radius-lg);
}
```

Dark mode is handled via `[data-theme="dark"]` on `<html>` by default. The `darkMode` field in `espresso.config.json` can switch this to `"class"` or `"media-query"`.

### Preset encoding

The `--preset` flag encodes the full theme config as a base62 string using bit-packing:

- Each config field maps to a fixed bit offset in a BigInt (`schema.ts`)
- **The field order and bit offsets in `schema.ts` are frozen forever.** Adding new fields appends to the end. Never reorder or remove existing fields — this would break all existing preset strings.
- Encode: config object → BigInt via bit shifts → base62 string
- Decode: base62 string → BigInt → extract each field by mask and offset

---

## Docs site (`apps/docs`)

Built with **VitePress**. Do not introduce Next.js or any server-side runtime.

### Component previews

- **whyframe** renders component examples in true iframes at the bundler level, isolating React and Vue runtimes from VitePress's Vue runtime.
- React previews use `frames/react.html` as the iframe host.
- Vue previews use `frames/vue.md` as the iframe host.
- `postcssIsolateStyles` (built into VitePress) scopes docs CSS away from previewed components.
- Use `:::preview` blocks in `.md` files via `@vitepress-demo-preview/plugin`.

### Writing docs pages

- One `.md` file per component under `docs/components/`
- Each page must include: description, props table, at least one React preview, at least one Vue preview, and a usage code block.
- Do not hardcode theme values in docs examples — use semantic token names.

---

## Code conventions

### TypeScript

- Strict mode enabled everywhere. No `any` unless explicitly justified with a comment.
- Prefer `type` over `interface` for object shapes. Use `interface` only for extensible public API contracts.
- All exported functions must have explicit return types.

### Naming

- Component files: PascalCase (`Button.tsx`, `Button.vue`)
- Registry definitions and templates: kebab-case (`button.react.eta`)
- CSS custom property tokens: `--espresso-*` namespace for public tokens, `--<component>-*` for component-scoped tokens (e.g. `--btn-bg`)
- CLI commands: kebab-case (`espresso-ui add`, `espresso-ui theme init`)

### CSS / Tailwind

- Never hardcode hex values in component files or templates. Always use CSS custom properties.
- Use `cn()` (clsx + tailwind-merge) for all className construction in generated components.
- Use `cva` for variant logic. Variant definitions live inside the generated file, not in the registry definition.
- Component tokens must always alias semantic tokens, never primitives directly.

### Git

- Commit messages: conventional commits format (`feat:`, `fix:`, `chore:`, `docs:`)
- Each new component gets its own PR with definition, both templates, CSS tokens, and a docs page.
- Run `vp check` and `vp test` before pushing. CI will block merges on failures.

---

## What NOT to do

- **Do not publish component code to npm.** The entire model is code-copying into the user's project. The only things published to npm are the `espresso-ui` CLI binary and the `@espresso-ui/tokens` CSS package.
- **Do not add ESLint, Prettier, or standalone Biome configs.** `vp check` handles all of this.
- **Do not add tsup config.** `vp pack` handles bundling.
- **Do not use Next.js anywhere**, including in the docs site.
- **Do not hardcode framework-specific code in `definition.ts`.** Definitions are framework-neutral. Framework-specific code belongs only in `.eta` templates.
- **Do not change field order or bit offsets in `preset/schema.ts`.** This is a permanent backward-compatibility contract.
- **Do not add runtime CSS-in-JS libraries.** All styling is static CSS custom properties + Tailwind utilities.
- **Do not use `any` without a comment explaining why.**
