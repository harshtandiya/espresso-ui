import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*.{ts,tsx,js,jsx,mjs,cjs,vue,astro}": "vp check --fix",
    "*.{json,jsonc,md,mdx,yml,yaml,css}": "vp fmt --fix",
  },
  lint: {
    ignorePatterns: ["test-app/**", "apps/docs/public/r/**"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ["test-app/**", "apps/docs/public/r/**"],
  },
});
