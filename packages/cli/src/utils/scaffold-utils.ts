import fs from "node:fs/promises";
import path from "node:path";

const UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`;

const UTILS_JS = `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with clsx + tailwind-merge.
 * @param {...import("clsx").ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
`;

function aliasToFsRoot(alias: string): string {
  return alias.replace(/^@\//, "src/");
}

export function resolveUtilsFilePath(cwd: string, utilsAlias: string, typescript: boolean): string {
  const rel = aliasToFsRoot(utilsAlias);
  const ext = typescript ? ".ts" : ".js";
  return path.join(cwd, `${rel}${ext}`);
}

export async function utilsFileExists(
  cwd: string,
  utilsAlias: string,
  typescript: boolean,
): Promise<boolean> {
  const fullPath = resolveUtilsFilePath(cwd, utilsAlias, typescript);
  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

export async function scaffoldUtilsFile(
  cwd: string,
  utilsAlias: string,
  typescript: boolean,
): Promise<string> {
  const fullPath = resolveUtilsFilePath(cwd, utilsAlias, typescript);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, typescript ? UTILS_TS : UTILS_JS, "utf-8");
  return fullPath;
}
