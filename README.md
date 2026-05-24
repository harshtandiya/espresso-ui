# espresso-ui

A framework-agnostic UI component library, inspired by shadcn/ui. Components are not installed as a dependency — they are copied directly into your project as editable source code via the CLI.

```bash
npx espresso-ui init
npx espresso-ui add button
```

Supports **React** and **Vue**. Styled with **Tailwind CSS v4** and CSS custom properties.

Requires Node.js 22.12+.

---

## How it works

Run `npx espresso-ui init` to scaffold a config file, then `add` any component to copy it straight into your codebase. You own the code from that point — edit it freely.

Theming is handled through a three-tier CSS custom property system: primitive scale → semantic intent tokens → component-scoped tokens. Dark mode works out of the box via `[data-theme="dark"]`.

---

## Development

```bash
vp check          # lint + format + typecheck
vp test           # run all tests
pnpm --filter espresso-ui build   # bundle CLI + registry for npm
pnpm release                      # bump version, commit, and tag
git push --follow-tags            # triggers npm publish workflow
```

Requires [pnpm](https://pnpm.io) and [Vite+](https://viteplus.dev).
