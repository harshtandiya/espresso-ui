<script setup lang="ts">
import { computed } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--btn-ring) focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-(--btn-disabled-opacity) [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid:
          "bg-(--btn-solid-bg) text-(--btn-solid-fg) hover:bg-(--btn-solid-bg-hover) [box-shadow:var(--btn-solid-shadow)]",
        outline:
          "border border-(--btn-outline-border) text-(--btn-outline-fg) hover:bg-(--btn-outline-bg-hover)",
        ghost: "text-(--btn-ghost-fg) hover:bg-(--btn-ghost-bg-hover)",
        link: "text-(--btn-link-fg) underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-(--btn-sm-height) px-(--btn-sm-px) [font-size:var(--btn-sm-font-size)] rounded-(--btn-radius)",
        md: "h-(--btn-md-height) px-(--btn-md-px) [font-size:var(--btn-md-font-size)] rounded-(--btn-radius)",
        lg: "h-(--btn-lg-height) px-(--btn-lg-px) [font-size:var(--btn-lg-font-size)] rounded-(--btn-radius)",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    disabled?: boolean;
    class?: string;
  }>(),
  { variant: "solid", size: "md", disabled: false },
);

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
  <button :class="classes" :disabled="disabled" v-bind="$attrs">
    <slot />
  </button>
</template>
