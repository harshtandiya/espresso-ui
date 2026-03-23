import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Primitives = Record<string, unknown>;
type SemanticSection = { color: Record<string, string>; shadow: Record<string, string> };
type Semantic = {
  light: SemanticSection;
  dark: SemanticSection;
  radius: Record<string, string>;
};

// ---------------------------------------------------------------------------
// Flatten a nested primitives object to { "color-gray-50": "oklch(...)" }.
// Skips non-leaf nodes. Separator is "-" to match CSS custom property naming.
// ---------------------------------------------------------------------------
function flattenPrimitives(
  obj: Record<string, unknown>,
  prefix: string[] = [],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== null && typeof val === "object") {
      Object.assign(result, flattenPrimitives(val as Record<string, unknown>, [...prefix, key]));
    } else if (typeof val === "string") {
      result[[...prefix, key].join("-")] = val;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Resolve a "{token.path}" reference to its primitive value.
// Falls back to the raw string if no match (e.g. inline oklch literals).
// ---------------------------------------------------------------------------
function resolveRef(ref: string, primitives: Primitives): string {
  const match = /^\{(.+)\}$/.exec(ref);
  if (!match) return ref;
  const parts = match[1].split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic traversal
  let node: any = primitives;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return ref;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : ref;
}

function resolveSection(
  section: Record<string, string>,
  primitives: Primitives,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(section).map(([k, v]) => [k, resolveRef(v, primitives)]),
  );
}

function renderVars(map: Record<string, string>, varPrefix: string): string {
  return Object.entries(map)
    .map(([k, v]) => `  --${varPrefix}${k}: ${v};`)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function build(): void {
  const primitives = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "primitives.json"), "utf-8"),
  ) as Primitives;
  const semantic = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "semantic.json"), "utf-8"),
  ) as Semantic;

  fs.mkdirSync(distDir, { recursive: true });

  // 1. dist/primitives.css — all raw scale tokens as --espresso-* on :root
  const flat = flattenPrimitives(primitives);
  const primitivesCss = `:root {\n${Object.entries(flat)
    .map(([k, v]) => `  --espresso-${k}: ${v};`)
    .join("\n")}\n}\n`;
  fs.writeFileSync(path.join(distDir, "primitives.css"), primitivesCss, "utf-8");
  console.log("  ✔  dist/primitives.css");

  // 2. dist/tokens.css — semantic vars (light on :root, dark on [data-theme="dark"])
  const lightColor = resolveSection(semantic.light.color, primitives);
  const lightShadow = resolveSection(semantic.light.shadow, primitives);
  const darkColor = resolveSection(semantic.dark.color, primitives);
  const darkShadow = resolveSection(semantic.dark.shadow, primitives);
  const radius = resolveSection(semantic.radius as unknown as Record<string, string>, primitives);

  const tokensCss = [
    ":root {",
    renderVars(lightColor, "color-"),
    renderVars(lightShadow, "shadow-"),
    renderVars(radius, "radius-"),
    "}",
    "",
    '[data-theme="dark"] {',
    renderVars(darkColor, "color-"),
    renderVars(darkShadow, "shadow-"),
    "}",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(distDir, "tokens.css"), tokensCss, "utf-8");
  console.log("  ✔  dist/tokens.css");

  // 3. dist/tailwind.css — @theme block mapping utility classes to semantic vars
  const allSemanticVars = [
    ...Object.keys(lightColor).map((k) => `color-${k}`),
    ...Object.keys(lightShadow).map((k) => `shadow-${k}`),
    ...Object.keys(radius).map((k) => `radius-${k}`),
  ];
  const tailwindCss = `@theme {\n${allSemanticVars.map((v) => `  --${v}: var(--${v});`).join("\n")}\n}\n`;
  fs.writeFileSync(path.join(distDir, "tailwind.css"), tailwindCss, "utf-8");
  console.log("  ✔  dist/tailwind.css");

  console.log("\nDone.\n");
}

build();

export { build };
