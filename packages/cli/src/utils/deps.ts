import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

type PackageManager = "pnpm" | "yarn" | "npm";

/** Detect the package manager by checking for lock files in cwd. */
export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  const checks: Array<[string, PackageManager]> = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["package-lock.json", "npm"],
  ];
  for (const [lockFile, pm] of checks) {
    try {
      await fs.access(path.join(cwd, lockFile));
      return pm;
    } catch {
      // not found, try next
    }
  }
  return "npm";
}

/** Install packages as dependencies in the user's project. */
export function installDeps(cwd: string, pm: PackageManager, packages: string[]): void {
  if (packages.length === 0) return;
  const pkgList = packages.join(" ");
  const cmd =
    pm === "pnpm"
      ? `pnpm add ${pkgList}`
      : pm === "yarn"
        ? `yarn add ${pkgList}`
        : `npm install ${pkgList}`;
  execSync(cmd, { cwd, stdio: "inherit" });
}

/** Install packages as dev dependencies in the user's project. */
export function installDevDeps(cwd: string, pm: PackageManager, packages: string[]): void {
  if (packages.length === 0) return;
  const pkgList = packages.join(" ");
  const cmd =
    pm === "pnpm"
      ? `pnpm add -D ${pkgList}`
      : pm === "yarn"
        ? `yarn add -D ${pkgList}`
        : `npm install --save-dev ${pkgList}`;
  execSync(cmd, { cwd, stdio: "inherit" });
}
