/**
 * Generates shadcn-compatible registry files under apps/docs/public/r/:
 *
 *   /r/registry.json      — React registry root
 *   /r/<name>.json        — React item  (shadcn add <host>/r/<name>)
 *   /r/vue/registry.json  — Vue registry root
 *   /r/vue/<name>.json    — Vue item    (shadcn add <host>/r/vue/<name>)
 *
 * Run via: pnpm build:registry
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Eta } from "eta";
import type { ComponentDefinition } from "../packages/cli/src/utils/registry.js";
import type { RegistryItem, RegistryRoot } from "./shadcn-schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = __dirname;
const OUT_REACT = path.join(__dirname, "..", "apps", "docs", "public", "r");
const OUT_VUE = path.join(OUT_REACT, "vue");

/** Canonical template render data — matches a TypeScript React+Vue project. */
function makeRenderData(componentName: string): Record<string, unknown> {
  return {
    typescript: true,
    darkMode: "data-attribute",
    utilsAlias: "@/lib",
    componentName,
  };
}

/** kebab-case → PascalCase */
function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/** Load a component definition by dynamic import. */
async function loadDef(componentName: string): Promise<ComponentDefinition> {
  const defPath = path.join(REGISTRY_DIR, componentName, "definition.ts");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- dynamic import of registry file
  const mod = await import(defPath);
  const defKey = Object.keys(mod as Record<string, unknown>).find((k) =>
    k.toLowerCase().includes("def"),
  );
  if (!defKey) {
    throw new Error(`No *Def export found in registry/${componentName}/definition.ts`);
  }
  return (mod as Record<string, ComponentDefinition>)[defKey]!;
}

/** Render a single ETA template, returning the rendered string. */
async function renderTemplate(
  componentName: string,
  framework: "react" | "vue",
  data: Record<string, unknown>,
): Promise<string> {
  const tmplDir = path.join(REGISTRY_DIR, componentName);
  const tmplFile = `./${componentName}.${framework}.eta`;
  const eta = new Eta({ views: tmplDir });
  return eta.renderAsync(tmplFile, data);
}

/** Read the component CSS file, returning empty string if absent. */
async function readCss(componentName: string): Promise<string> {
  const cssFile = path.join(REGISTRY_DIR, componentName, `${componentName}.css`);
  try {
    return await fs.readFile(cssFile, "utf-8");
  } catch {
    return "";
  }
}

/** Discover component names by scanning registry/ for subdirectories with definition.ts. */
async function discoverComponents(): Promise<string[]> {
  const entries = await fs.readdir(REGISTRY_DIR, { withFileTypes: true });
  const components: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const defPath = path.join(REGISTRY_DIR, entry.name, "definition.ts");
    try {
      await fs.access(defPath);
      components.push(entry.name);
    } catch {
      // No definition.ts — not a component directory, skip.
    }
  }
  return components.sort();
}

type ComponentItems = { react: RegistryItem; vue: RegistryItem };

async function buildRegistryItems(componentName: string): Promise<ComponentItems> {
  const pascal = toPascalCase(componentName);
  const data = makeRenderData(pascal);

  const [def, reactContent, vueContent, cssContent] = await Promise.all([
    loadDef(componentName),
    renderTemplate(componentName, "react", data),
    renderTemplate(componentName, "vue", data),
    readCss(componentName),
  ]);

  const cssFile: RegistryItem["files"][number] = {
    path: `components/ui/${componentName}.css`,
    content: cssContent,
    type: "registry:style",
  };

  const reactFiles: RegistryItem["files"] = [
    {
      path: `components/ui/${pascal}.tsx`,
      content: reactContent,
      type: "registry:ui",
    },
    ...(cssContent ? [cssFile] : []),
  ];

  const vueFiles: RegistryItem["files"] = [
    {
      path: `components/ui/${pascal}.vue`,
      content: vueContent,
      type: "registry:ui",
    },
    ...(cssContent ? [cssFile] : []),
  ];

  const react: RegistryItem = {
    name: componentName,
    type: "registry:ui",
    title: pascal,
    description: `espresso-ui ${pascal} component (React)`,
    dependencies: def.peerDeps.react ?? [],
    registryDependencies: [],
    files: reactFiles,
  };

  const vue: RegistryItem = {
    name: componentName,
    type: "registry:ui",
    title: pascal,
    description: `espresso-ui ${pascal} component (Vue)`,
    dependencies: def.peerDeps.vue ?? [],
    registryDependencies: [],
    files: vueFiles,
  };

  return { react, vue };
}

async function main(): Promise<void> {
  const components = await discoverComponents();

  if (components.length === 0) {
    console.error("No components found in registry/. Aborting.");
    process.exit(1);
  }

  console.log(`Found ${components.length} component(s): ${components.join(", ")}`);

  const componentItems = await Promise.all(components.map(buildRegistryItems));
  const reactItems = componentItems.map(({ react }) => react);
  const vueItems = componentItems.map(({ vue }) => vue);

  const makeRegistry = (items: RegistryItem[], name: string): RegistryRoot => ({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name,
    homepage: "https://espresso-ui.dev",
    items,
  });

  // Clean output dirs so stale per-item files don't linger across renames.
  await fs.rm(OUT_REACT, { recursive: true, force: true });
  await fs.mkdir(OUT_VUE, { recursive: true });

  async function writeDir(
    outDir: string,
    items: RegistryItem[],
    registryName: string,
  ): Promise<void> {
    const registryFile = path.join(outDir, "registry.json");
    await fs.writeFile(
      registryFile,
      JSON.stringify(makeRegistry(items, registryName), null, 2),
      "utf-8",
    );
    console.log(`Written → ${path.relative(process.cwd(), registryFile)}`);

    for (const item of items) {
      const itemFile = path.join(outDir, `${item.name}.json`);
      await fs.writeFile(itemFile, JSON.stringify(item, null, 2), "utf-8");
      console.log(`Written → ${path.relative(process.cwd(), itemFile)}`);
    }
  }

  await writeDir(OUT_REACT, reactItems, "espresso-ui");
  await writeDir(OUT_VUE, vueItems, "espresso-ui-vue");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
