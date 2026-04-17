export const labelDef = {
  name: "label",
  props: {
    disabled: { type: "boolean", default: false },
  },
  slots: ["default"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
