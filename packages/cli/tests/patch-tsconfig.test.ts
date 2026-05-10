import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { patchTsconfigPaths } from "../src/utils/patch-tsconfig";

let tmp: string;

beforeEach(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "espresso-tsconfig-"));
});

afterEach(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

async function writeJson(rel: string, content: string): Promise<void> {
  const full = path.join(tmp, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf-8");
}

async function readJson(rel: string): Promise<string> {
  return fs.readFile(path.join(tmp, rel), "utf-8");
}

test("returns null when no tsconfig or jsconfig exists", async () => {
  const result = await patchTsconfigPaths(tmp, { aliasRoot: "@" });
  expect(result.file).toBe(null);
  expect(result.patched).toBe(false);
});

test("patches fresh tsconfig.json with baseUrl and paths", async () => {
  await writeJson("tsconfig.json", `{\n  "compilerOptions": {\n    "strict": true\n  }\n}\n`);

  const result = await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  expect(result.file).toBe(path.join(tmp, "tsconfig.json"));
  expect(result.patched).toBe(true);

  const content = await readJson("tsconfig.json");
  const parsed = JSON.parse(content) as {
    compilerOptions: { baseUrl: string; paths: Record<string, string[]>; strict: boolean };
  };
  expect(parsed.compilerOptions.baseUrl).toBe(".");
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
  expect(parsed.compilerOptions.strict).toBe(true);
});

test("preserves comments in tsconfig.json", async () => {
  const original = `{\n  // top-level comment\n  "compilerOptions": {\n    /* inline block */\n    "strict": true\n  }\n}\n`;
  await writeJson("tsconfig.json", original);

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const content = await readJson("tsconfig.json");
  expect(content).toContain("// top-level comment");
  expect(content).toContain("/* inline block */");
});

test("no-op when @/* already present in paths", async () => {
  const original = `{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": { "@/*": ["./app/*"] }\n  }\n}\n`;
  await writeJson("tsconfig.json", original);

  const result = await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  expect(result.patched).toBe(false);
  const content = await readJson("tsconfig.json");
  const parsed = JSON.parse(content) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./app/*"]);
});

test("paths entries are relative to existing baseUrl, not cwd", async () => {
  await writeJson("tsconfig.json", `{\n  "compilerOptions": {\n    "baseUrl": "./src"\n  }\n}\n`);

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const content = await readJson("tsconfig.json");
  const parsed = JSON.parse(content) as {
    compilerOptions: { baseUrl: string; paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.baseUrl).toBe("./src");
  // target dir is ./src (default), baseUrl is ./src → paths must be ["./*"], not ["./src/*"]
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./*"]);
});

test("paths relative to baseUrl when vite alias points elsewhere", async () => {
  await writeJson(
    "tsconfig.json",
    `{\n  "compilerOptions": {\n    "baseUrl": "./packages/web"\n  }\n}\n`,
  );
  await writeJson(
    "vite.config.ts",
    `import { defineConfig } from "vite";\nimport path from "node:path";\nexport default defineConfig({\n  resolve: { alias: { "@": path.resolve(__dirname, "./packages/web/src") } }\n});\n`,
  );

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const parsed = JSON.parse(await readJson("tsconfig.json")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
});

test("ignores absolute path from vite alias and uses default", async () => {
  await writeJson("tsconfig.json", `{\n  "compilerOptions": {}\n}\n`);
  await writeJson(
    "vite.config.ts",
    `export default { resolve: { alias: { "@": "/etc/passwd" } } };\n`,
  );

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const parsed = JSON.parse(await readJson("tsconfig.json")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
});

test("prefers tsconfig.app.json over tsconfig.json when both exist", async () => {
  await writeJson("tsconfig.json", `{\n  "references": [{ "path": "./tsconfig.app.json" }]\n}\n`);
  await writeJson("tsconfig.app.json", `{\n  "compilerOptions": {}\n}\n`);

  const result = await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  expect(result.file).toBe(path.join(tmp, "tsconfig.app.json"));
  const appContent = await readJson("tsconfig.app.json");
  const appParsed = JSON.parse(appContent) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(appParsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);

  const rootContent = await readJson("tsconfig.json");
  expect(rootContent).not.toContain('"@/*"');
});

test("falls back to jsconfig.json when no tsconfig present", async () => {
  await writeJson("jsconfig.json", `{\n  "compilerOptions": {}\n}\n`);

  const result = await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  expect(result.file).toBe(path.join(tmp, "jsconfig.json"));
  const parsed = JSON.parse(await readJson("jsconfig.json")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
});

test("uses target from vite.config.ts resolve.alias when present", async () => {
  await writeJson("tsconfig.json", `{\n  "compilerOptions": {}\n}\n`);
  await writeJson(
    "vite.config.ts",
    `import { defineConfig } from "vite";\nimport path from "node:path";\nexport default defineConfig({\n  resolve: { alias: { "@": path.resolve(__dirname, "./app") } }\n});\n`,
  );

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const parsed = JSON.parse(await readJson("tsconfig.json")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./app/*"]);
});

test("merges into existing paths block without clobbering siblings", async () => {
  await writeJson(
    "tsconfig.json",
    `{\n  "compilerOptions": {\n    "baseUrl": ".",\n    "paths": { "~/*": ["./other/*"] }\n  }\n}\n`,
  );

  await patchTsconfigPaths(tmp, { aliasRoot: "@" });

  const parsed = JSON.parse(await readJson("tsconfig.json")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(parsed.compilerOptions.paths["~/*"]).toEqual(["./other/*"]);
  expect(parsed.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
});
