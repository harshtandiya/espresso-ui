import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);

/** Resolve bundled registry directory shipped inside the npm package. */
function registryRoot(): string {
  const packageRoot = path.dirname(require.resolve("espresso-ui/package.json"));
  return path.join(packageRoot, "registry");
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

/** Load a component definition from the bundled registry. */
export async function loadDefinition(componentName: string): Promise<ComponentDefinition> {
  const defPath = path.join(registryRoot(), componentName, "definition.json");
  const raw = await fs.readFile(defPath, "utf-8");
  return JSON.parse(raw) as ComponentDefinition;
}

/** Resolve the ETA template path for a given component and framework. */
export function templatePath(componentName: string, framework: "react" | "vue"): string {
  return path.join(registryRoot(), componentName, `${componentName}.${framework}.eta`);
}

/** Resolve the component CSS token file path in the registry. */
export function cssPath(componentName: string): string {
  return path.join(registryRoot(), componentName, `${componentName}.css`);
}
