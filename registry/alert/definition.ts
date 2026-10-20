export const alertDef = {
  name: "alert",
  props: {
    title: { type: "string", default: "" },
    description: { type: "string", default: "" },
    theme: {
      type: "string",
      values: ["gray", "blue", "green", "amber", "red"],
      default: "gray",
    },
    icon: { type: ["boolean", "string", "object"], default: null },
    primaryAction: { type: "object", default: null },
    secondaryAction: { type: "object", default: null },
    dismissible: { type: "boolean", default: false },
  },
  slots: ["prefix", "title", "description", "actions"],
  emits: ["dismiss"],
  registryDependencies: ["button"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
