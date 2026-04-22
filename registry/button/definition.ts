export const buttonDef = {
  name: "button",
  props: {
    variant: {
      type: "string",
      values: ["solid", "outline", "ghost", "link"],
      default: "solid",
    },
    size: {
      type: "string",
      values: ["sm", "md", "lg"],
      default: "md",
    },
    disabled: {
      type: "boolean",
      default: false,
    },
    asChild: {
      type: "boolean",
      default: false,
      description:
        "Render the button's child element instead, forwarding all styles and props (uses Ark's slot mechanism)",
    },
  },
  slots: ["default"],
  emits: ["click"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
