import { describe, expect, it } from "vite-plus/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RegistryRoot } from "./shadcn-schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R_DIR = path.join(__dirname, "..", "apps", "docs", "public", "r");
const REACT_REGISTRY = path.join(R_DIR, "registry.json");
const VUE_REGISTRY = path.join(R_DIR, "vue", "registry.json");

async function loadRegistry(filePath: string): Promise<RegistryRoot> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as RegistryRoot;
}

function sharedItemAssertions(registry: RegistryRoot): void {
  expect(registry.$schema).toBe("https://ui.shadcn.com/schema/registry.json");
  expect(registry.homepage).toBeTypeOf("string");
  expect(Array.isArray(registry.items)).toBe(true);
  expect(registry.items.length).toBeGreaterThan(0);

  for (const item of registry.items) {
    expect(item.name, `${item.name}: missing name`).toBeTypeOf("string");
    expect(item.type, `${item.name}: missing type`).toBeTypeOf("string");
    expect(item.title, `${item.name}: missing title`).toBeTypeOf("string");
    expect(item.description, `${item.name}: missing description`).toBeTypeOf("string");
    expect(Array.isArray(item.dependencies), `${item.name}: dependencies must be array`).toBe(true);
    expect(item.files.length, `${item.name}: must have at least one file`).toBeGreaterThan(0);

    expect(
      (item.dependencies ?? []).length,
      `${item.name}: expected at least one dependency`,
    ).toBeGreaterThan(0);

    for (const file of item.files) {
      const hasEtaTags = file.content.includes("<%") || file.content.includes("%>");
      expect(hasEtaTags, `${item.name}/${file.path}: contains unrendered ETA tags`).toBe(false);
      expect(
        file.content.trim().length,
        `${item.name}/${file.path}: file content is empty`,
      ).toBeGreaterThan(0);
    }
  }
}

describe("React registry (r/registry.json)", () => {
  it("exists and is valid JSON", async () => {
    await expect(fs.access(REACT_REGISTRY)).resolves.toBeUndefined();
  });

  it("has name espresso-ui", async () => {
    const registry = await loadRegistry(REACT_REGISTRY);
    expect(registry.name).toBe("espresso-ui");
  });

  it("passes shared item assertions", async () => {
    sharedItemAssertions(await loadRegistry(REACT_REGISTRY));
  });

  it("all items contain only .tsx files (no .vue)", async () => {
    const { items } = await loadRegistry(REACT_REGISTRY);
    for (const item of items) {
      expect(
        item.files.some((f) => f.path.endsWith(".tsx")),
        `${item.name}: missing .tsx`,
      ).toBe(true);
      expect(
        item.files.some((f) => f.path.endsWith(".vue")),
        `${item.name}: must not have .vue`,
      ).toBe(false);
    }
  });
});

describe("Vue registry (r/vue/registry.json)", () => {
  it("exists and is valid JSON", async () => {
    await expect(fs.access(VUE_REGISTRY)).resolves.toBeUndefined();
  });

  it("has name espresso-ui-vue", async () => {
    const registry = await loadRegistry(VUE_REGISTRY);
    expect(registry.name).toBe("espresso-ui-vue");
  });

  it("passes shared item assertions", async () => {
    sharedItemAssertions(await loadRegistry(VUE_REGISTRY));
  });

  it("all items contain only .vue files (no .tsx)", async () => {
    const { items } = await loadRegistry(VUE_REGISTRY);
    for (const item of items) {
      expect(
        item.files.some((f) => f.path.endsWith(".vue")),
        `${item.name}: missing .vue`,
      ).toBe(true);
      expect(
        item.files.some((f) => f.path.endsWith(".tsx")),
        `${item.name}: must not have .tsx`,
      ).toBe(false);
    }
  });
});

describe("registry parity", () => {
  it("React and Vue registries have the same component names", async () => {
    const [react, vue] = await Promise.all([
      loadRegistry(REACT_REGISTRY),
      loadRegistry(VUE_REGISTRY),
    ]);
    const reactNames = react.items.map((i) => i.name).sort();
    const vueNames = vue.items.map((i) => i.name).sort();
    expect(reactNames).toEqual(vueNames);
  });
});

describe("React templates use named imports (no React.* namespace)", () => {
  it("no rendered React file references the React.* namespace", async () => {
    const { items } = await loadRegistry(REACT_REGISTRY);
    const offenders: string[] = [];
    for (const item of items) {
      for (const file of item.files) {
        if (!file.path.endsWith(".tsx")) continue;
        if (/\bReact\./.test(file.content)) {
          offenders.push(`${item.name}/${file.path}`);
        }
      }
    }
    expect(
      offenders,
      `Files referencing React.* namespace: ${offenders.join(", ")}. ` +
        `Use named imports (e.g. \`import type { ComponentPropsWithoutRef } from "react"\`) instead.`,
    ).toEqual([]);
  });
});
