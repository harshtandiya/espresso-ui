# Creating a Component

This guide walks through adding a new component to espresso-ui from scratch, using **Avatar** as the example. By the end you'll have a fully working component that users can copy into their project with `espresso-ui add avatar`.

---

## The five files you need

Every component lives at `registry/<name>/` and consists of:

```
registry/avatar/
├── definition.ts        # metadata: props, slots, emits, peer deps
├── avatar.css           # component-scoped CSS custom properties
├── avatar.react.eta     # ETA template → Avatar.tsx
├── avatar.vue.eta       # ETA template → Avatar.vue
└── avatar.test.ts       # snapshot tests for both templates
```

Create the directory first:

```bash
mkdir registry/avatar
```

---

## 1. `definition.ts`

Describes the component in a framework-neutral way. The CLI reads this to know what peer packages to install.

```ts
export const avatarDef = {
  name: "avatar",
  props: {
    src: { type: "string", default: "" },
    alt: { type: "string", default: "" },
    fallback: { type: "string", default: "" },
    size: {
      type: "string",
      values: ["sm", "md", "lg"],
      default: "md",
    },
  },
  slots: ["fallback"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
```

**Rules:**

- No framework-specific code here. Templates handle that.
- `peerDeps` lists packages the generated file will `import` from. The CLI installs them automatically.

---

## 2. `avatar.css`

Component-scoped CSS custom properties. These are the only values your templates should reference — never raw colors or sizes.

**Every token must alias a semantic token, never a primitive directly.**

```css
/* Avatar component tokens — override these to customise the avatar. */
:root {
  --avatar-sm-size: 32px;
  --avatar-md-size: 40px;
  --avatar-lg-size: 56px;

  --avatar-radius: var(--radius-full);
  --avatar-bg: var(--color-muted);
  --avatar-fg: var(--color-muted-foreground);
  --avatar-border: var(--color-border);
}
```

The available semantic tokens come from `packages/tokens/src/semantic.json` — things like `--color-primary`, `--color-background`, `--color-border`, `--radius-sm` through `--radius-full`, etc.

---

## 3. `avatar.react.eta`

An ETA template that renders to a `.tsx` file. Use `<% %>` for logic, `<%= %>` for output.

**Template variables injected by the CLI:**
| Variable | Example value |
|---|---|
| `it.typescript` | `true` |
| `it.componentName` | `"Avatar"` |
| `it.utilsAlias` | `"@/lib"` |

```tsx
import { cva<% if (it.typescript) { %>, type VariantProps<% } %> } from "class-variance-authority";
import { cn } from "<%= it.utilsAlias %>/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-(--avatar-radius) bg-(--avatar-bg)",
  {
    variants: {
      size: {
        sm: "size-(--avatar-sm-size)",
        md: "size-(--avatar-md-size)",
        lg: "size-(--avatar-lg-size)",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
<% if (it.typescript) { %>
export type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: VariantProps<typeof avatarVariants>["size"];
  className?: string;
};
<% } %>
export function <%= it.componentName %>({
  src,
  alt = "",
  fallback,
  size,
  className,
}<% if (it.typescript) { %>: AvatarProps<% } %>) {
  return (
    <span className={cn(avatarVariants({ size }), className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-(--avatar-fg) font-medium select-none">
          {fallback}
        </span>
      )}
    </span>
  );
}
```

**Key rules for templates:**

- Use `(--token-name)` for CSS variable references in Tailwind utilities — not `[--token-name]`. The bracket form generates empty rules in Tailwind v4.
- For **font-size** tokens specifically, use `[font-size:var(--token)]` instead of `text-(--token)`. The `text-` prefix is treated as a color utility by both Tailwind and tailwind-merge, which will silently drop your actual text-color class.
- **cva output is not run through tailwind-merge.** When you assign `variants({...})` straight to `className` (or `:class`), conflicting classes from two variant axes both survive. For example a `shape: { circle }` axis emitting `rounded-full` will not override a `size` axis emitting `rounded-(--x-radius)`. Do not patch this with `!important` (`!rounded-full`) — make the classes mutually exclusive with `compoundVariants` instead (keep the overriding class in one axis and move the conflicting per-size class into `compoundVariants` keyed on the other axis).
- To size an icon a consumer passes through a slot or `children` (status badges, overlays), size it from the wrapper with a descendant utility — `[&_svg]:size-(--token)` — rather than relying on the consumer to size it.
- Never hardcode colors or sizes. Route everything through CSS custom properties.

---

## Two patterns for Ark UI

Every component in espresso-ui uses one of two Ark UI patterns depending on its complexity.

### Pattern A — `ark` factory (styled HTML elements)

Use for: Button, Input, Label, Badge, and any component that is fundamentally a styled HTML element that needs polymorphic rendering (`asChild`).

The `ark` factory creates enhanced HTML elements that support `asChild`. When `asChild={false}` (default), the element behaves identically to the native HTML element — zero overhead. When `asChild={true}`, it renders its single child element instead, merging all props and class names onto that child.

```tsx
// Renders as <a href="/dashboard"> with all button styles applied
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

**React:**

```tsx
import { ark } from "@ark-ui/react/factory"

// Use ark.button instead of <button>
<ark.button asChild={asChild} className={cn(variants({ ... }), className)} {...props} />
```

**Vue:**

```vue
<script setup>
import { ark } from "@ark-ui/vue/factory";
</script>
<template>
  <!-- <ark.button> is invalid Vue syntax — use component :is instead -->
  <component :is="ark.button" :as-child="asChild" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
```

**peerDeps for Pattern A components:**

```ts
peerDeps: {
  react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority"],
  vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority"],
}
```

**TypeScript prop type for React (Pattern A):**

```tsx
// Import React types as named imports — never use the `React.*` namespace.
// `verbatimModuleSyntax` rejects bare namespace references with `Cannot find namespace 'React'`.
<% if (it.typescript) { %>import type { ComponentPropsWithoutRef } from "react";
<% } %>

// Use ComponentPropsWithoutRef<typeof ark.button>, NOT ButtonHTMLAttributes<HTMLButtonElement>.
// Reason: when asChild=true the element is no longer a <button>, so ButtonHTMLAttributes
// would incorrectly reject props like href that are valid on the child element.
export type ButtonProps = ComponentPropsWithoutRef<typeof ark.button> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
```

**React import rule:** Templates must use named imports (`import { forwardRef } from "react"`, `import type { ComponentPropsWithoutRef } from "react"`) — never `import * as React` plus `React.foo`. The `registry/registry.test.ts` guard fails any rendered output containing a bare `React.` reference. Gate type-only imports on `it.typescript` so the JS render path stays clean.

### Pattern B — Ark compound components (stateful UI)

Use for: Accordion, Dialog, Select, Tooltip, Tabs, Popover, Toast.

Import from the component sub-path (never the barrel):

```ts
import { Accordion } from "@ark-ui/react/accordion"; // correct
import { Accordion } from "@ark-ui/react"; // never — pulls in all machines
```

This pattern is documented when the first compound component is built.

---

## 4. `avatar.vue.eta`

The Vue SFC equivalent. Uses `defineProps`, `computed`, and `withDefaults`.

```vue
<script setup lang="ts">
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "<%= it.utilsAlias %>/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-(--avatar-radius) bg-(--avatar-bg)",
  {
    variants: {
      size: {
        sm: "size-(--avatar-sm-size)",
        md: "size-(--avatar-md-size)",
        lg: "size-(--avatar-lg-size)",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AvatarVariants = VariantProps<typeof avatarVariants>;

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    fallback?: string;
    size?: AvatarVariants["size"];
    class?: string;
  }>(),
  {
    alt: "",
    fallback: "",
    size: "md",
  },
);

const classes = computed(() => cn(avatarVariants({ size: props.size }), props.class));
</script>

<template>
  <span :class="classes">
    <img v-if="src" :src="src" :alt="alt" class="aspect-square h-full w-full object-cover" />
    <span
      v-else
      class="flex h-full w-full items-center justify-center text-(--avatar-fg) font-medium select-none"
    >
      {{ fallback }}
    </span>
  </span>
</template>
```

---

## 5. `avatar.test.ts`

Snapshot tests confirm both templates render without errors and lock in their output. The test runner is Vitest via `vite-plus/test`.

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
  componentName: "Avatar",
};

describe("avatar templates", () => {
  it("renders React template", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders Vue template", async () => {
    const result = await eta.renderAsync("./avatar.vue.eta", baseData);
    expect(result).toMatchSnapshot();
  });

  it("renders React template without TypeScript", async () => {
    const result = await eta.renderAsync("./avatar.react.eta", {
      ...baseData,
      typescript: false,
    });
    expect(result).toMatchSnapshot();
  });
});
```

> **Note:** Always pass the full `.eta` extension to `renderAsync`. ETA v3 does not auto-append it if the path already has an extension (like `.react`).

Run the tests once to generate snapshots:

```bash
vp test
```

After that, re-run on every change to catch regressions.

---

## Wiring it up in the CLI

Open `packages/cli/src/commands/add.ts` and add `"avatar"` to the list of known components (however that registry lookup is structured). The `add` command will then:

1. Look up `registry/avatar/definition.ts` for peer deps
2. Render `avatar.react.eta` or `avatar.vue.eta` depending on the user's config
3. Write the generated file to the user's components directory
4. Copy `avatar.css` alongside it
5. Install the peer deps listed in `definition.ts`

---

## Checklist

Before opening a PR:

- [ ] `registry/avatar/definition.ts` — props, slots, emits, peerDeps
- [ ] `registry/avatar/avatar.css` — all tokens alias semantic vars, not primitives
- [ ] `registry/avatar/avatar.react.eta` — renders valid TSX/JSX, no hardcoded values
- [ ] `registry/avatar/avatar.vue.eta` — renders valid SFC, no hardcoded values
- [ ] `registry/avatar/avatar.test.ts` — snapshots generated and passing
- [ ] `vp check` passes (format + lint + typecheck)
- [ ] `vp test` passes
