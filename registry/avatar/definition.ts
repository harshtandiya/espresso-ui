export const avatarDef = {
  name: "avatar",
  props: {
    src: { type: "string", default: "" },
    alt: { type: "string", default: "" },
    fallback: { type: "string", default: "" },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      default: "md",
    },
    shape: {
      type: "string",
      values: ["squircle", "circle"],
      default: "squircle",
    },
  },
  slots: ["status"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority", "@lucide/vue"],
  },
} as const;
