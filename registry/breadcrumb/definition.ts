export const breadcrumbDef = {
  name: "breadcrumb",
  props: {
    size: {
      type: "string",
      values: ["sm", "md"],
      default: "md",
    },
    separator: {
      type: "string",
      values: ["slash", "chevron"],
      default: "slash",
    },
    maxItems: {
      type: "number",
      default: undefined,
      description:
        "Maximum visible breadcrumb items (links/pages). Middle items collapse into an ellipsis menu when exceeded",
    },
    itemsBeforeCollapse: {
      type: "number",
      default: 1,
      description: "Crumb count to keep visible before the ellipsis when collapsed",
    },
    itemsAfterCollapse: {
      type: "number",
      default: undefined,
      description:
        "Crumb count to keep visible after the ellipsis when collapsed. Defaults to maxItems - itemsBeforeCollapse.",
    },
  },
  slots: ["default"],
  emits: [],
  registryDependencies: ["collapse"],
  peerDeps: {
    react: ["@ark-ui/react", "clsx", "tailwind-merge", "class-variance-authority", "lucide-react"],
    vue: ["@ark-ui/vue", "clsx", "tailwind-merge", "class-variance-authority", "@lucide/vue"],
  },
} as const;
