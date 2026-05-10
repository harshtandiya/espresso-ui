import fs from "node:fs/promises";
import path from "node:path";
import { applyEdits, modify, parseTree, findNodeAtLocation } from "jsonc-parser";

const TSCONFIG_CANDIDATES = ["tsconfig.app.json", "tsconfig.json", "jsconfig.json"];
const VITE_CANDIDATES = ["vite.config.ts", "vite.config.js", "vite.config.mts", "vite.config.mjs"];

export type PatchTsconfigOptions = {
  aliasRoot: string;
};

export type PatchTsconfigResult = {
  file: string | null;
  patched: boolean;
};

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function findTsconfigFile(cwd: string): Promise<string | null> {
  for (const candidate of TSCONFIG_CANDIDATES) {
    const full = path.join(cwd, candidate);
    if (await fileExists(full)) return full;
  }
  return null;
}

async function readViteAliasTargetAbs(cwd: string, aliasRoot: string): Promise<string | null> {
  for (const candidate of VITE_CANDIDATES) {
    const full = path.join(cwd, candidate);
    if (!(await fileExists(full))) continue;
    const src = await fs.readFile(full, "utf-8");
    const escaped = aliasRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `["']${escaped}["']\\s*:\\s*(?:path\\.resolve\\([^,]+,\\s*)?["']([^"']+)["']`,
    );
    const match = re.exec(src);
    if (match?.[1]) {
      const captured = match[1];
      if (path.isAbsolute(captured)) return null;
      return path.resolve(cwd, captured);
    }
  }
  return null;
}

function toPathsEntry(absBaseUrl: string, absTarget: string): string {
  const rel = path.relative(absBaseUrl, absTarget);
  if (rel === "" || rel === ".") return "./*";
  const posix = rel.split(path.sep).join("/");
  return `./${posix}/*`;
}

export async function patchTsconfigPaths(
  cwd: string,
  opts: PatchTsconfigOptions,
): Promise<PatchTsconfigResult> {
  const file = await findTsconfigFile(cwd);
  if (!file) return { file: null, patched: false };

  const original = await fs.readFile(file, "utf-8");
  const tree = parseTree(original);
  const aliasGlob = `${opts.aliasRoot}/*`;

  const existingPath = tree
    ? findNodeAtLocation(tree, ["compilerOptions", "paths", aliasGlob])
    : undefined;
  if (existingPath) {
    return { file, patched: false };
  }

  const absTarget = (await readViteAliasTargetAbs(cwd, opts.aliasRoot)) ?? path.join(cwd, "src");
  const formatting = { tabSize: 2, insertSpaces: true } as const;

  let updated = original;

  const baseUrlNode = tree ? findNodeAtLocation(tree, ["compilerOptions", "baseUrl"]) : undefined;
  const baseUrlValue = (baseUrlNode?.value as string | undefined) ?? ".";
  const absBaseUrl = path.resolve(cwd, baseUrlValue);

  if (!baseUrlNode) {
    const edits = modify(updated, ["compilerOptions", "baseUrl"], ".", {
      formattingOptions: formatting,
    });
    updated = applyEdits(updated, edits);
  }

  const pathsValue = toPathsEntry(absBaseUrl, absTarget);
  const pathsEdits = modify(updated, ["compilerOptions", "paths", aliasGlob], [pathsValue], {
    formattingOptions: formatting,
  });
  updated = applyEdits(updated, pathsEdits);

  await fs.writeFile(file, updated, "utf-8");
  return { file, patched: true };
}
