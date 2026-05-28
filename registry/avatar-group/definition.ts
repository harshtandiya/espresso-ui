export const avatarGroupDef = {
  name: "avatar-group",
  props: {
    items: { type: "array", default: [] },
    max: { type: "number", default: 5 },
    showCount: { type: "boolean", default: false },
    count: { type: "number", default: 0 },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      default: "md",
    },
  },
  slots: ["default"],
  emits: [],
  registryDependencies: ["avatar"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority", "@lucide/vue"],
  },
} as const;
