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
      description: "Render as a child element (React only — uses a plain <a> or <span>)",
    },
  },
  slots: ["default"],
  emits: ["click"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
