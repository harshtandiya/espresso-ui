export const textareaDef = {
  name: "textarea",
  props: {
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
    modelValue: { type: "string", default: "" },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: "string", default: "" },
    rows: { type: "number", default: 3 },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    id: { type: "string", default: "" },
  },
  slots: ["label", "description"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
