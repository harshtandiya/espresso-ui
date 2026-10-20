export const tabTriggerDef = {
  name: "tab-trigger",
  props: {
    value: { type: ["string", "number"], required: true },
    label: { type: "string", default: "" },
    disabled: { type: "boolean", default: false },
  },
  slots: ["prefix", "default", "suffix"],
  registryDependencies: ["tabs", "tab-list"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
