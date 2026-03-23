import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the path to the registry directory, relative to the CLI's install location.
 * In the built CLI, dist/index.mjs is 3 levels deep from the monorepo root, so we
 * walk up accordingly. In dev (src/), we walk up 4 levels.
 */
function registryRoot(): string {
  // During build: packages/cli/dist/index.mjs → ../../.. → monorepo root
  // During tests: packages/cli/src/utils/registry.ts → ../../../.. → monorepo root
  // We use a heuristic: walk up until we find a "registry" sibling.
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (path.basename(dir) === "cli" || path.basename(path.dirname(dir)) === "packages") {
      return path.join(dir, "..", "..", "registry");
    }
    dir = path.dirname(dir);
  }
  return path.join(__dirname, "..", "..", "..", "..", "registry");
}

export type ComponentDefinition = {
  name: string;
  props: Record<
    string,
    {
      type: string;
      values?: string[];
      default: unknown;
      description?: string;
    }
  >;
  slots: string[];
  emits: string[];
  peerDeps: {
    react: string[];
    vue: string[];
  };
};

/** Load a component definition from the registry. */
export async function loadDefinition(componentName: string): Promise<ComponentDefinition> {
  const defPath = path.join(registryRoot(), componentName, "definition.ts");
  // Dynamic import — works because the registry is co-located in the monorepo.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- dynamic import of user-authored registry file
  const mod = await import(defPath);
  // The definition file exports a named export matching <name>Def convention
  const defKey = Object.keys(mod as Record<string, unknown>).find((k) =>
    k.toLowerCase().includes("def"),
  );
  if (!defKey) {
    throw new Error(`No definition export found in registry/${componentName}/definition.ts`);
  }
  return (mod as Record<string, ComponentDefinition>)[defKey]!;
}

/** Resolve the ETA template path for a given component and framework. */
export function templatePath(componentName: string, framework: "react" | "vue"): string {
  return path.join(registryRoot(), componentName, `${componentName}.${framework}.eta`);
}

/** Resolve the component CSS token file path in the registry. */
export function cssPath(componentName: string): string {
  return path.join(registryRoot(), componentName, `${componentName}.css`);
}
