export const radioDef = {
  name: "radio",
  props: {
    value: { type: ["string", "number", "boolean"], required: true },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    disabled: { type: "boolean", default: false },
    id: { type: "string", default: "" },
  },
  slots: ["label", "description"],
  registryDependencies: ["radio-group"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
