export const popoverDef = {
  name: "popover",
  props: {
    modelValue: { type: "boolean", default: null },
    defaultOpen: { type: "boolean", default: false },
    side: {
      type: "string",
      values: ["top", "right", "bottom", "left"],
      default: "bottom",
    },
    align: {
      type: "string",
      values: ["start", "center", "end"],
      default: "center",
    },
    offset: { type: "number", default: 8 },
    collisionPadding: { type: "number", default: 8 },
    dismissible: { type: "boolean", default: true },
    autoFocus: { type: "boolean", default: true },
    matchTriggerWidth: { type: "boolean", default: false },
    bare: { type: "boolean", default: false },
    arrow: { type: "boolean", default: false },
  },
  slots: ["trigger", "default"],
  emits: ["update:modelValue", "open", "close"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge"],
  },
} as const;
