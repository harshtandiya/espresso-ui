export const selectDef = {
  name: "select",
  props: {
    modelValue: { type: ["string", "number"], default: null },
    options: { type: "array", default: [] },
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
    placeholder: { type: "string", default: "Select option" },
    emptyText: { type: "string", default: "No options" },
    label: { type: "string", default: "" },
    description: { type: "string", default: "" },
    error: { type: "string", default: "" },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    id: { type: "string", default: "" },
  },
  slots: ["label", "description", "prefix", "suffix"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "@lucide/vue"],
  },
} as const;
