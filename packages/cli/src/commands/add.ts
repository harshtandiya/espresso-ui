import fs from "node:fs/promises";
import path from "node:path";
import * as p from "@clack/prompts";
import { Eta } from "eta";
import type { Command } from "commander";
import { loadConfig } from "../utils/config";
import { loadDefinition, templatePath } from "../utils/registry";
import { detectPackageManager, installDeps } from "../utils/deps";

/** Convert kebab-case or lowercase to PascalCase. */
function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/** Map "@/components" → "./src/components" */
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

      // 1. Load config
      let config;
      try {
        config = await loadConfig(cwd);
      } catch (err) {
        p.log.error((err as Error).message);
        process.exit(1);
      }

      // 2. Load definition
      let definition;
      try {
        definition = await loadDefinition(component);
      } catch {
        p.log.error(`Component "${component}" not found in registry. Check the component name.`);
        process.exit(1);
      }

      // 3. Render template
      const tmplPath = templatePath(component, config.framework);
      const eta = new Eta({ views: path.dirname(tmplPath) });

      let rendered: string;
      try {
        rendered = await eta.renderAsync(`./${path.basename(tmplPath)}`, {
          typescript: config.typescript,
          darkMode: config.theme.darkMode,
          utilsAlias: config.aliases.utils,
          componentName: toPascalCase(component),
        });
      } catch (err) {
        p.log.error(`Template render failed: ${(err as Error).message}`);
        process.exit(1);
      }

      // 4. Resolve output path
      const outDir = resolveAlias(config.aliases.components);
      const ext = config.framework === "react" ? (config.typescript ? ".tsx" : ".jsx") : ".vue";
      const outFile = path.join(cwd, outDir, `${toPascalCase(component)}${ext}`);

      // 5. Check if file exists
      let exists = false;
      try {
        await fs.access(outFile);
        exists = true;
      } catch {
        // doesn't exist — fine
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

      // 6. Write file
      const s = p.spinner();
      s.start(`Writing ${outFile}`);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, rendered, "utf-8");
      s.message("Installing peer dependencies");

      // 7. Install peer deps
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
