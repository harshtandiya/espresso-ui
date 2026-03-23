import DefaultTheme from "vitepress/theme";
import { AntDesignContainer } from "@vitepress-demo-preview/component";
// @ts-ignore — CSS side-effect imports resolved by Vite at runtime, not tsgo
import "@vitepress-demo-preview/component/dist/style.css";
// @ts-ignore
import "./style.css";
import { useData, inBrowser } from "vitepress";
import { watchEffect, defineComponent, h } from "vue";
import type { App } from "vue";

// Bridge VitePress dark mode (.dark class) to espresso-ui token system ([data-theme="dark"])
const Layout = defineComponent({
  setup() {
    if (inBrowser) {
      const { isDark } = useData();
      watchEffect(() => {
        document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "");
      });
    }
    return () => h(DefaultTheme.Layout);
  },
});

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: App }) {
    app.component("demo-preview", AntDesignContainer);
  },
};
