import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: false,
    format: ["esm"],
    sourcemap: true,
  },
});
