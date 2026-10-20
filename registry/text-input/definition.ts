export const textInputDef = {
  name: "text-input",
  props: {
    type: { type: "string", default: "text" },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg"],
      default: "sm",
    },
    variant: {
      type: "string",
      values: ["subtle", "outline", "ghost"],
      default: "subtle",
    },
    placeholder: { type: "string", default: "" },
    modelValue: { type: "string", default: "" },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: "string", default: "" },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    id: { type: "string", default: "" },
  },
  slots: ["prefix", "suffix", "label", "description"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
