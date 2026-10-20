export const progressDef = {
  name: "progress",
  props: {
    value: { type: "number", required: true },
    size: {
      type: "string",
      values: ["sm", "md", "lg", "xl"],
      default: "sm",
    },
    label: { type: "string", default: "" },
    hint: { type: "boolean", default: false },
    intervals: { type: "number", default: 0 },
  },
  slots: ["hint"],
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
