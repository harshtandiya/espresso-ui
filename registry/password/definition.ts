export const passwordDef = {
  name: "password",
  props: {
    defaultVisible: { type: "boolean", default: false },
    showEye: { type: "boolean", default: true },
  },
  slots: [],
  registryDependencies: ["text-input", "tooltip", "keyboard-shortcut"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "@lucide/vue"],
  },
} as const;
