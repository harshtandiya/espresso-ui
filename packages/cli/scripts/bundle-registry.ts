import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONOREPO_REGISTRY = path.resolve(__dirname, "../../../registry");
const OUT = path.resolve(__dirname, "../registry");

async function discoverComponents(): Promise<string[]> {
  const entries = await fs.readdir(MONOREPO_REGISTRY, { withFileTypes: true });
  const names: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const defPath = path.join(MONOREPO_REGISTRY, entry.name, "definition.ts");
    try {
      await fs.access(defPath);
      names.push(entry.name);
    } catch {
      // Not a component directory.
    }
  }

  names.sort();
  return names;
}

async function bundleRegistry(): Promise<void> {
  const components = await discoverComponents();

  if (components.length === 0) {
    throw new Error(`No components found under ${MONOREPO_REGISTRY}`);
  }

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  for (const name of components) {
    const srcDir = path.join(MONOREPO_REGISTRY, name);
    const outDir = path.join(OUT, name);
    await fs.mkdir(outDir, { recursive: true });

    for (const ext of [".react.eta", ".vue.eta", ".css"]) {
      const src = path.join(srcDir, `${name}${ext}`);
      const dest = path.join(outDir, `${name}${ext}`);

      try {
        await fs.copyFile(src, dest);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          throw new Error(`Missing registry/${name}/${name}${ext}`);
        }
        throw error;
      }
    }

    const mod = await import(pathToFileURL(path.join(srcDir, "definition.ts")).href);
    const defKey = Object.keys(mod as Record<string, unknown>).find((key) =>
      key.toLowerCase().includes("def"),
    );

    if (!defKey) {
      throw new Error(`No definition export found in registry/${name}/definition.ts`);
    }

    await fs.writeFile(
      path.join(outDir, "definition.json"),
      `${JSON.stringify((mod as Record<string, unknown>)[defKey], null, 2)}\n`,
    );
  }

  await fs.writeFile(
    path.join(OUT, "registry.json"),
    `${JSON.stringify({ components }, null, 2)}\n`,
  );

  console.log(`Bundled ${components.length} components → packages/cli/registry/`);
}

await bundleRegistry();
