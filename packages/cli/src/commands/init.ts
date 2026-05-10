import fs from "node:fs/promises";
import path from "node:path";
import * as p from "@clack/prompts";
import type { Command } from "commander";
import { configExists, detectFramework, writeConfig } from "../utils/config.js";
import { detectTailwind } from "../utils/detect-tailwind.js";
import { detectPackageManager, installDeps } from "../utils/deps.js";
import { formatTailwindError } from "../utils/tailwind-error.js";
import {
  resolveUtilsFilePath,
  scaffoldUtilsFile,
  utilsFileExists,
} from "../utils/scaffold-utils.js";
import { patchTsconfigPaths } from "../utils/patch-tsconfig.js";
import { generateGlobalCss } from "../themes/default.js";

function extractAliasRoot(alias: string): string | null {
  const match = /^([^/]+)\//.exec(alias);
  return match?.[1] ?? null;
}

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

      const utilsAliasStr = (utilsAlias as string) || "@/lib/utils";
      const ts = typescript as boolean;

      let writeUtils = true;
      if (await utilsFileExists(cwd, utilsAliasStr, ts)) {
        const utilsPathRel = path.relative(cwd, resolveUtilsFilePath(cwd, utilsAliasStr, ts));
        const overwriteUtils = await p.confirm({
          message: `${utilsPathRel} already exists. Overwrite?`,
          initialValue: false,
        });
        if (p.isCancel(overwriteUtils)) {
          p.cancel("Init cancelled.");
          process.exit(0);
        }
        writeUtils = overwriteUtils;
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
          utils: utilsAliasStr,
        },
      });

      const aliasRoot =
        extractAliasRoot(utilsAliasStr) ??
        extractAliasRoot((componentsAlias as string) || "@/components");
      let tsconfigStatus: { file: string; patched: boolean } | null = null;
      if (aliasRoot) {
        s.message("Configuring tsconfig paths");
        try {
          const result = await patchTsconfigPaths(cwd, { aliasRoot });
          if (result.file) {
            tsconfigStatus = { file: path.relative(cwd, result.file), patched: result.patched };
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          s.message(`Skipped tsconfig patch: ${msg}`);
        }
      }

      let utilsWrittenPath: string | null = null;
      if (writeUtils) {
        s.message("Scaffolding cn() helper");
        utilsWrittenPath = await scaffoldUtilsFile(cwd, utilsAliasStr, ts);

        s.message("Installing clsx + tailwind-merge");
        const pm = await detectPackageManager(cwd);
        try {
          installDeps(cwd, pm, ["clsx", "tailwind-merge"]);
        } catch {
          s.stop(`Wrote files — could not auto-install clsx + tailwind-merge. Install manually.`);
          process.exit(0);
        }
      }

      s.stop("Done!");

      const utilsLine = utilsWrittenPath ? `\n  - ${path.relative(cwd, utilsWrittenPath)}` : "";
      const tsconfigLine = tsconfigStatus
        ? `\n  - ${tsconfigStatus.file} ${tsconfigStatus.patched ? "(patched paths)" : "(paths already configured)"}`
        : "";

      p.outro(`Created ${cssPath} and espresso.config.json${utilsLine}${tsconfigLine}

Next steps:
  1. Import the CSS file in your app entry point:
     @import "${cssPath}";
  2. Run "espresso-ui add <component>" to add components`);
    });
}
