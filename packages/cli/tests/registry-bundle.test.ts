import fs from "node:fs/promises";
import { expect, test } from "vite-plus/test";
import { cssPath, loadDefinition, templatePath } from "../src/utils/registry.js";

test("bundled registry is readable", async () => {
  const definition = await loadDefinition("button");
  expect(definition.name).toBe("button");
  expect(definition.peerDeps.react.length).toBeGreaterThan(0);

  await fs.access(templatePath("button", "react"));
  await fs.access(templatePath("button", "vue"));
  await fs.access(cssPath("button"));
});
