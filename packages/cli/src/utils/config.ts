import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const EspressoConfig = z.object({
  framework: z.enum(["react", "vue"]),
  typescript: z.boolean().default(true),
  styleEngine: z.enum(["tailwind"]).default("tailwind"),
  theme: z.object({
    default: z.string().default("espresso"),
    customThemePath: z.string().nullable().default(null),
    darkMode: z.enum(["data-attribute", "class", "media-query"]).default("data-attribute"),
  }),
  aliases: z.object({
    components: z.string().default("@/components"),
    utils: z.string().default("@/lib/utils"),
  }),
});

export type EspressoConfigType = z.infer<typeof EspressoConfig>;

const CONFIG_FILE = "espresso.config.json";

export async function loadConfig(cwd: string): Promise<EspressoConfigType> {
  const configPath = path.join(cwd, CONFIG_FILE);
  let raw: string;
  try {
    raw = await fs.readFile(configPath, "utf-8");
  } catch {
    throw new Error(`No espresso.config.json found. Run "espresso-ui init" first.`);
  }
  const parsed = EspressoConfig.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`Invalid espresso.config.json:\n${parsed.error.toString()}`);
  }
  return parsed.data;
}

export async function writeConfig(cwd: string, config: EspressoConfigType): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

export async function configExists(cwd: string): Promise<boolean> {
  try {
    await fs.access(path.join(cwd, CONFIG_FILE));
    return true;
  } catch {
    return false;
  }
}

/** Sniff package.json deps for "react" or "vue". Returns the detected framework or null. */
export async function detectFramework(cwd: string): Promise<"react" | "vue" | null> {
  try {
    const pkgPath = path.join(cwd, "package.json");
    const raw = await fs.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    if ("react" in allDeps) return "react";
    if ("vue" in allDeps) return "vue";
    return null;
  } catch {
    return null;
  }
}
