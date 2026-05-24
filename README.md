# espresso-ui

A framework-agnostic UI component library, inspired by shadcn/ui. Components are not installed as a dependency — they are copied directly into your project as editable source code via the CLI.

```bash
npm install -g @espresso-ui/cli
espresso-ui init
espresso-ui add button
```

Supports **React** and **Vue**. Styled with **Tailwind CSS v4** and CSS custom properties.

Requires Node.js 22.12+.

---

## How it works

Install the CLI globally once, then run `espresso-ui init` in your project to scaffold a config file. Use `espresso-ui add <component>` to copy components straight into your codebase. You own the code from that point — edit it freely.

Theming is handled through a three-tier CSS custom property system: primitive scale → semantic intent tokens → component-scoped tokens. Dark mode works out of the box via `[data-theme="dark"]`.

---

## Development

```bash
vp check                              # lint + format + typecheck
vp test                               # run all tests
pnpm --filter @espresso-ui/cli build  # bundle CLI + registry for npm
pnpm release                          # bump version, commit, and tag
git push --follow-tags                # triggers npm publish workflow
```

Requires [pnpm](https://pnpm.io) and [Vite+](https://viteplus.dev).
