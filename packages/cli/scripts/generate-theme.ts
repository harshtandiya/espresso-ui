import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = path.resolve(__dirname, "../../tokens/src");
const OUT = path.resolve(__dirname, "../src/themes/default.ts");

type Section = Record<string, string>;
type SemanticSection = {
  color: Section;
  surface: Section;
  surfaceAlpha: Section;
  overlay: Section;
  ink: Section;
  outline: Section;
  outlineAlpha: Section;
  focus: Section;
  shadow: Section;
};
type Semantic = {
  light: SemanticSection;
  dark: SemanticSection;
  radius: Section;
};
type Primitives = Record<string, unknown>;

function resolveRef(value: string, primitives: Primitives): string {
  const match = /^\{(.+)\}$/.exec(value);
  if (!match) return value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic traversal
  let node: any = primitives;
  for (const part of match[1]!.split(".")) {
    if (node == null || typeof node !== "object") return value;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : value;
}

function resolveSection(section: Section, primitives: Primitives): Section {
  return Object.fromEntries(
    Object.entries(section).map(([key, value]) => [key, resolveRef(value, primitives)]),
  );
}

function renderVars(section: Section, prefix: string): string {
  return Object.entries(section)
    .map(([key, value]) => `  --${prefix}${key}: ${value};`)
    .join("\n");
}

function renderSection(section: SemanticSection, primitives: Primitives): string {
  const color = resolveSection(section.color, primitives);
  const surface = resolveSection(section.surface, primitives);
  const surfaceAlpha = resolveSection(section.surfaceAlpha, primitives);
  const overlay = resolveSection(section.overlay, primitives);
  const ink = resolveSection(section.ink, primitives);
  const outline = resolveSection(section.outline, primitives);
  const outlineAlpha = resolveSection(section.outlineAlpha, primitives);
  const focus = resolveSection(section.focus, primitives);
  const shadow = resolveSection(section.shadow, primitives);

  return [
    renderVars(color, "color-"),
    renderVars(surface, "surface-"),
    renderVars(surfaceAlpha, "surface-alpha-"),
    renderVars(overlay, "color-"),
    renderVars(ink, "ink-"),
    renderVars(outline, "outline-"),
    renderVars(outlineAlpha, "outline-alpha-"),
    renderVars(focus, "focus-outline-"),
    renderVars(shadow, "shadow-"),
  ].join("\n");
}

function renderTailwindVars(light: SemanticSection, radius: Section): string {
  const color = Object.keys(light.color);
  const surface = Object.keys(light.surface);
  const surfaceAlpha = Object.keys(light.surfaceAlpha);
  const overlay = Object.keys(light.overlay);
  const ink = Object.keys(light.ink);
  const outline = Object.keys(light.outline);
  const outlineAlpha = Object.keys(light.outlineAlpha);
  const shadow = Object.keys(light.shadow);

  return [
    ...color.map((key) => `  --color-${key}: var(--color-${key});`),
    ...surface.map((key) => `  --color-surface-${key}: var(--surface-${key});`),
    ...surfaceAlpha.map((key) => `  --color-surface-alpha-${key}: var(--surface-alpha-${key});`),
    ...overlay.map((key) => `  --color-${key}: var(--color-${key});`),
    ...ink.map((key) => `  --color-ink-${key}: var(--ink-${key});`),
    ...outline.map((key) => `  --color-outline-${key}: var(--outline-${key});`),
    ...outlineAlpha.map((key) => `  --color-outline-alpha-${key}: var(--outline-alpha-${key});`),
    ...shadow.map((key) => `  --shadow-${key}: var(--shadow-${key});`),
    ...Object.keys(radius).map((key) => `  --radius-${key}: var(--radius-${key});`),
  ].join("\n");
}

function main(): void {
  const primitives = JSON.parse(
    fs.readFileSync(path.join(TOKENS_DIR, "primitives.json"), "utf-8"),
  ) as Primitives;
  const semantic = JSON.parse(
    fs.readFileSync(path.join(TOKENS_DIR, "semantic.json"), "utf-8"),
  ) as Semantic;

  const radius = resolveSection(semantic.radius, primitives);
  const tailwindThemeBlock = `@theme inline {\n${renderTailwindVars(semantic.light, radius)}\n}`;
  const lightTokens = renderSection(semantic.light, primitives);
  const darkTokens = renderSection(semantic.dark, primitives);

  const output = `// Generated from packages/tokens/src/semantic.json.
// Run \`pnpm --filter @espresso-ui/cli generate-theme\` after changing tokens.

export const tailwindThemeBlock = \`${tailwindThemeBlock}\`;

export const lightTokens = \`${lightTokens}\`;

export const darkTokens = \`${darkTokens}\`;

export function getDarkModeSelector(darkMode: "data-attribute" | "class" | "media-query"): string {
  switch (darkMode) {
    case "data-attribute":
      return '[data-theme="dark"]';
    case "class":
      return ".dark";
    case "media-query":
      return "@media (prefers-color-scheme: dark)";
  }
}

export function generateGlobalCss(darkMode: "data-attribute" | "class" | "media-query"): string {
  const darkSelector = getDarkModeSelector(darkMode);
  const isMediaQuery = darkMode === "media-query";

  let css = \`/* Generated by espresso-ui — https://espresso-ui.dev */
@import "tailwindcss";

\${tailwindThemeBlock}

:root {
\${lightTokens}
}

\`;

  if (isMediaQuery) {
    css += \`\${darkSelector} {
  :root {
\${darkTokens}
  }
}
\`;
  } else {
    css += \`\${darkSelector} {
\${darkTokens}
}
\`;
  }

  return css;
}
`;

  fs.writeFileSync(OUT, output, "utf-8");
  console.log(`Generated → ${path.relative(process.cwd(), OUT)}`);
}

main();
