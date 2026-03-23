import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import { containerPreview, componentPreview } from "@vitepress-demo-preview/plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  title: "espresso-ui",
  description: "A framework-agnostic UI component library",

  vite: {
    // any[] cast: plugin types cause excessive depth error against VitePress's deep UserConfig generics
    plugins: [tailwindcss()] as any[],
    resolve: {
      alias: { "@": path.resolve(__dirname, "..") },
    },
  },

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Components", link: "/components/button" },
    ],
    sidebar: {
      "/guide/": [{ text: "Getting Started", link: "/guide/getting-started" }],
      "/components/": [
        {
          text: "Components",
          items: [{ text: "Button", link: "/components/button" }],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/harshtandiya/espresso-ui" }],
  },

  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
});
