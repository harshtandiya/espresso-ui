export const tooltipDef = {
  name: "tooltip",
  props: {
    text: { type: "string", default: "" },
    hoverDelay: { type: "number", default: 500 },
    side: {
      type: "string",
      values: ["top", "right", "bottom", "left"],
      default: "top",
    },
    offset: { type: "number", default: 4 },
    bare: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  slots: ["default", "content"],
  peerDeps: {
    react: ["@ark-ui/react"],
    vue: ["@ark-ui/vue"],
  },
} as const;
