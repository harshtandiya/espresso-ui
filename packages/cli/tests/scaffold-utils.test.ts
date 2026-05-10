import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import {
  resolveUtilsFilePath,
  scaffoldUtilsFile,
  utilsFileExists,
} from "../src/utils/scaffold-utils";

let tmp: string;

beforeEach(async () => {
  tmp = await fs.mkdtemp(path.join(os.tmpdir(), "espresso-scaffold-"));
});

afterEach(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});

test("resolveUtilsFilePath maps @/lib/utils to src/lib/utils.ts", () => {
  const result = resolveUtilsFilePath(tmp, "@/lib/utils", true);
  expect(result).toBe(path.join(tmp, "src/lib/utils.ts"));
});

test("resolveUtilsFilePath uses .js when typescript false", () => {
  const result = resolveUtilsFilePath(tmp, "@/lib/utils", false);
  expect(result).toBe(path.join(tmp, "src/lib/utils.js"));
});

test("scaffoldUtilsFile writes TS cn helper", async () => {
  await scaffoldUtilsFile(tmp, "@/lib/utils", true);

  const content = await fs.readFile(path.join(tmp, "src/lib/utils.ts"), "utf-8");
  expect(content).toContain('import { clsx, type ClassValue } from "clsx"');
  expect(content).toContain('import { twMerge } from "tailwind-merge"');
  expect(content).toContain("export function cn(...inputs: ClassValue[]): string");
  expect(content).toContain("return twMerge(clsx(inputs))");
});

test("scaffoldUtilsFile writes JS cn helper with JSDoc when typescript false", async () => {
  await scaffoldUtilsFile(tmp, "@/lib/utils", false);

  const content = await fs.readFile(path.join(tmp, "src/lib/utils.js"), "utf-8");
  expect(content).toContain('import { clsx } from "clsx"');
  expect(content).toContain('import { twMerge } from "tailwind-merge"');
  expect(content).toContain("export function cn(...inputs)");
  expect(content).toContain("return twMerge(clsx(inputs))");
  expect(content).not.toContain("type ClassValue");
  expect(content).toContain("@param");
});

test("scaffoldUtilsFile creates parent directories", async () => {
  await scaffoldUtilsFile(tmp, "@/deeply/nested/lib/utils", true);

  const stat = await fs.stat(path.join(tmp, "src/deeply/nested/lib/utils.ts"));
  expect(stat.isFile()).toBe(true);
});

test("utilsFileExists returns false when file absent", async () => {
  const exists = await utilsFileExists(tmp, "@/lib/utils", true);
  expect(exists).toBe(false);
});

test("utilsFileExists returns true after scaffold", async () => {
  await scaffoldUtilsFile(tmp, "@/lib/utils", true);
  const exists = await utilsFileExists(tmp, "@/lib/utils", true);
  expect(exists).toBe(true);
});

test("utilsFileExists checks correct extension", async () => {
  await scaffoldUtilsFile(tmp, "@/lib/utils", true);
  expect(await utilsFileExists(tmp, "@/lib/utils", true)).toBe(true);
  expect(await utilsFileExists(tmp, "@/lib/utils", false)).toBe(false);
});
