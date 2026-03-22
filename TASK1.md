We are bootstrapping **espresso-ui** — a framework-agnostic UI component library and CLI tool modelled after shadcn/ui. Read the full CLAUDE.md in this repo before doing anything else. Everything in CLAUDE.md is authoritative.

---

## Your task

Scaffold the complete monorepo skeleton as described below. Do not build any features yet — only structure, config files, and minimal boilerplate so the repo is ready to develop in.

---

## Environment prerequisites (do not run these — assume already done)

- `vp` (Vite+) is installed globally
- We are inside the empty `espresso-ui/` folder
- `git init` has already been run

---

## Step 1 — Monorepo scaffold

Run:

```
vp create vite:monorepo
```

Accept defaults when prompted. After it finishes, verify that `pnpm-workspace.yaml` and `vp.config.ts` exist at the root. If `pnpm-workspace.yaml` does not include `apps/*` and `packages/*`, edit it to:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## Step 2 — Package scaffolds

Run these from the repo root:

```
vp create vite:library --directory packages/cli
vp create vite:library --directory packages/tokens
```

For both, select **no framework** (vanilla/Node). After scaffolding:

- Set `name` in `packages/cli/package.json` to `espresso-ui` and add `"bin": { "espresso-ui": "dist/index.js" }`
- Set `name` in `packages/tokens/package.json` to `@espresso-ui/tokens`
- Both should have `"type": "module"`

---

## Step 3 — Docs app (VitePress)

```
mkdir -p apps/docs
cd apps/docs && pnpm init
pnpm add -D vitepress
npx vitepress init
```

VitePress init options:

- Root: `./`
- Site title: `espresso-ui`
- Site description: `A framework-agnostic UI component library`
- Theme: `Default Theme`
- TypeScript: `Yes`

After init, install whyframe and the demo preview plugin:

```
pnpm add -D @whyframe/core @whyframe/vue @vitepress-demo-preview/plugin @vitepress-demo-preview/component
```

Update `.vitepress/config.ts` to wire in whyframe and the preview plugin:

```ts
import { defineConfig } from "vitepress";
import { whyframe } from "@whyframe/core";
import { whyframeVue } from "@whyframe/vue";
import { containerPreview, componentPreview } from "@vitepress-demo-preview/plugin";

export default defineConfig({
  title: "espresso-ui",
  description: "A framework-agnostic UI component library",
  vite: {
    plugins: [whyframe({ defaultSrc: "/frames/vue" }), whyframeVue({ include: /\.(?:vue|md)$/ })],
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
```

Create the whyframe host pages:

`apps/docs/frames/vue.md` — empty file with frontmatter:

```md
---
layout: false
---
```

`apps/docs/frames/react.html` — minimal HTML shell:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

---

## Step 4 — Registry folder

```
mkdir -p registry/button
```

Create `registry/button/definition.ts` with this exact content:

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
} as const;
```

Leave `button.react.eta`, `button.vue.eta`, and `button.css` as empty files for now — they will be filled in a later task.

---

## Step 5 — Root package.json scripts

Ensure the root `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vp run dev",
    "build": "vp run build",
    "check": "vp check",
    "test": "vp test",
    "docs:dev": "vp run --filter apps/docs dev",
    "docs:build": "vp run --filter apps/docs build"
  }
}
```

---

## Step 6 — Install all dependencies

From the repo root:

```
vp install
```

---

## Step 7 — Verify

Run the following and confirm they exit without errors:

```
vp check
```

If there are lint or format errors from the scaffolded boilerplate, fix them with:

```
vp check --fix
```

---

## Step 8 — Initial commit

```
git add .
git commit -m "chore: initial monorepo scaffold"
```

---

## What you must NOT do

- Do not implement any CLI commands yet
- Do not write any component templates yet
- Do not add ESLint, Prettier, Biome, or tsup — `vp` handles all of this
- Do not add Next.js anywhere
- Do not create any files not listed above
- Do not install dependencies not listed above

---

## Expected final structure

```
espresso-ui/
├── apps/
│   └── docs/
│       ├── .vitepress/
│       │   └── config.ts
│       ├── frames/
│       │   ├── react.html
│       │   └── vue.md
│       ├── index.md
│       └── package.json
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   │   └── index.ts      ← empty entry point
│   │   └── package.json      ← name: espresso-ui, bin wired up
│   └── tokens/
│       ├── src/
│       │   └── index.ts      ← empty entry point
│       └── package.json      ← name: @espresso-ui/tokens
├── registry/
│   └── button/
│       ├── definition.ts
│       ├── button.react.eta  ← empty
│       ├── button.vue.eta    ← empty
│       └── button.css        ← empty
├── CLAUDE.md
├── pnpm-workspace.yaml
├── vp.config.ts
└── package.json
```

When done, print the actual file tree of what was created and confirm `vp check` passed.
