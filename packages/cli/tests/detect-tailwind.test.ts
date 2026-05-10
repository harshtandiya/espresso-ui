import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expect, test, beforeEach, afterEach } from "vite-plus/test";
import { detectTailwind } from "../src/utils/detect-tailwind";

let tmp: string;

beforeEach(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "espresso-detect-"));
});

afterEach(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

async function writePkg(deps: Record<string, string> = {}, devDeps: Record<string, string> = {}) {
  await fs.writeFile(
    path.join(tmp, "package.json"),
    JSON.stringify({ name: "x", dependencies: deps, devDependencies: devDeps }),
  );
}

async function writeInstalled(version: string) {
  const dir = path.join(tmp, "node_modules", "tailwindcss");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "tailwindcss", version }),
  );
}

test("returns missing when tailwindcss absent from package.json", async () => {
  await writePkg();

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("missing");
});

test("returns missing when package.json itself is absent", async () => {
  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("missing");
});

test("returns v3-found when installed tailwindcss is major 3", async () => {
  await writePkg({}, { tailwindcss: "^3.4.0" });
  await writeInstalled("3.4.17");

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("v3-found");
});

test("returns ok when installed tailwindcss is major 4", async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.3");

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(true);
});

test("falls back to package.json range when node_modules missing, accepts ^4", async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(true);
});

test("falls back to package.json range when node_modules missing, rejects ^3", async () => {
  await writePkg({}, { tailwindcss: "^3.4.0" });

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("v3-found");
});

test("detects tailwindcss in dependencies (not just devDependencies)", async () => {
  await writePkg({ tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.0");

  const result = await detectTailwind(tmp);

  expect(result.ok).toBe(true);
});

test('returns no-import when cssPath given but file missing @import "tailwindcss"', async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.0");
  const cssPath = "src/styles/espresso.css";
  await fs.mkdir(path.join(tmp, "src/styles"), { recursive: true });
  await fs.writeFile(path.join(tmp, cssPath), "/* nothing here */");

  const result = await detectTailwind(tmp, cssPath);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("no-import");
});

test("returns no-import when cssPath file does not exist", async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.0");

  const result = await detectTailwind(tmp, "src/styles/espresso.css");

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("no-import");
});

test('returns ok when cssPath contains @import "tailwindcss"', async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.0");
  const cssPath = "src/styles/espresso.css";
  await fs.mkdir(path.join(tmp, "src/styles"), { recursive: true });
  await fs.writeFile(path.join(tmp, cssPath), '@import "tailwindcss";\n');

  const result = await detectTailwind(tmp, cssPath);

  expect(result.ok).toBe(true);
});

test("accepts single-quoted @import 'tailwindcss'", async () => {
  await writePkg({}, { tailwindcss: "^4.0.0" });
  await writeInstalled("4.0.0");
  const cssPath = "app.css";
  await fs.writeFile(path.join(tmp, cssPath), "@import 'tailwindcss';\n");

  const result = await detectTailwind(tmp, cssPath);

  expect(result.ok).toBe(true);
});

test("missing tailwindcss takes precedence over no-import", async () => {
  await writePkg();
  const cssPath = "app.css";
  await fs.writeFile(path.join(tmp, cssPath), "/* empty */");

  const result = await detectTailwind(tmp, cssPath);

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reason).toBe("missing");
});
