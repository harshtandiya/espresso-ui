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
