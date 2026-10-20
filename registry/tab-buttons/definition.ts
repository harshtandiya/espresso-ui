export const tabButtonsDef = {
  name: "tab-buttons",
  props: {
    modelValue: { type: ["string", "number"], default: null },
    defaultValue: { type: ["string", "number"], default: null },
    options: { type: "array", default: [] },
    variant: {
      type: "string",
      values: ["subtle", "ghost", "underline", "browser-tab"],
      default: "subtle",
    },
    size: {
      type: "string",
      values: ["sm", "md"],
      default: "sm",
    },
    vertical: { type: "boolean", default: false },
    fluid: { type: "boolean", default: false },
  },
  slots: [],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
