export const checkboxDef = {
  name: "checkbox",
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
    indeterminate: { type: "boolean", default: false },
    id: { type: "string", default: "" },
  },
  slots: ["label", "description"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "@lucide/vue"],
  },
} as const;
