import fs from "node:fs/promises";
import path from "node:path";
import { getPackageRoot } from "./package-root.js";

/** Resolve bundled registry directory shipped inside the npm package. */
function registryRoot(): string {
  return path.join(getPackageRoot(), "registry");
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

/** List bundled component names from the registry manifest. */
export async function listComponents(): Promise<string[]> {
  const manifestPath = path.join(registryRoot(), "registry.json");
  const raw = await fs.readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(raw) as { components: string[] };
  return manifest.components;
}

/** Load a component definition from the bundled registry. */
export async function loadDefinition(componentName: string): Promise<ComponentDefinition> {
  const defPath = path.join(registryRoot(), componentName, "definition.json");

  let raw: string;
  try {
    raw = await fs.readFile(defPath, "utf-8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Component "${componentName}" not found in bundled registry`);
    }
    throw error;
  }

  try {
    return JSON.parse(raw) as ComponentDefinition;
  } catch {
    throw new Error(`Invalid definition.json for component "${componentName}"`);
  }
}

/** Resolve the ETA template path for a given component and framework. */
export function templatePath(componentName: string, framework: "react" | "vue"): string {
  return path.join(registryRoot(), componentName, `${componentName}.${framework}.eta`);
}

/** Resolve the component CSS token file path in the registry. */
export function cssPath(componentName: string): string {
  return path.join(registryRoot(), componentName, `${componentName}.css`);
}
