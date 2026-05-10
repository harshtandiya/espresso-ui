import fs from "node:fs/promises";
import path from "node:path";

export type TailwindStatus =
  | { ok: true }
  | { ok: false; reason: "missing"; detail: string }
  | { ok: false; reason: "v3-found"; detail: string }
  | { ok: false; reason: "no-import"; detail: string };

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

async function readPackageJson(cwd: string): Promise<PackageJson | null> {
  try {
    const raw = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    return JSON.parse(raw) as PackageJson;
  } catch {
    return null;
  }
}

async function readInstalledVersion(cwd: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(
      path.join(cwd, "node_modules", "tailwindcss", "package.json"),
      "utf-8",
    );
    const pkg = JSON.parse(raw) as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}

/** Extract leading integer from a semver/range string. Returns null if none. */
function leadingMajor(range: string): number | null {
  const match = range.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

/**
 * Detect Tailwind v4 setup in `cwd`.
 *
 * Checks (in order):
 *   1. tailwindcss listed in package.json deps/devDeps (else `missing`)
 *   2. installed major version >= 4 (falls back to package.json range if not installed)
 *   3. if `cssPath` provided, file contains `@import "tailwindcss"` (else `no-import`)
 */
export async function detectTailwind(cwd: string, cssPath?: string): Promise<TailwindStatus> {
  const pkg = await readPackageJson(cwd);
  const declared = pkg?.dependencies?.tailwindcss ?? pkg?.devDependencies?.tailwindcss ?? null;

  if (!declared) {
    return {
      ok: false,
      reason: "missing",
      detail: "tailwindcss not found in package.json dependencies or devDependencies",
    };
  }

  const installed = await readInstalledVersion(cwd);
  const versionSource = installed ?? declared;
  const major = leadingMajor(versionSource);

  if (major !== null && major < 4) {
    return {
      ok: false,
      reason: "v3-found",
      detail: `found tailwindcss@${versionSource}, but espresso-ui requires v4+`,
    };
  }

  if (cssPath) {
    let contents: string;
    try {
      contents = await fs.readFile(path.join(cwd, cssPath), "utf-8");
    } catch {
      return {
        ok: false,
        reason: "no-import",
        detail: `${cssPath} not found or unreadable`,
      };
    }
    const hasImport = /@import\s+["']tailwindcss["']/.test(contents);
    if (!hasImport) {
      return {
        ok: false,
        reason: "no-import",
        detail: `${cssPath} is missing '@import "tailwindcss";'`,
      };
    }
  }

  return { ok: true };
}
