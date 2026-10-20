export const radioGroupDef = {
  name: "radio-group",
  props: {
    modelValue: { type: ["string", "number", "boolean"], default: null },
    defaultValue: { type: ["string", "number", "boolean"], default: null },
    size: {
      type: "string",
      values: ["xs", "sm", "md"],
      default: "sm",
    },
    padded: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    orientation: {
      type: "string",
      values: ["vertical", "horizontal"],
      default: "vertical",
    },
    loop: { type: "boolean", default: true },
    name: { type: "string", default: "" },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: "string", default: "" },
    required: { type: "boolean", default: false },
  },
  slots: ["label", "description"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
