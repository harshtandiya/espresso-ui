import fs from "node:fs/promises";
import path from "node:path";
import * as p from "@clack/prompts";
import { Eta } from "eta";
import type { Command } from "commander";
import { loadConfig } from "../utils/config.js";
import { cssPath, loadDefinition, templatePath } from "../utils/registry.js";
import { detectPackageManager, installDeps } from "../utils/deps.js";
import { detectTailwind } from "../utils/detect-tailwind.js";
import { formatTailwindError } from "../utils/tailwind-error.js";
import { appendComponentTokens } from "../utils/css.js";

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function resolveAlias(alias: string): string {
  return alias.replace(/^@\//, "./src/");
}

export function registerAdd(program: Command): void {
  program
    .command("add <component>")
    .description("Add a component to your project")
    .action(async (component: string) => {
      const cwd = process.cwd();

      p.intro(`espresso-ui add ${component}`);

      let config;
      try {
        config = await loadConfig(cwd);
      } catch (err) {
        p.log.error((err as Error).message);
        process.exit(1);
      }

      const tailwind = await detectTailwind(cwd, config.cssPath);
      if (!tailwind.ok) {
        p.log.error(formatTailwindError(tailwind));
        p.cancel("Add aborted: Tailwind v4 is required.");
        process.exit(1);
      }

      let definition;
      try {
        definition = await loadDefinition(component);
      } catch {
        p.log.error(`Component "${component}" not found in registry. Check the component name.`);
        process.exit(1);
      }

      const tmplPath = templatePath(component, config.framework);
      const eta = new Eta({ views: path.dirname(tmplPath) });

      let rendered: string;
      try {
        rendered = await eta.renderAsync(`./${path.basename(tmplPath)}`, {
          typescript: config.typescript,
          darkMode: config.theme.darkMode,
          utilsAlias: path.posix.dirname(config.aliases.utils),
          componentName: toPascalCase(component),
        });
      } catch (err) {
        p.log.error(`Template render failed: ${(err as Error).message}`);
        process.exit(1);
      }

      const outDir = resolveAlias(config.aliases.components);
      const ext = config.framework === "react" ? (config.typescript ? ".tsx" : ".jsx") : ".vue";
      const outFile = path.join(cwd, outDir, `${toPascalCase(component)}${ext}`);

      let exists = false;
      try {
        await fs.access(outFile);
        exists = true;
      } catch {
        // doesn't exist
      }

      if (exists) {
        const overwrite = await p.confirm({
          message: `${outFile} already exists. Overwrite?`,
          initialValue: false,
        });
        if (p.isCancel(overwrite) || !overwrite) {
          p.cancel("Add cancelled.");
          process.exit(0);
        }
      }

      const s = p.spinner();
      s.start(`Writing ${outFile}`);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, rendered, "utf-8");

      s.message("Adding component tokens to global CSS");
      const componentCssPath = cssPath(component);
      try {
        const componentCss = await fs.readFile(componentCssPath, "utf-8");
        const globalCssPath = path.join(cwd, config.cssPath);
        const { appended } = await appendComponentTokens(globalCssPath, component, componentCss);
        if (!appended) {
          p.log.info(`Component tokens for "${component}" already present in ${config.cssPath}`);
        }
      } catch (err) {
        p.log.warn(`Could not add component tokens: ${(err as Error).message}`);
      }

      s.message("Installing peer dependencies");
      const peerDeps = definition.peerDeps[config.framework] ?? [];
      if (peerDeps.length > 0) {
        const pm = await detectPackageManager(cwd);
        try {
          installDeps(cwd, pm, peerDeps);
        } catch {
          s.stop(
            `Wrote ${outFile} — could not auto-install peer deps. Install manually: ${peerDeps.join(", ")}`,
          );
          process.exit(0);
        }
      }

      s.stop(`Done!`);
      p.outro(`Created ${outFile}`);
    });
}
