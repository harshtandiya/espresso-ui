import fs from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { cssPath, listComponents, loadDefinition, templatePath } from "../src/utils/registry.js";

test("bundled registry is readable", async () => {
  const components = await listComponents();
  expect(components).toEqual(expect.arrayContaining(["button", "label"]));

  for (const name of components) {
    const definition = await loadDefinition(name);
    expect(definition.name).toBe(name);
    expect(definition.peerDeps.react.length).toBeGreaterThan(0);

    await fs.access(templatePath(name, "react"));
    await fs.access(templatePath(name, "vue"));
    await fs.access(cssPath(name));
  }
});
