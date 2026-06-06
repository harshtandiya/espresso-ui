export const badgeDef = {
  name: "badge",
  props: {
    theme: {
      type: "string",
      values: ["default", "error", "warning", "success", "info"],
      default: "default",
    },
    variant: {
      type: "string",
      values: ["solid", "subtle", "outline", "ghost"],
      default: "solid",
    },
    size: {
      type: "string",
      values: ["sm", "md", "lg"],
      default: "md",
    },
  },
  slots: ["default", "prefix", "suffix"],
  emits: [],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
