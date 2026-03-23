import * as p from "@clack/prompts";
import type { Command } from "commander";
import { configExists, detectFramework, writeConfig } from "../utils/config";
import { detectPackageManager, installDevDeps } from "../utils/deps";

export function registerInit(program: Command): void {
  program
    .command("init")
    .description("Scaffold espresso.config.json and install token dependency")
    .action(async () => {
      const cwd = process.cwd();

      p.intro("espresso-ui init");

      // Check for existing config
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

      // Auto-detect framework
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
      s.start("Writing espresso.config.json");

      await writeConfig(cwd, {
        framework: framework as "react" | "vue",
        typescript: typescript as boolean,
        styleEngine: "tailwind",
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

      s.message("Installing @espresso-ui/tokens");
      const pm = await detectPackageManager(cwd);
      try {
        installDevDeps(cwd, pm, ["@espresso-ui/tokens"]);
      } catch {
        // Non-fatal — the user may not have a package.json yet or it's an expected skip in monorepos
        s.stop("Could not install @espresso-ui/tokens automatically — install it manually.");
      }

      s.stop("Done!");

      p.outro(`espresso.config.json created. Next: run "espresso-ui add <component>"`);
    });
}
