# Button

A flexible, accessible button component with multiple variants and sizes.

## Installation

::: code-group

```sh [npm]
npx espresso-ui add button
```

```sh [pnpm]
pnpm dlx espresso-ui add button
```

:::

## Usage

::: code-group

```tsx [React]
import { Button } from "@/components/Button";

export default function App() {
  return <Button>Click me</Button>;
}
```

```vue [Vue]
<script setup>
import Button from "@/components/Button.vue";
</script>

<template>
  <Button>Click me</Button>
</template>
```

:::

## Variants

<preview path="./demos/ButtonVariants.vue" />

## Sizes

<preview path="./demos/ButtonSizes.vue" />

## Disabled

<preview path="./demos/ButtonDisabled.vue" />

## Props

| Prop       | Type                                        | Default   | Description                                    |
| ---------- | ------------------------------------------- | --------- | ---------------------------------------------- |
| `variant`  | `"solid" \| "outline" \| "ghost" \| "link"` | `"solid"` | Visual style of the button                     |
| `size`     | `"sm" \| "md" \| "lg"`                      | `"md"`    | Size of the button                             |
| `disabled` | `boolean`                                   | `false`   | Disables interaction and reduces opacity       |
| `asChild`  | `boolean`                                   | `false`   | Render as child element — React only           |
| `class`    | `string`                                    | —         | Additional classes merged via `tailwind-merge` |

## Theming

Button appearance is controlled entirely through CSS custom properties. Override any token in your own CSS to customise the look without touching the component source.

```css
/* In your global CSS or a scoped style block */
:root {
  --btn-solid-bg: var(--color-primary);
  --btn-solid-fg: white;
  --btn-solid-bg-hover: color-mix(in oklch, var(--color-primary) 85%, black);
  --btn-radius: var(--radius-md);

  /* Size dimensions */
  --btn-sm-height: 1.75rem;
  --btn-sm-px: 0.625rem;
  --btn-sm-font-size: 0.75rem;

  --btn-md-height: 2.25rem;
  --btn-md-px: 1rem;
  --btn-md-font-size: 0.875rem;

  --btn-lg-height: 2.75rem;
  --btn-lg-px: 1.25rem;
  --btn-lg-font-size: 1rem;
}
```
