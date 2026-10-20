export const buttonDef = {
  name: "button",
  props: {
    theme: {
      type: "string",
      values: ["gray", "blue", "green", "red"],
      default: "gray",
    },
    variant: {
      type: "string",
      values: ["solid", "subtle", "outline", "ghost", "link"],
      default: "subtle",
    },
    size: {
      type: "string",
      values: ["xs", "sm", "md", "lg"],
      default: "sm",
    },
    label: { type: "string", default: "" },
    href: { type: "string", default: "" },
    type: {
      type: "string",
      values: ["button", "submit", "reset"],
      default: "button",
    },
    loading: { type: "boolean", default: false },
    loadingText: { type: "string", default: "" },
    disabled: {
      type: "boolean",
      default: false,
    },
    asChild: {
      type: "boolean",
      default: false,
      description:
        "Render the button's child element instead, forwarding all styles and props (uses Ark's slot mechanism)",
    },
  },
  slots: ["default", "prefix", "icon", "suffix"],
  emits: ["click"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority"],
  },
} as const;
