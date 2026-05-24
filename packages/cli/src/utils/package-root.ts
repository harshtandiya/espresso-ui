import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Locate the installed CLI package root by walking up to package.json with the bin entry. */
export function getPackageRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));

  for (let i = 0; i < 10; i++) {
    const pkgPath = path.join(dir, "package.json");

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
        bin?: Record<string, string>;
      };

      if (pkg.bin?.["espresso-ui"]) {
        return dir;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error("Could not locate espresso-ui package root");
}

export function readPackageJson(): { version: string } {
  const pkgPath = path.join(getPackageRoot(), "package.json");
  return JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as { version: string };
}
