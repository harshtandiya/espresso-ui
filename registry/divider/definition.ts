export const dividerDef = {
  name: "divider",
  props: {
    orientation: {
      type: "string",
      values: ["horizontal", "vertical"],
      default: "horizontal",
    },
    align: {
      type: "string",
      values: ["start", "center", "end"],
      default: "center",
    },
    flexItem: { type: "boolean", default: false },
    action: { type: "object", default: null },
  },
  registryDependencies: ["button"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
