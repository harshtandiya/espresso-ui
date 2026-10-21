export const dropdownMenuDef = {
  name: "dropdown-menu",
  props: {
    items: { type: "array", default: [] },
    side: {
      type: "string",
      values: ["top", "right", "bottom", "left"],
      default: "bottom",
    },
    align: {
      type: "string",
      values: ["start", "center", "end"],
      default: "start",
    },
    offset: { type: "number", default: 6 },
  },
  slots: ["trigger", "default"],
  emits: ["select"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge"],
  },
} as const;
