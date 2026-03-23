# espresso-ui

A framework-agnostic UI component library, inspired by shadcn/ui. Components are not installed as a dependency — they are copied directly into your project as editable source code via the CLI.

```bash
npx espresso-ui add button
```

Supports **React** and **Vue**. Styled with **Tailwind CSS v4** and CSS custom properties.

---

## How it works

Run `npx espresso-ui init` to scaffold a config file, then `add` any component to copy it straight into your codebase. You own the code from that point — edit it freely.

Theming is handled through a three-tier CSS custom property system: primitive scale → semantic intent tokens → component-scoped tokens. Dark mode works out of the box via `[data-theme="dark"]`.

---

## Development

```bash
vp check          # lint + format + typecheck
vp test           # run all tests
vp pack           # bundle CLI and tokens for npm
```

Requires [pnpm](https://pnpm.io) and [Vite+](https://viteplus.dev).
