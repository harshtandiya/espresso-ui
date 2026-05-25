export const SITE_VERSION = "v0.1";

export const hero = {
  title: "A small, opinionated UI kit for internal tools.",
  lede: "A carefully-tuned component library for React and Vue. Two themes, a handful of tokens, copy components straight into your project. Click anything below to jump to its details.",
  mobileTitle: "An opinionated UI kit for internal tools.",
  mobileLede:
    "Carefully-tuned React and Vue components, two themes, and a handful of tokens. Tap anything below to see its details.",
} as const;

export const install = {
  prompt: "$",
  mobileDesc:
    "Install the CLI globally once, then run init in your project root. It scaffolds the config, drops a base stylesheet, and wires the @ alias.",
  globalCmd: "npm install -g @espresso-ui/cli",
  initCmd: "espresso-ui init",
} as const;

export const footer = {
  copyright: "© 2026 espresso-ui",
  license: "MIT licensed · TypeScript · React + Vue",
  github: "https://github.com/harshtandiya/espresso-ui",
  githubLabel: "View source on GitHub",
} as const;
