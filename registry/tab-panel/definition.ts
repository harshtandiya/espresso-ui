export const tabPanelDef = {
  name: "tab-panel",
  props: {
    value: { type: ["string", "number"], required: true },
    keepMounted: { type: "boolean", default: false },
  },
  slots: ["default"],
  registryDependencies: ["tabs"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
