export const avatarDef = {
  name: "avatar",
  props: {
    image: { type: "string", default: "" },
    label: { type: "string", default: "" },
    theme: {
      type: "string",
      values: ["gray", "blue", "green", "amber", "red", "violet"],
      default: "gray",
    },
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
      values: ["circle", "square", "squircle"],
      default: "circle",
    },
  },
  slots: ["default", "indicator", "status"],
  emits: [],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "class-variance-authority", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "class-variance-authority", "@lucide/vue"],
  },
} as const;
