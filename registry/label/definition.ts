export const labelDef = {
  name: "label",
  props: {
    label: { type: "string", default: "" },
    for: { type: "string", default: "" },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  slots: ["default"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
