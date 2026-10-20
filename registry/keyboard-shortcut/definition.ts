export const keyboardShortcutDef = {
  name: "keyboard-shortcut",
  props: {
    combo: { type: "string", default: "" },
    bg: { type: "boolean", default: false },
    showPlus: { type: ["boolean", "string"], default: "auto" },
    altCombos: { type: "array", default: [] },
    useIcons: { type: "boolean", default: true },
  },
  slots: ["default"],
  peerDeps: {
    react: ["clsx", "tailwind-merge", "lucide-react"],
    vue: ["clsx", "tailwind-merge", "@lucide/vue"],
  },
} as const;
