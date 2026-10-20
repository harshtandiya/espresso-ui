export const spinnerDef = {
  name: "spinner",
  props: {
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg"],
      default: "",
    },
    theme: {
      type: "string",
      values: ["gray", "red"],
      default: "",
    },
    track: { type: "boolean", default: false },
  },
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
