import { expect, test } from "vite-plus/test";
import { cssVar } from "../src/index.js";

test("cssVar wraps token name in var()", () => {
  expect(cssVar("color-primary")).toBe("var(--color-primary)");
});

test("cssVar accepts ink ramp tokens", () => {
  expect(cssVar("color-ink-1")).toBe("var(--color-ink-1)");
  expect(cssVar("color-ink-5")).toBe("var(--color-ink-5)");
});

test("cssVar accepts line and surface ramp tokens", () => {
  expect(cssVar("color-line")).toBe("var(--color-line)");
  expect(cssVar("color-line-2")).toBe("var(--color-line-2)");
  expect(cssVar("color-surface")).toBe("var(--color-surface)");
  expect(cssVar("color-surface-2")).toBe("var(--color-surface-2)");
  expect(cssVar("color-surface-3")).toBe("var(--color-surface-3)");
});

test("primitives exports raw gray scale", async () => {
  const { primitives } = await import("../src/index.js");
  expect(primitives.color.gray["500"]).toMatch(/^oklch/);
  expect(Object.keys(primitives.color.gray)).toHaveLength(11);
});

test("primitives exports spacing and radius scales", async () => {
  const { primitives } = await import("../src/index.js");
  expect(primitives.spacing["4"]).toBe("4px");
  expect(primitives.radius.full).toBe("9999px");
});

test("semantic exports light + dark color sections", async () => {
  const { semantic } = await import("../src/index.js");
  expect(semantic.light.color["ink-1"]).toBe("{color.gray.900}");
  expect(semantic.dark.color["surface"]).toMatch(/^oklch/);
});
