import { defineConfig } from "vitepress";
import { whyframe } from "@whyframe/core";
import { whyframeVue } from "@whyframe/vue";
import { containerPreview, componentPreview } from "@vitepress-demo-preview/plugin";

export default defineConfig({
  title: "espresso-ui",
  description: "A framework-agnostic UI component library",
  vite: {
    // any[] cast: whyframe types cause excessive depth error against VitePress's deep UserConfig generics
    plugins: [
      ...whyframe({ defaultSrc: "/frames/vue" }),
      whyframeVue({ include: /\.(?:vue|md)$/ }),
    ] as any[],
  },
  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
