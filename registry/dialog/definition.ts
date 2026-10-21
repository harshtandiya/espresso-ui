export const dialogDef = {
  name: "dialog",
  props: {
    open: { type: "boolean", default: null },
    modelValue: { type: "boolean", default: null },
    title: { type: "string", default: "" },
    message: { type: "string", default: "" },
    icon: { type: ["string", "object"], default: null },
    theme: {
      type: "string",
      values: ["gray", "blue", "green", "amber", "red"],
      default: "gray",
    },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"],
      default: "lg",
    },
    position: {
      type: "string",
      values: ["center", "top"],
      default: "center",
    },
    dismissible: { type: "boolean", default: true },
    showCloseButton: { type: "boolean", default: true },
    bare: { type: "boolean", default: false },
    actions: { type: "array", default: [] },
  },
  slots: ["default", "title", "actions", "trigger"],
  emits: ["update:open", "update:modelValue", "close"],
  registryDependencies: ["button"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "lucide-react"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "@lucide/vue"],
  },
} as const;
