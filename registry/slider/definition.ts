export const sliderDef = {
  name: "slider",
  props: {
    modelValue: { type: "array", default: null },
    defaultValue: { type: "array", default: null },
    min: { type: "number", default: 0 },
    max: { type: "number", default: 100 },
    step: { type: "number", default: 1 },
    size: {
      type: "string",
      values: ["sm", "md"],
      default: "sm",
    },
    disabled: { type: "boolean", default: false },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: ["string", "array", "object"], default: null },
    required: { type: "boolean", default: false },
  },
  slots: [],
  emits: ["update:modelValue", "value-commit"],
  registryDependencies: ["label", "error-message"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge"],
  },
} as const;
