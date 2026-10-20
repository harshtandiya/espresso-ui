export const tabListDef = {
  name: "tab-list",
  props: {
    variant: {
      type: "string",
      values: ["underline", "subtle", "ghost", "browser-tab"],
      default: null,
    },
    size: {
      type: "string",
      values: ["sm", "md"],
      default: null,
    },
  },
  slots: ["default"],
  registryDependencies: ["tabs"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
