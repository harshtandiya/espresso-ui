export const tabsDef = {
  name: "tabs",
  props: {
    value: { type: ["string", "number"], default: null },
    defaultValue: { type: ["string", "number"], default: null },
    variant: {
      type: "string",
      values: ["underline", "subtle", "ghost", "browser-tab"],
      default: "underline",
    },
    size: {
      type: "string",
      values: ["sm", "md"],
      default: "sm",
    },
    vertical: { type: "boolean", default: false },
    orientation: {
      type: "string",
      values: ["horizontal", "vertical"],
      default: null,
    },
  },
  slots: ["default"],
  emits: ["update:modelValue"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
