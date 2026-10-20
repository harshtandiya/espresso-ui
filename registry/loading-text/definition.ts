export const loadingTextDef = {
  name: "loading-text",
  props: {
    text: { type: "string", default: "Loading..." },
  },
  slots: [],
  registryDependencies: ["spinner"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
