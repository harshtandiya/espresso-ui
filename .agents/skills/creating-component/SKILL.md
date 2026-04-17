---
name: creating-component
description: Use when adding a new component to the espresso-ui registry — creating definition, templates, CSS tokens, snapshot tests, and integrating into both test apps.
---

# Creating a Component

Every component needs 5 registry files + integration in both test apps.

## 1. Registry files

```
registry/<name>/
  definition.ts       # props, slots, emits, peerDeps
  <name>.css          # component tokens
  <name>.react.eta    # React ETA template → .tsx
  <name>.vue.eta      # Vue ETA template → .vue
  <name>.test.ts      # snapshot tests
```

### definition.ts

```ts
export const <name>Def = {
  name: "<name>",
  props: { ... },
  slots: ["default"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],       // add "class-variance-authority" if variants; "@ark-ui/react" for Ark
    vue:   ["clsx", "tailwind-merge"],
  },
} as const;
```

### <name>.css

Component tokens must alias semantic tokens — never primitives, never raw hex.

```css
:root {
  --<name>-color: var(--color-foreground); /* ✅ semantic token */
  --<name>-radius: var(--radius-md); /* ✅ semantic token */
  --<name>-font-size: 14px; /* ✅ ok — no font-size semantic tokens exist */
}
```

### ETA template variables

| Variable           | Example            |
| ------------------ | ------------------ |
| `it.typescript`    | `true`             |
| `it.utilsAlias`    | `"@/lib"`          |
| `it.componentName` | `"Button"`         |
| `it.darkMode`      | `"data-attribute"` |

---

## Critical Tailwind v4 pitfalls

| Wrong                    | Correct                            | Why                             |
| ------------------------ | ---------------------------------- | ------------------------------- |
| `bg-[--color-primary]`   | `bg-(--color-primary)`             | brackets → empty rule in v4     |
| `text-(--btn-font-size)` | `[font-size:var(--btn-font-size)]` | `text-` is color, not font-size |
| `font-[--weight]`        | `font-(--weight)`                  | parentheses form is correct     |

---

## React template patterns

```tsx
// Form elements: always forwardRef
// Generic on forwardRef only — NO type annotation on callback params
export const <%= it.componentName %> = React.forwardRef<% if (it.typescript) { %><HTMLInputElement, InputProps><% } %>(
  ({ className, ...props }, ref) => { ... }  // ← no ": InputProps" here
);
<%= it.componentName %>.displayName = "<%= it.componentName %>";
```

- Use `React.ComponentPropsWithoutRef<"input">` not `InputHTMLAttributes` — correct for `asChild`
- Ark factory (Pattern A): `import { ark } from "@ark-ui/react/factory"` → `<ark.button>`
- Ark compound (Pattern B): `import { Accordion } from "@ark-ui/react/accordion"` — never barrel

## Vue template patterns

```vue
<script setup lang="ts">
   <!-- always lang="ts" regardless of it.typescript -->
const model = defineModel<string>()         // for form inputs with v-model
const props = withDefaults(defineProps<{ ... }>(), { ... })
const classes = computed(() => cn(variants({ ... }), props.class))
</script>
<template>
  <input v-model="model" :class="classes" v-bind="$attrs" />
</template>
```

- Vue template always emits `lang="ts"` — do NOT add a `typescript: false` snapshot test for Vue
- Ark factory: `<component :is="ark.button">` — dot notation is invalid in Vue templates

---

## Snapshot tests

```ts
import { describe, expect, it } from "vite-plus/test";
import { Eta } from "eta";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eta = new Eta({ views: __dirname });
const baseData = {
  typescript: true,
  darkMode: "data-attribute",
  utilsAlias: "@/lib",
  componentName: "Name",
};

describe("<name> templates", () => {
  it("renders React template", async () => {
    expect(await eta.renderAsync("./<name>.react.eta", baseData)).toMatchSnapshot();
  });
  it("renders Vue template", async () => {
    expect(await eta.renderAsync("./<name>.vue.eta", baseData)).toMatchSnapshot();
  });
  it("renders React template without TypeScript", async () => {
    expect(
      await eta.renderAsync("./<name>.react.eta", { ...baseData, typescript: false }),
    ).toMatchSnapshot();
  });
});
```

Generate initial snapshots: `pnpm vp test -u`

**Always pass full `.eta` extension** to `renderAsync` — ETA v3 won't auto-append it.

---

## Test app integration (both apps)

For each test app (`test-app/` React, `test-app-vue/` Vue):

1. Write rendered output to `src/components/<Name>.<tsx|vue>` (canonical defaults: `typescript:true`, `utilsAlias:"@/lib"`)
2. Copy `registry/<name>/<name>.css` → `src/components/<name>.css`
3. Add `@import "./components/<name>.css";` to `src/main.css`
4. Update `src/App.tsx` / `src/App.vue` with a demo section showing the component's key states

After integrating, run the `testing-component` skill to verify in the browser.

---

## Before committing

- `vp check` — format + lint + typecheck must pass
- `vp test` — all snapshots must match
- `pnpm build:registry` — regenerate `apps/docs/public/r/` output
- Does this change affect `CREATING_COMPONENTS.md`? If yes, update it in a **separate follow-up commit**.
