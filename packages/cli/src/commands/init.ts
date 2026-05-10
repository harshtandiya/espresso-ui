import fs from "node:fs/promises";
import path from "node:path";
import * as p from "@clack/prompts";
import type { Command } from "commander";
import { configExists, detectFramework, writeConfig } from "../utils/config.js";
import { detectTailwind } from "../utils/detect-tailwind.js";
import { formatTailwindError } from "../utils/tailwind-error.js";
import { generateGlobalCss } from "../themes/default.js";

export function registerInit(program: Command): void {
  program
    .command("init")
    .description("Scaffold espresso.config.json, generate global CSS, and install dependencies")
    .action(async () => {
      const cwd = process.cwd();

      p.intro("espresso-ui init");

      const tailwind = await detectTailwind(cwd);
      if (!tailwind.ok) {
        p.log.error(formatTailwindError(tailwind));
        p.cancel("Init aborted: Tailwind v4 is required.");
        process.exit(1);
      }

      if (await configExists(cwd)) {
        const overwrite = await p.confirm({
          message: "espresso.config.json already exists. Overwrite?",
          initialValue: false,
        });
        if (p.isCancel(overwrite) || !overwrite) {
          p.cancel("Init cancelled.");
          process.exit(0);
        }
      }

      const detected = await detectFramework(cwd);

      const framework = await p.select({
        message: "Which framework are you using?",
        options: [
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
        ],
        initialValue: detected ?? "react",
      });
      if (p.isCancel(framework)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const typescript = await p.confirm({
        message: "Use TypeScript?",
        initialValue: true,
      });
      if (p.isCancel(typescript)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const darkMode = await p.select({
        message: "Dark mode strategy?",
        options: [
          {
            value: "data-attribute",
            label: 'data-attribute  (data-theme="dark" on <html>)',
          },
          { value: "class", label: "class  (.dark on <html>)" },
          { value: "media-query", label: "media-query  (@media prefers-color-scheme)" },
        ],
        initialValue: "data-attribute",
      });
      if (p.isCancel(darkMode)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const cssPath = await p.text({
        message: "Where should we create your global CSS file?",
        placeholder: "src/styles/espresso.css",
        defaultValue: "src/styles/espresso.css",
      });
      if (p.isCancel(cssPath)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const componentsAlias = await p.text({
        message: "Components alias?",
        placeholder: "@/components",
        defaultValue: "@/components",
      });
      if (p.isCancel(componentsAlias)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const utilsAlias = await p.text({
        message: "Utils alias?",
        placeholder: "@/lib/utils",
        defaultValue: "@/lib/utils",
      });
      if (p.isCancel(utilsAlias)) {
        p.cancel("Init cancelled.");
        process.exit(0);
      }

      const s = p.spinner();

      s.start("Generating global CSS file");
      const cssFullPath = path.join(cwd, cssPath as string);
      await fs.mkdir(path.dirname(cssFullPath), { recursive: true });

      const cssContent = generateGlobalCss(darkMode as "data-attribute" | "class" | "media-query");
      await fs.writeFile(cssFullPath, cssContent, "utf-8");

      s.message("Writing espresso.config.json");
      await writeConfig(cwd, {
        framework: framework as "react" | "vue",
        typescript: typescript as boolean,
        styleEngine: "tailwind",
        cssPath: cssPath as string,
        theme: {
          default: "espresso",
          customThemePath: null,
          darkMode: darkMode as "data-attribute" | "class" | "media-query",
        },
        aliases: {
          components: (componentsAlias as string) || "@/components",
          utils: (utilsAlias as string) || "@/lib/utils",
        },
      });

      s.stop("Done!");

      p.outro(`Created ${cssPath} and espresso.config.json

Next steps:
  1. Import the CSS file in your app entry point:
     @import "${cssPath}";
  2. Run "espresso-ui add <component>" to add components`);
    });
}
