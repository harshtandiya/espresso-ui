export const badgeDef = {
  name: "badge",
  props: {
    theme: {
      type: "string",
      values: [
        "gray",
        "blue",
        "green",
        "amber",
        "red",
        "violet",
        "default",
        "error",
        "warning",
        "success",
        "info",
      ],
      default: "gray",
    },
    variant: {
      type: "string",
      values: ["solid", "subtle", "outline", "ghost"],
      default: "subtle",
    },
    size: {
      type: "string",
      values: ["sm", "md", "lg"],
      default: "md",
    },
    label: { type: "string", default: "" },
  },
  slots: ["default", "prefix", "suffix"],
  emits: [],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
