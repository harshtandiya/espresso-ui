export const ratingDef = {
  name: "rating",
  props: {
    modelValue: { type: "number", default: 0 },
    defaultValue: { type: "number", default: 0 },
    max: { type: "number", default: 5 },
    step: { type: "number", values: [1, 0.5], default: 1 },
    disabled: { type: "boolean", default: false },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg"],
      default: "sm",
    },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: ["string", "array", "object"], default: null },
    required: { type: "boolean", default: false },
    icon: { type: ["string", "object"], default: null },
  },
  slots: ["label", "description", "icon"],
  emits: ["update:modelValue"],
  registryDependencies: ["label", "error-message"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
