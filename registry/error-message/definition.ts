export const errorMessageDef = {
  name: "error-message",
  props: {
    message: { type: ["string", "array", "object"], default: null },
  },
  peerDeps: {
    react: ["clsx", "tailwind-merge"],
    vue: ["clsx", "tailwind-merge"],
  },
} as const;
