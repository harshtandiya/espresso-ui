import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*.{ts,tsx,js,jsx,mjs,cjs,vue,astro}": "vp check --fix",
    // Generated registry JSON is fmt-ignored; skip it so vp fmt does not fail on empty targets.
    "*.{json,jsonc,md,mdx,yml,yaml,css}":
      'bash -c \'args=(); for f in "$@"; do case "$f" in */apps/docs/public/r/*) ;; *) args+=("$f") ;; esac; done; if ((${#args[@]})); then exec vp fmt "${args[@]}"; fi\' --',
  },
  lint: {
    ignorePatterns: ["test-app/**", "apps/docs/public/r/**"],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: ["test-app/**", "apps/docs/public/r/**"],
  },
});
