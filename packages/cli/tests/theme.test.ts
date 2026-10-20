import { expect, test } from "vite-plus/test";
import semantic from "../../tokens/src/semantic.json" with { type: "json" };
import { generateGlobalCss, tailwindThemeBlock } from "../src/themes/default";

test("CLI theme exposes every semantic token", () => {
  const css = generateGlobalCss("data-attribute");

  for (const key of Object.keys(semantic.light.color)) {
    expect(css).toContain(`--color-${key}:`);
    expect(tailwindThemeBlock).toContain(`--color-${key}:`);
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
