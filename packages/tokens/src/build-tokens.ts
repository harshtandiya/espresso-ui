import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Primitives = Record<string, unknown>;
type SemanticSection = {
  color: Record<string, string>;
  surface: Record<string, string>;
  surfaceAlpha: Record<string, string>;
  overlay: Record<string, string>;
  ink: Record<string, string>;
  outline: Record<string, string>;
  outlineAlpha: Record<string, string>;
  focus: Record<string, string>;
  shadow: Record<string, string>;
};
type Semantic = {
  light: SemanticSection;
  dark: SemanticSection;
  radius: Record<string, string>;
};

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

  // 1. dist/tokens.css — semantic vars (light on :root, dark on [data-theme="dark"])
  const lightColor = resolveSection(semantic.light.color, primitives);
  const lightSurface = resolveSection(semantic.light.surface, primitives);
  const lightSurfaceAlpha = resolveSection(semantic.light.surfaceAlpha, primitives);
  const lightOverlay = resolveSection(semantic.light.overlay, primitives);
  const lightInk = resolveSection(semantic.light.ink, primitives);
  const lightOutline = resolveSection(semantic.light.outline, primitives);
  const lightOutlineAlpha = resolveSection(semantic.light.outlineAlpha, primitives);
  const lightFocus = resolveSection(semantic.light.focus, primitives);
  const lightShadow = resolveSection(semantic.light.shadow, primitives);

  const darkColor = resolveSection(semantic.dark.color, primitives);
  const darkSurface = resolveSection(semantic.dark.surface, primitives);
  const darkSurfaceAlpha = resolveSection(semantic.dark.surfaceAlpha, primitives);
  const darkOverlay = resolveSection(semantic.dark.overlay, primitives);
  const darkInk = resolveSection(semantic.dark.ink, primitives);
  const darkOutline = resolveSection(semantic.dark.outline, primitives);
  const darkOutlineAlpha = resolveSection(semantic.dark.outlineAlpha, primitives);
  const darkFocus = resolveSection(semantic.dark.focus, primitives);
  const darkShadow = resolveSection(semantic.dark.shadow, primitives);

  const radius = resolveSection(semantic.radius, primitives);

  const tokensCss = [
    ":root {",
    renderVars(lightColor, "color-"),
    renderVars(lightSurface, "surface-"),
    renderVars(lightSurfaceAlpha, "surface-alpha-"),
    renderVars(lightOverlay, "color-"),
    renderVars(lightInk, "ink-"),
    renderVars(lightOutline, "outline-"),
    renderVars(lightOutlineAlpha, "outline-alpha-"),
    renderVars(lightFocus, "focus-outline-"),
    renderVars(lightShadow, "shadow-"),
    renderVars(radius, "radius-"),
    "}",
    "",
    '[data-theme="dark"] {',
    renderVars(darkColor, "color-"),
    renderVars(darkSurface, "surface-"),
    renderVars(darkSurfaceAlpha, "surface-alpha-"),
    renderVars(darkOverlay, "color-"),
    renderVars(darkInk, "ink-"),
    renderVars(darkOutline, "outline-"),
    renderVars(darkOutlineAlpha, "outline-alpha-"),
    renderVars(darkFocus, "focus-outline-"),
    renderVars(darkShadow, "shadow-"),
    "}",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(distDir, "tokens.css"), tokensCss, "utf-8");
  console.log("  ✔  dist/tokens.css");

  // 2. dist/tailwind.css — @theme block mapping utility classes to semantic vars
  const tailwindVars = [
    ...Object.keys(lightColor).map((k) => `--color-${k}: var(--color-${k});`),
    ...Object.keys(lightSurface).map((k) => `--color-surface-${k}: var(--surface-${k});`),
    ...Object.keys(lightSurfaceAlpha).map(
      (k) => `--color-surface-alpha-${k}: var(--surface-alpha-${k});`,
    ),
    ...Object.keys(lightOverlay).map((k) => `--color-${k}: var(--color-${k});`),
    ...Object.keys(lightInk).map((k) => `--color-ink-${k}: var(--ink-${k});`),
    ...Object.keys(lightOutline).map((k) => `--color-outline-${k}: var(--outline-${k});`),
    ...Object.keys(lightOutlineAlpha).map(
      (k) => `--color-outline-alpha-${k}: var(--outline-alpha-${k});`,
    ),
    ...Object.keys(lightShadow).map((k) => `--shadow-${k}: var(--shadow-${k});`),
    ...Object.keys(radius).map((k) => `--radius-${k}: var(--radius-${k});`),
  ];
  // @theme inline — utilities use var(--X) at runtime, but Tailwind does NOT
  // write its own :root block, so the actual OKLCH values from tokens.css are
  // never overridden by self-referential var() cycles.
  const tailwindCss = `@theme inline {\n${tailwindVars.join("\n")}\n}\n`;
  fs.writeFileSync(path.join(distDir, "tailwind.css"), tailwindCss, "utf-8");
  console.log("  ✔  dist/tailwind.css");

  console.log("\nDone.\n");
}

build();
