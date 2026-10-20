import { expect, test } from "vite-plus/test";
import semantic from "../../tokens/src/semantic.json" with { type: "json" };
import { generateGlobalCss, tailwindThemeBlock } from "../src/themes/default";

test("CLI theme exposes every semantic token", () => {
  const css = generateGlobalCss("data-attribute");

  for (const key of Object.keys(semantic.light.color)) {
    expect(css).toContain(`--color-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-${key}:`);
  }

  for (const key of Object.keys(semantic.light.surface)) {
    expect(css).toContain(`--surface-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-surface-${key}:`);
  }

  for (const key of Object.keys(semantic.light.surfaceAlpha)) {
    expect(css).toContain(`--surface-alpha-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-surface-alpha-${key}:`);
  }

  for (const key of Object.keys(semantic.light.ink)) {
    expect(css).toContain(`--ink-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-ink-${key}:`);
  }

  for (const key of Object.keys(semantic.light.outline)) {
    expect(css).toContain(`--outline-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-outline-${key}:`);
  }

  for (const key of Object.keys(semantic.light.outlineAlpha)) {
    expect(css).toContain(`--outline-alpha-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-outline-alpha-${key}:`);
  }

  for (const key of Object.keys(semantic.light.shadow)) {
    expect(css).toContain(`--shadow-${key}:`);
    expect(tailwindThemeBlock).toContain(`--shadow-${key}:`);
  }

  for (const key of Object.keys(semantic.radius)) {
    expect(css).toContain(`--radius-${key}:`);
    expect(tailwindThemeBlock).toContain(`--radius-${key}:`);
  }
});

test("CLI theme emits dark semantic tokens", () => {
  const css = generateGlobalCss("data-attribute");

  for (const key of Object.keys(semantic.dark.surface)) {
    expect(css).toContain(`--surface-${key}:`);
  }

  for (const key of Object.keys(semantic.dark.focus)) {
    expect(css).toContain(`--focus-outline-${key}:`);
  }
});
