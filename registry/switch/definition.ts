export const switchDef = {
  name: "switch",
  props: {
    size: {
      type: "string",
      values: ["xs", "sm", "md"],
      default: "sm",
    },
    modelValue: { type: "boolean", default: false },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: "string", default: "" },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    padded: { type: "boolean", default: false },
    controlPosition: {
      type: "string",
      values: ["start", "end"],
      default: "end",
    },
    id: { type: "string", default: "" },
  },
  slots: ["label", "description", "icon"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
